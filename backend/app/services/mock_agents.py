from __future__ import annotations

from typing import Any


AGENT_NAMES = [
    "Intent Parser",
    "Discovery Agent",
    "Product Analyst",
    "Pricing Analyst",
    "User Voice Analyst",
    "Market Signal Analyst",
    "Strength Advocate",
    "Weakness Critic",
    "Strategy Manager",
    "Risk Reviewer",
    "Battlecard Writer",
]


def _ids(evidence_lookup: dict[str, str], *keys: str) -> list[str]:
    return [evidence_lookup[key] for key in keys]


def build_agent_outputs(
    market: str,
    region: str,
    depth: str,
    competitors: list[dict[str, Any]],
    evidence_lookup: dict[str, str],
) -> list[dict[str, Any]]:
    direct = [item["name"] for item in competitors if item["category"] == "direct"]
    indirect = [item["name"] for item in competitors if item["category"] == "indirect"]

    return [
        {
            "agent_name": "Intent Parser",
            "input_summary": f"Parsed request for {market} in {region} at {depth} depth.",
            "output_json": {
                "intent": "competitive_analysis",
                "market": market,
                "region": region,
                "target_user": "product managers and startup teams",
                "depth": depth,
            },
            "output_markdown": "Intent resolved as competitive analysis. Supplier evaluation remains a future mode.",
            "evidence_ids": [],
        },
        {
            "agent_name": "Discovery Agent",
            "input_summary": "Used the stable sample discovery set for the AI coding tools workflow.",
            "output_json": {
                "market": "AI coding tools",
                "direct_competitors": direct,
                "indirect_competitors": indirect,
                "emerging_players": [],
                "rationale": "These products compete around AI-assisted software development workflows.",
            },
            "output_markdown": "Discovered five direct competitors and two indirect competitors for the mock AI coding tools dataset.",
            "evidence_ids": [],
        },
        {
            "agent_name": "Product Analyst",
            "input_summary": "Compared product workflows, target users, and differentiation claims.",
            "output_json": {
                "top_patterns": [
                    "AI-native editors focus on codebase context and agentic edits.",
                    "Ecosystem players compete through distribution and existing workflow adjacency.",
                    "Cloud agents differentiate through prompt-to-app and deployment workflows.",
                ],
                "feature_evidence_ids": _ids(
                    evidence_lookup,
                    "cursor_product",
                    "copilot_product",
                    "claude_product",
                    "windsurf_product",
                    "replit_product",
                ),
            },
            "output_markdown": "The market splits between AI-native IDEs, ecosystem assistants, terminal agents, and cloud app-building agents.",
            "evidence_ids": _ids(
                evidence_lookup,
                "cursor_product",
                "copilot_product",
                "claude_product",
                "windsurf_product",
                "replit_product",
            ),
        },
        {
            "agent_name": "Pricing Analyst",
            "input_summary": "Mapped free, pro, team, enterprise, and usage-sensitive packaging patterns.",
            "output_json": {
                "pricing_patterns": [
                    "Prosumer-to-team subscription",
                    "Ecosystem-bundled seats",
                    "Usage-sensitive agent capacity",
                ],
                "pricing_evidence_ids": _ids(
                    evidence_lookup,
                    "cursor_pricing",
                    "copilot_pricing",
                    "claude_pricing",
                    "replit_pricing",
                ),
            },
            "output_markdown": "Most competitors use a free or low-friction entry point, then monetize through paid seats, team plans, enterprise packaging, or usage-sensitive agent capacity.",
            "evidence_ids": _ids(
                evidence_lookup,
                "cursor_pricing",
                "copilot_pricing",
                "claude_pricing",
                "replit_pricing",
            ),
        },
        {
            "agent_name": "User Voice Analyst",
            "input_summary": "Synthesized mock review snippets into positive feedback, complaints, and unmet needs.",
            "output_json": {
                "positive_feedback": [
                    "Developers like integrated codebase-aware workflows.",
                    "Fast agent-assisted edits create a strong first impression.",
                ],
                "negative_feedback": [
                    "Pricing and usage limits can feel opaque.",
                    "Reliability and enterprise governance remain recurring concerns.",
                ],
                "unmet_needs": [
                    "More transparent usage controls",
                    "Enterprise-grade policy and auditability",
                    "Narrow workflows with measurable quality gains",
                ],
            },
            "output_markdown": "Mock user voice suggests a gap between impressive demos and dependable daily team workflows.",
            "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "windsurf_user_voice"),
        },
        {
            "agent_name": "Market Signal Analyst",
            "input_summary": "Assessed market-level forces in the mock dataset.",
            "output_json": {
                "signals": [
                    {
                        "signal": "Incumbent bundling increases distribution pressure.",
                        "impact": "Standalone AI coding products must win through differentiated workflow depth or brand pull.",
                        "evidence_ids": _ids(evidence_lookup, "market_incumbents"),
                    },
                    {
                        "signal": "Agentic workflows raise cost and latency exposure.",
                        "impact": "Pricing and model routing become strategic product decisions.",
                        "evidence_ids": _ids(evidence_lookup, "risk_model_cost"),
                    },
                ]
            },
            "output_markdown": "The strongest market pressure is not just model quality; it is distribution, workflow ownership, and cost control.",
            "evidence_ids": _ids(evidence_lookup, "market_incumbents", "risk_model_cost"),
        },
        {
            "agent_name": "Strength Advocate",
            "input_summary": "Argued the positive case for leading competitors.",
            "output_json": {
                "argument": "The strongest competitors have either workflow ownership, ecosystem distribution, or an end-to-end automation wedge.",
                "supporting_points": [
                    "Cursor and Windsurf create focused AI-native coding environments.",
                    "GitHub Copilot benefits from developer ecosystem bundling.",
                    "Replit Agent and Devin broaden the frame from coding assistance to software task execution.",
                ],
            },
            "output_markdown": "The bull case is that AI coding tools become the new control surface for software creation.",
            "evidence_ids": _ids(
                evidence_lookup,
                "cursor_product",
                "windsurf_product",
                "copilot_positioning",
                "replit_product",
                "devin_positioning",
            ),
        },
        {
            "agent_name": "Weakness Critic",
            "input_summary": "Argued the negative case and searched for strategic openings.",
            "output_json": {
                "argument": "Generic AI coding products face pressure from bundled incumbents, reliability expectations, enterprise requirements, and model-cost economics.",
                "weakness_points": [
                    "Standalone products must overcome incumbent distribution.",
                    "Generic coding assistance is increasingly commoditized.",
                    "Heavy agent usage can create margin and latency risk.",
                ],
            },
            "output_markdown": "The bear case is that generic AI coding converges into a feature bundle unless a product owns a sharper workflow.",
            "evidence_ids": _ids(
                evidence_lookup,
                "market_incumbents",
                "cursor_user_voice",
                "windsurf_user_voice",
                "risk_model_cost",
            ),
        },
        {
            "agent_name": "Strategy Manager",
            "input_summary": "Resolved advocate and critic arguments into a strategy recommendation.",
            "output_json": {
                "manager_view": "Do not build a generic Cursor clone. Target an underserved workflow where context, evaluation, and buyer urgency are sharper.",
                "opportunity_gaps": [
                    {
                        "gap": "AI coding for data analysts and SQL-heavy workflows",
                        "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "market_incumbents"),
                    },
                    {
                        "gap": "Enterprise code migration and modernization assistant",
                        "evidence_ids": _ids(evidence_lookup, "copilot_positioning", "risk_model_cost"),
                    },
                    {
                        "gap": "Governed team agent with transparent usage and audit controls",
                        "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "windsurf_user_voice"),
                    },
                ],
                "confidence": "medium",
            },
            "output_markdown": "Recommended strategy: avoid generic AI IDE competition and focus on vertical workflow specialization with evidence-backed governance and usage transparency.",
            "evidence_ids": _ids(
                evidence_lookup,
                "cursor_user_voice",
                "windsurf_user_voice",
                "copilot_positioning",
                "market_incumbents",
                "risk_model_cost",
            ),
        },
        {
            "agent_name": "Risk Reviewer",
            "input_summary": "Reviewed strategy risks across market, technical, commercial, and execution dimensions.",
            "output_json": {
                "risks": [
                    {
                        "risk": "Crowded market",
                        "severity": "high",
                        "mitigation": "Avoid generic positioning and focus on a narrow workflow wedge.",
                        "evidence_ids": _ids(evidence_lookup, "market_incumbents"),
                    },
                    {
                        "risk": "Model cost pressure",
                        "severity": "medium",
                        "mitigation": "Use model routing, caching, and usage-aware packaging.",
                        "evidence_ids": _ids(evidence_lookup, "risk_model_cost"),
                    },
                    {
                        "risk": "Trust gap for team adoption",
                        "severity": "medium",
                        "mitigation": "Invest early in transparent limits, auditability, and reliability measurement.",
                        "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "windsurf_user_voice"),
                    },
                ]
            },
            "output_markdown": "Risks are manageable if the product chooses a narrow buyer, designs for cost control, and makes trust features visible from day one.",
            "evidence_ids": _ids(
                evidence_lookup,
                "market_incumbents",
                "risk_model_cost",
                "cursor_user_voice",
                "windsurf_user_voice",
            ),
        },
        {
            "agent_name": "Battlecard Writer",
            "input_summary": "Compiled the evidence-grounded final report.",
            "output_json": {
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
                ]
            },
            "output_markdown": "Generated the final competitive battlecard with matrix rows and strategy recommendations linked to sample evidence cards.",
            "evidence_ids": list(evidence_lookup.values()),
        },
    ]


