from __future__ import annotations

from typing import Any

from ..llm import generate_strategy_with_fallback
from ..mock_agents import build_final_report
from ..mock_sources import competitor_blueprints
from .contracts import AGENT_SPECS, make_agent_output, make_trace_event
from .state import ResearchGraphState
from .tools import collect_mock_sources, normalize_evidence_cards


def discovery_agent_node(state: ResearchGraphState) -> dict[str, Any]:
    spec = AGENT_SPECS["discovery_agent"]
    intent = {
        "intent": "competitive_analysis",
        "market": state["market"],
        "region": state["region"],
        "target_user": "product managers and startup teams",
        "depth": state["depth"],
    }
    competitors = competitor_blueprints()
    raw_sources = collect_mock_sources()
    evidence_cards, evidence_lookup = normalize_evidence_cards(state["run_id"], raw_sources)
    direct = [item["name"] for item in competitors if item["category"] == "direct"]
    indirect = [item["name"] for item in competitors if item["category"] == "indirect"]
    result = {
        "intent": intent,
        "direct_competitors": direct,
        "indirect_competitors": indirect,
        "competitor_count": len(competitors),
        "raw_source_count": len(raw_sources),
        "evidence_card_count": len(evidence_cards),
        "source_policy": "Sample Dataset sources remain traceable through mock:// metadata URLs.",
    }
    return _node_update(
        spec.node_name,
        {
            "intent": intent,
            "competitors": competitors,
            "evidence_cards": evidence_cards,
            "evidence_lookup": evidence_lookup,
        },
        input_summary=f"Scoped {state['market']}, discovered competitors, and prepared evidence.",
        result=result,
        output_markdown="Parsed the research intent, discovered the AI coding tools competitor set, collected sample source notes, and normalized them into traceable evidence cards.",
        evidence_ids=list(evidence_lookup.values()),
    )


def competitive_analyst_node(state: ResearchGraphState) -> dict[str, Any]:
    spec = AGENT_SPECS["competitive_analyst"]
    report_preview = build_final_report(state["evidence_lookup"])
    evidence_lookup = state["evidence_lookup"]
    result = {
        "product_patterns": [
            "AI-native editors focus on codebase context and agentic edits.",
            "Ecosystem players compete through distribution and existing workflow adjacency.",
            "Cloud agents differentiate through prompt-to-app and deployment workflows.",
        ],
        "pricing_patterns": [
            "Prosumer-to-team subscription",
            "Ecosystem-bundled seats",
            "Usage-sensitive agent capacity",
        ],
        "market_signals": [
            {
                "signal": "Incumbent bundling increases distribution pressure.",
                "evidence_ids": _ids(evidence_lookup, "market_incumbents"),
            },
            {
                "signal": "Agentic workflows raise cost and latency exposure.",
                "evidence_ids": _ids(evidence_lookup, "risk_model_cost"),
            },
        ],
        "feature_matrix": report_preview["feature_matrix"],
        "pricing_matrix": report_preview["pricing_matrix"],
        "user_pain_points": report_preview["user_pain_points"],
    }
    evidence_ids = _ids(
        evidence_lookup,
        "cursor_product",
        "copilot_product",
        "claude_product",
        "windsurf_product",
        "replit_product",
        "cursor_pricing",
        "copilot_pricing",
        "claude_pricing",
        "replit_pricing",
        "cursor_user_voice",
        "windsurf_user_voice",
        "market_incumbents",
        "risk_model_cost",
    )
    return _node_update(
        spec.node_name,
        {"analysis": result},
        input_summary="Synthesized product, pricing, user voice, and market signals into one competitive analysis.",
        result={
            "product_patterns": result["product_patterns"],
            "pricing_patterns": result["pricing_patterns"],
            "market_signal_count": len(result["market_signals"]),
            "feature_rows": len(result["feature_matrix"]),
            "pricing_rows": len(result["pricing_matrix"]),
            "pain_point_count": len(result["user_pain_points"]),
        },
        output_markdown="Combined the original product, pricing, user voice, and market signal analysts into a single competitive analysis pass.",
        evidence_ids=evidence_ids,
    )


