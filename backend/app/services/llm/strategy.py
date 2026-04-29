from __future__ import annotations

from dataclasses import dataclass
import json
from typing import Any

import httpx
from pydantic import ValidationError

from .openai_compatible import OpenAICompatibleClient
from .schemas import StrategyLLMOutput
from .settings import get_llm_settings


@dataclass(frozen=True)
class StrategyGeneration:
    strategy: dict[str, Any]
    execution_mode: str
    model_name: str | None = None
    fallback_reason: str | None = None


def generate_strategy_with_fallback(
    analysis: dict[str, Any],
    debate: dict[str, Any],
    evidence_cards: list[dict[str, Any]],
    evidence_lookup: dict[str, str],
) -> StrategyGeneration:
    mock_strategy = build_mock_strategy(evidence_lookup)
    settings = get_llm_settings()

    if not settings.enabled:
        return StrategyGeneration(
            strategy=mock_strategy,
            execution_mode="mock_fallback",
            fallback_reason="ENABLE_LLM_STRATEGY is not true",
        )
    if not settings.api_key:
        return StrategyGeneration(
            strategy=mock_strategy,
            execution_mode="mock_fallback",
            fallback_reason="OPENAI_API_KEY is not configured",
        )

    try:
        client = OpenAICompatibleClient(
            api_key=settings.api_key,
            base_url=settings.base_url,
            model=settings.model,
            timeout_seconds=settings.timeout_seconds,
        )
        response = client.complete_json(
            system_prompt=_system_prompt(),
            user_prompt=_user_prompt(analysis, debate, evidence_cards),
        )
        parsed = _parse_json_object(response.content)
        validated = StrategyLLMOutput.model_validate(parsed)
        _validate_evidence_ids(validated, evidence_cards)
        return StrategyGeneration(
            strategy=validated.model_dump(),
            execution_mode="llm",
            model_name=response.model,
        )
    except (httpx.HTTPError, ValidationError, ValueError, KeyError, TypeError, json.JSONDecodeError) as exc:
        return StrategyGeneration(
            strategy=mock_strategy,
            execution_mode="mock_fallback",
            model_name=settings.model,
            fallback_reason=f"{exc.__class__.__name__}: {str(exc)[:240]}",
        )


def build_mock_strategy(evidence_lookup: dict[str, str]) -> dict[str, Any]:
    strategy_evidence = _ids(
        evidence_lookup,
        "cursor_user_voice",
        "windsurf_user_voice",
        "copilot_positioning",
        "market_incumbents",
        "risk_model_cost",
    )
    return {
        "manager_view": "Do not build a generic Cursor clone. Target an underserved workflow where context, evaluation, and buyer urgency are sharper.",
        "opportunity_gaps": [
            {
                "gap": "AI coding for data analysts and SQL-heavy workflows",
                "rationale": "Analyst workflows mix SQL, notebooks, dashboards, and warehouse context that generic AI IDEs may underserve.",
                "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "market_incumbents"),
            },
            {
                "gap": "Enterprise code migration and modernization assistant",
                "rationale": "A focused migration product can compete on repeatable outcomes instead of generic coding breadth.",
                "evidence_ids": _ids(evidence_lookup, "copilot_positioning", "risk_model_cost"),
            },
            {
                "gap": "Governed team agent with transparent usage and audit controls",
                "rationale": "Trust, limits, and auditability are recurring unmet needs in the mock user voice.",
                "evidence_ids": _ids(evidence_lookup, "cursor_user_voice", "windsurf_user_voice"),
            },
        ],
        "recommended_strategy": "Avoid generic AI IDE competition and focus on vertical workflow specialization with evidence-backed governance and usage transparency.",
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
        ],
        "confidence": "medium",
        "evidence_ids": strategy_evidence,
    }


def _system_prompt() -> str:
    return (
        "You are the Strategy Agent in CompeteOps, a competitive intelligence workflow. "
        "Return only valid JSON. You must ground every recommendation, opportunity gap, and risk in provided evidence IDs. "
        "Do not invent evidence IDs, URLs, products, or facts."
    )


def _user_prompt(analysis: dict[str, Any], debate: dict[str, Any], evidence_cards: list[dict[str, Any]]) -> str:
    compact_evidence = [
        {
            "id": card["id"],
            "dimension": card["dimension"],
            "competitor": card.get("competitor_name") or "Market-level",
            "claim": card["claim"],
            "evidence_text": card["evidence_text"],
        }
        for card in evidence_cards
    ]
    return json.dumps(
        {
            "task": "Create a product strategy recommendation for an AI coding tools competitive battlecard.",
            "required_json_schema": {
                "manager_view": "string",
                "opportunity_gaps": [
                    {"gap": "string", "rationale": "string", "evidence_ids": ["ev_..."]}
                ],
                "recommended_strategy": "string",
                "risks": [
                    {
                        "risk": "string",
                        "severity": "low|medium|high",
                        "mitigation": "string",
                        "evidence_ids": ["ev_..."],
                    }
                ],
                "confidence": "low|medium|high",
                "evidence_ids": ["ev_..."],
            },
            "analysis": analysis,
            "debate": debate,
            "evidence_cards": compact_evidence,
        },
        ensure_ascii=True,
    )


def _parse_json_object(content: str) -> dict[str, Any]:
    stripped = content.strip()
    if stripped.startswith("```"):
        stripped = stripped.strip("`")
        if stripped.lower().startswith("json"):
            stripped = stripped[4:].strip()
    if not stripped.startswith("{"):
        start = stripped.find("{")
        end = stripped.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise ValueError("LLM response did not contain a JSON object")
        stripped = stripped[start : end + 1]
    parsed = json.loads(stripped)
    if not isinstance(parsed, dict):
        raise ValueError("LLM response JSON root must be an object")
    return parsed


def _validate_evidence_ids(output: StrategyLLMOutput, evidence_cards: list[dict[str, Any]]) -> None:
    allowed = {card["id"] for card in evidence_cards}
    used = set(output.evidence_ids)
    for gap in output.opportunity_gaps:
        used.update(gap.evidence_ids)
    for risk in output.risks:
        used.update(risk.evidence_ids)
    unknown = sorted(used - allowed)
    if unknown:
        raise ValueError(f"LLM returned unknown evidence IDs: {', '.join(unknown)}")


def _ids(evidence_lookup: dict[str, str], *keys: str) -> list[str]:
    return [evidence_lookup[key] for key in keys]

