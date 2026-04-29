from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class AgentSpec:
    node_name: str
    display_name: str
    role: str
    depends_on: list[str]
    state_reads: list[str]
    state_writes: list[str]
    tools_used: list[str]
    subroles: list[str]


AGENT_SPECS: dict[str, AgentSpec] = {
    "discovery_agent": AgentSpec(
        node_name="discovery_agent",
        display_name="Discovery Agent",
        role="Defines the market scope, discovers competitors, and prepares traceable evidence.",
        depends_on=[],
        state_reads=["run_id", "market", "region", "depth"],
        state_writes=["intent", "competitors", "evidence_cards", "evidence_lookup"],
        tools_used=["intent_parser", "mock_source_collector", "evidence_normalizer"],
        subroles=[],
    ),
    "competitive_analyst": AgentSpec(
        node_name="competitive_analyst",
        display_name="Competitive Analyst",
        role="Synthesizes product, pricing, user voice, and market signals into competitive analysis.",
        depends_on=["discovery_agent"],
        state_reads=["competitors", "evidence_lookup"],
        state_writes=["analysis"],
        tools_used=["product_analysis", "pricing_analysis", "user_voice_analysis", "market_signal_analysis"],
        subroles=[],
    ),
    "debate_agent": AgentSpec(
        node_name="debate_agent",
        display_name="Debate Agent",
        role="Runs an internal strength-vs-weakness debate to stress-test competitive assumptions.",
        depends_on=["competitive_analyst"],
        state_reads=["analysis", "evidence_lookup"],
        state_writes=["debate"],
        tools_used=["evidence_grounding"],
        subroles=["strength_advocate", "weakness_critic"],
    ),
    "strategy_agent": AgentSpec(
        node_name="strategy_agent",
        display_name="Strategy Agent",
        role="Converts the debate into opportunity gaps, strategy, risks, and mitigations.",
        depends_on=["debate_agent"],
        state_reads=["analysis", "debate", "evidence_lookup"],
        state_writes=["strategy"],
        tools_used=["strategy_manager", "risk_reviewer"],
        subroles=[],
    ),
    "report_agent": AgentSpec(
        node_name="report_agent",
        display_name="Report Agent",
        role="Assembles the final evidence-grounded competitive battlecard.",
        depends_on=["strategy_agent"],
        state_reads=["analysis", "debate", "strategy", "evidence_lookup"],
        state_writes=["final_report"],
        tools_used=["battlecard_writer"],
        subroles=[],
    ),
}


def make_agent_output(
    spec: AgentSpec,
    input_summary: str,
    result: dict[str, Any],
    output_markdown: str,
    evidence_ids: list[str] | None = None,
    tools_used: list[str] | None = None,
    subroles: list[str] | None = None,
    execution_mode: str = "mock",
    model_name: str | None = None,
    fallback_reason: str | None = None,
) -> dict[str, Any]:
    return {
        "agent_name": spec.display_name,
        "input_summary": input_summary,
        "output_json": {
            "contract_version": "v0.6",
            "node_name": spec.node_name,
            "display_name": spec.display_name,
            "role": spec.role,
            "depends_on": spec.depends_on,
            "state_keys_read": spec.state_reads,
            "state_keys_written": spec.state_writes,
            "tools_used": tools_used if tools_used is not None else spec.tools_used,
            "subroles": subroles if subroles is not None else spec.subroles,
            "execution_mode": execution_mode,
            "model_name": model_name,
            "fallback_reason": fallback_reason,
            "result": result,
        },
        "output_markdown": output_markdown,
        "evidence_ids": evidence_ids or [],
    }


def make_trace_event(spec: AgentSpec) -> dict[str, Any]:
    return {
        "node_name": spec.node_name,
        "display_name": spec.display_name,
        "depends_on": spec.depends_on,
        "state_keys_read": spec.state_reads,
        "state_keys_written": spec.state_writes,
        "tools_used": spec.tools_used,
        "subroles": spec.subroles,
        "status": "completed",
    }