def debate_agent_node(state: ResearchGraphState) -> dict[str, Any]:
    spec = AGENT_SPECS["debate_agent"]
    evidence_lookup = state["evidence_lookup"]
    strength_evidence = _ids(
        evidence_lookup,
        "cursor_product",
        "windsurf_product",
        "copilot_positioning",
        "replit_product",
        "devin_positioning",
    )
    weakness_evidence = _ids(
        evidence_lookup,
        "market_incumbents",
        "cursor_user_voice",
        "windsurf_user_voice",
        "risk_model_cost",
    )
    result = {
        "strength_case": {
            "argument": "The strongest competitors have either workflow ownership, ecosystem distribution, or an end-to-end automation wedge.",
            "supporting_points": [
                "Cursor and Windsurf create focused AI-native coding environments.",
                "GitHub Copilot benefits from developer ecosystem bundling.",
                "Replit Agent and Devin broaden the frame from coding assistance to software task execution.",
            ],
            "evidence_ids": strength_evidence,
        },
        "weakness_case": {
            "argument": "Generic AI coding products face pressure from bundled incumbents, reliability expectations, enterprise requirements, and model-cost economics.",
            "weakness_points": [
                "Standalone products must overcome incumbent distribution.",
                "Generic coding assistance is increasingly commoditized.",
                "Heavy agent usage can create margin and latency risk.",
            ],
            "evidence_ids": weakness_evidence,
        },
        "synthesis": "The market rewards workflow ownership, but generic AI coding features are vulnerable to bundling and margin pressure.",
    }
    return _node_update(
        spec.node_name,
        {"debate": result},
        input_summary="Ran strength advocate and weakness critic subroles against the analysis state.",
        result=result,
        output_markdown="Stress-tested the market with two internal subroles: a strength advocate and a weakness critic.",
        evidence_ids=sorted(set(strength_evidence + weakness_evidence)),
    )


def strategy_agent_node(state: ResearchGraphState) -> dict[str, Any]:
    spec = AGENT_SPECS["strategy_agent"]
    generation = generate_strategy_with_fallback(
        analysis=state["analysis"],
        debate=state["debate"],
        evidence_cards=state["evidence_cards"],
        evidence_lookup=state["evidence_lookup"],
    )
    result = generation.strategy
    strategy_evidence = result.get("evidence_ids", [])
    mode_note = "using a real LLM call" if generation.execution_mode == "llm" else "using deterministic mock fallback"
    fallback_suffix = f" Fallback reason: {generation.fallback_reason}" if generation.fallback_reason else ""
    return _node_update(
        spec.node_name,
        {"strategy": result},
        input_summary="Converted debate outputs into opportunity gaps, strategy, risks, and mitigations.",
        result=result,
        output_markdown=f"Resolved the debate into opportunity gaps, strategy, and risks {mode_note}.{fallback_suffix}",
        evidence_ids=strategy_evidence,
        execution_mode=generation.execution_mode,
        model_name=generation.model_name,
        fallback_reason=generation.fallback_reason,
    )


def report_agent_node(state: ResearchGraphState) -> dict[str, Any]:
    spec = AGENT_SPECS["report_agent"]
    final_report = build_final_report(state["evidence_lookup"], strategy_override=state.get("strategy"))
    result = {
        "report_title": final_report["title"],
        "sections": [
            "Executive Summary",
            "Competitor Landscape",
            "Feature Matrix",
            "Pricing Matrix",
            "User Pain Points",
            "Strength vs Weakness Debate",
            "Opportunity Gaps",
            "Recommended Strategy",
            "Risks and Next Steps",
            "Evidence Appendix",
        ],
        "evidence_count": len(final_report["evidence_ids"]),
    }
    return _node_update(
        spec.node_name,
        {"final_report": final_report},
        input_summary="Assembled the final evidence-grounded report from analysis, debate, strategy, and evidence state.",
        result=result,
        output_markdown="Generated the final competitive battlecard with matrix rows and strategy recommendations linked to sample evidence cards.",
        evidence_ids=final_report["evidence_ids"],
    )


def _node_update(
    node_name: str,
    state_update: dict[str, Any],
    input_summary: str,
    result: dict[str, Any],
    output_markdown: str,
    evidence_ids: list[str] | None = None,
    execution_mode: str = "mock",
    model_name: str | None = None,
    fallback_reason: str | None = None,
) -> dict[str, Any]:
    spec = AGENT_SPECS[node_name]
    return {
        **state_update,
        "agent_outputs": [
            make_agent_output(
                spec=spec,
                input_summary=input_summary,
                result=result,
                output_markdown=output_markdown,
                evidence_ids=evidence_ids,
                execution_mode=execution_mode,
                model_name=model_name,
                fallback_reason=fallback_reason,
            )
        ],
        "execution_trace": [make_trace_event(spec)],
    }


def _ids(evidence_lookup: dict[str, str], *keys: str) -> list[str]:
    return [evidence_lookup[key] for key in keys]
