from __future__ import annotations

import operator
from typing import Annotated, Any, TypedDict


class ResearchGraphState(TypedDict, total=False):
    run_id: str
    market: str
    region: str
    depth: str
    mode: str
    demo_note: str | None
    intent: dict[str, Any]
    competitors: list[dict[str, Any]]
    evidence_cards: list[dict[str, Any]]
    evidence_lookup: dict[str, str]
    analysis: dict[str, Any]
    debate: dict[str, Any]
    strategy: dict[str, Any]
    final_report: dict[str, Any]
    agent_outputs: Annotated[list[dict[str, Any]], operator.add]
    execution_trace: Annotated[list[dict[str, Any]], operator.add]