def build_final_report(
    evidence_lookup: dict[str, str],
    strategy_override: dict[str, Any] | None = None,
) -> dict[str, Any]:
    feature_matrix = [
        {
            "competitor": "Cursor",
            "target_user": "Developers and engineering teams",
            "core_features": "AI-native IDE, codebase chat, agentic editing",
            "ai_capability": "Strong",
            "team_features": "Medium",
            "enterprise": "Medium",
            "evidence_ids": _ids(evidence_lookup, "cursor_product", "cursor_user_voice"),
        },
        {
            "competitor": "GitHub Copilot",
            "target_user": "Developers, teams, and enterprises",
            "core_features": "IDE assistant, chat, pull request support, GitHub workflow adjacency",
            "ai_capability": "Strong",
            "team_features": "Strong",
            "enterprise": "Strong",
            "evidence_ids": _ids(evidence_lookup, "copilot_product", "copilot_positioning"),
        },
        {
            "competitor": "Claude Code",
            "target_user": "Developers comfortable with terminal workflows",
            "core_features": "Terminal-native agent, repository edits, debugging support",
            "ai_capability": "Strong",
            "team_features": "Medium",
            "enterprise": "Medium",
            "evidence_ids": _ids(evidence_lookup, "claude_product", "claude_pricing"),
        },
        {
            "competitor": "Windsurf",
            "target_user": "Developers seeking AI-assisted flow-state coding",
            "core_features": "AI coding environment, codebase context, flow-aware agent assistance",
            "ai_capability": "Strong",
            "team_features": "Medium",
            "enterprise": "Medium",
            "evidence_ids": _ids(evidence_lookup, "windsurf_product", "windsurf_user_voice"),
        },
        {
            "competitor": "Replit Agent",
            "target_user": "Builders, founders, students, and lightweight app teams",
            "core_features": "Prompt-to-app creation, cloud runtime, deployment workflow",
            "ai_capability": "Strong",
            "team_features": "Medium",
            "enterprise": "Low",
            "evidence_ids": _ids(evidence_lookup, "replit_product", "replit_pricing"),
        },
    ]

    pricing_matrix = [
        {
            "competitor": "Cursor",
            "free_tier": "Yes",
            "pro": "Yes",
            "team": "Yes",
            "enterprise": "Yes",
            "pricing_strategy": "Prosumer-to-team subscription",
            "evidence_ids": _ids(evidence_lookup, "cursor_pricing"),
        },
        {
            "competitor": "GitHub Copilot",
            "free_tier": "Limited/free entry",
            "pro": "Yes",
            "team": "Yes",
            "enterprise": "Yes",
            "pricing_strategy": "Ecosystem-bundled seats",
            "evidence_ids": _ids(evidence_lookup, "copilot_pricing", "copilot_positioning"),
        },
        {
            "competitor": "Claude Code",
            "free_tier": "Unknown in mock",
            "pro": "Usage-sensitive",
            "team": "Likely via broader plan",
            "enterprise": "Likely via broader plan",
            "pricing_strategy": "Model-usage-linked economics",
            "evidence_ids": _ids(evidence_lookup, "claude_pricing", "risk_model_cost"),
        },
        {
            "competitor": "Windsurf",
            "free_tier": "Yes",
            "pro": "Yes",
            "team": "Yes",
            "enterprise": "Developing",
            "pricing_strategy": "AI editor adoption wedge",
            "evidence_ids": _ids(evidence_lookup, "windsurf_product", "windsurf_user_voice"),
        },
        {
            "competitor": "Replit Agent",
            "free_tier": "Yes",
            "pro": "Yes",
            "team": "Yes",
            "enterprise": "Selective",
            "pricing_strategy": "Seat plus hosted usage",
            "evidence_ids": _ids(evidence_lookup, "replit_pricing"),
        },
    ]

    user_pain_points = [
        {
            "pain_point": "Opaque usage limits and cost predictability",
            "why_it_matters": "Teams need spend controls before rolling out agentic coding broadly.",
            "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "risk_model_cost"),
        },
        {
            "pain_point": "Reliability gap between demos and production workflows",
            "why_it_matters": "PM and engineering buyers need consistent success rates, not just impressive one-off edits.",
            "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "windsurf_user_voice"),
        },
        {
            "pain_point": "Enterprise governance and auditability",
            "why_it_matters": "Enterprise adoption depends on controls around data access, permissions, and review.",
            "evidence_ids": _ids(evidence_lookup, "windsurf_user_voice", "copilot_positioning"),
        },
    ]

    opportunity_gaps = [
        {
            "gap": "Vertical workflow for SQL-heavy data analysts",
            "rationale": "Generic AI IDEs may underserve analysts who debug SQL, notebooks, dashboards, and warehouse workflows.",
            "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "market_incumbents"),
        },
        {
            "gap": "Enterprise modernization assistant",
            "rationale": "A focused migration product can compete on repeatable outcomes instead of generic coding breadth.",
            "evidence_ids": _ids(evidence_lookup, "copilot_positioning", "risk_model_cost"),
        },
        {
            "gap": "Governed team agent with transparent usage controls",
            "rationale": "Trust, limits, and auditability are recurring unmet needs in the mock user voice.",
            "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "windsurf_user_voice"),
        },
    ]

    risks = [
        {
            "risk": "Crowded market",
            "severity": "High",
            "mitigation": "Avoid a generic AI IDE clone and choose a narrow workflow wedge.",
            "evidence_ids": _ids(evidence_lookup, "market_incumbents"),
        },
        {
            "risk": "Model cost pressure",
            "severity": "Medium",
            "mitigation": "Add routing, caching, and usage-aware packaging before broad release.",
            "evidence_ids": _ids(evidence_lookup, "risk_model_cost"),
        },
        {
            "risk": "Trust and reliability expectations",
            "severity": "Medium",
            "mitigation": "Expose success metrics, limits, logs, and review controls in the product experience.",
            "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "windsurf_user_voice"),
        },
    ]

    title = "Competitive Battlecard: AI Coding Tools"
    executive_summary = (
        "AI coding tools are converging around codebase-aware assistance, agentic edits, and team workflows. "
        "The strongest competitors either own a focused coding surface, benefit from ecosystem distribution, "
        "or expand the job-to-be-done into autonomous software execution."
    )
    competitor_landscape = (
        "Cursor, Claude Code, Windsurf, and Replit Agent compete directly through AI-native creation workflows. "
        "GitHub Copilot is the most important ecosystem-distribution competitor. Devin and Codex are indirect "
        "competitors because they reframe competition around autonomous engineering and repository-level agents."
    )
    debate_summary = (
        "Strength Advocate argues that AI coding tools can become the new control surface for software work. "
        "Weakness Critic counters that generic capabilities will be bundled by incumbents and pressured by cost, "
        "reliability, and governance demands."
    )
    recommended_strategy = (
        "Do not build a generic Cursor clone. Build for a sharper underserved workflow such as SQL-heavy analyst "
        "coding, enterprise modernization, or governed team agents with transparent usage controls. This strategy "
        f"is supported by evidence {', '.join(_ids(evidence_lookup, 'cursor_user_voice', 'market_incumbents', 'risk_model_cost'))}."
    )

    if strategy_override:
        opportunity_gaps = strategy_override.get("opportunity_gaps", opportunity_gaps)
        risks = strategy_override.get("risks", risks)
        recommended_strategy = strategy_override.get("recommended_strategy", recommended_strategy)

    all_evidence = list(evidence_lookup.values())
    markdown = f"""# {title}

## 1. Executive Summary
{executive_summary}

## 2. Competitor Landscape
{competitor_landscape}

## 3. Feature Matrix
The feature matrix compares target users, core workflow, AI capability, team readiness, and enterprise readiness. Each row includes evidence IDs.

## 4. Pricing Matrix
The pricing matrix compares free entry, pro, team, enterprise, and packaging strategy. Each row includes evidence IDs.

## 5. User Pain Points
The strongest unmet needs are transparent usage limits, reliability, enterprise governance, and workflow-specific outcomes.

## 6. Strength vs Weakness Debate
{debate_summary}

## 7. Opportunity Gaps
Focus on vertical workflows, enterprise modernization, or governed team agents rather than generic coding assistance.

## 8. Recommended Strategy
{recommended_strategy}

## 9. Risks and Next Steps
Prioritize market wedge selection, cost-aware architecture, and trust primitives before adding real-time search or real LLM agents.

## 10. Evidence Appendix
All evidence in v0.6 is evidence-card grounded. Sample source cards still expose mock:// metadata URLs for auditability. Evidence IDs: {", ".join(all_evidence)}
"""

    return {
        "title": title,
        "executive_summary": executive_summary,
        "competitor_landscape": competitor_landscape,
        "feature_matrix": feature_matrix,
        "pricing_matrix": pricing_matrix,
        "user_pain_points": user_pain_points,
        "debate_summary": debate_summary,
        "opportunity_gaps": opportunity_gaps,
        "recommended_strategy": recommended_strategy,
        "risks": risks,
        "evidence_ids": all_evidence,
        "markdown": markdown,
    }
