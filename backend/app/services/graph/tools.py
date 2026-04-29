from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from ..mock_sources import evidence_blueprints


def collect_mock_sources() -> list[dict[str, Any]]:
    return evidence_blueprints()


def normalize_evidence_cards(run_id: str, raw_sources: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], dict[str, str]]:
    evidence_cards: list[dict[str, Any]] = []
    evidence_lookup: dict[str, str] = {}
    timestamp = datetime.now(timezone.utc).isoformat()

    for index, source in enumerate(raw_sources, start=1):
        evidence_id = f"ev_{index:03d}_{run_id[:6]}"
        evidence_lookup[source["key"]] = evidence_id
        evidence_cards.append(
            {
                "id": evidence_id,
                "competitor_name": source.get("competitor"),
                "source_title": source.get("source_title"),
                "source_type": source["source_type"],
                "source_url": source.get("source_url"),
                "dimension": source["dimension"],
                "claim": source["claim"],
                "evidence_text": source["evidence_text"],
                "confidence": source["confidence"],
                "collected_at": timestamp,
                "extracted_at": timestamp,
            }
        )

    return evidence_cards, evidence_lookup
