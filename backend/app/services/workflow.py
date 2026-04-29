from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from .. import models, schemas
from .graph import run_research_graph
from .graph.state import ResearchGraphState
from .mock_sources import demo_note_for_market


def create_research_run(db: Session, payload: schemas.ResearchRunCreate) -> models.ResearchRun:
    run = models.ResearchRun(
        market=payload.market.strip(),
        region=payload.region.strip() or "Global",
        depth=payload.depth.strip() or "Standard",
        mode="competitive_analysis",
        status="pending",
        demo_note=demo_note_for_market(payload.market),
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    execute_mock_workflow(db, run)
    db.refresh(run)
    return run


def execute_mock_workflow(db: Session, run: models.ResearchRun) -> None:
    run.status = "running"
    run.updated_at = _now()
    db.commit()

    try:
        graph_state = run_research_graph(
            ResearchGraphState(
                run_id=run.id,
                market=run.market,
                region=run.region,
                depth=run.depth,
                mode=run.mode,
                demo_note=run.demo_note,
                agent_outputs=[],
                execution_trace=[],
            )
        )
        competitors = _create_competitors(db, run, graph_state["competitors"])
        _create_evidence(db, run, graph_state["evidence_cards"], competitors)
        _create_agent_outputs(db, run, graph_state["agent_outputs"])
        _create_final_report(db, run, graph_state["final_report"])
        run.status = "completed"
        run.updated_at = _now()
        db.commit()
    except Exception:
        db.rollback()
        run.status = "failed"
        run.updated_at = _now()
        db.add(run)
        db.commit()
        raise


def _create_competitors(
    db: Session,
    run: models.ResearchRun,
    competitor_payload: list[dict[str, Any]],
) -> dict[str, models.Competitor]:
    competitors: dict[str, models.Competitor] = {}
    for item in competitor_payload:
        competitor = models.Competitor(run_id=run.id, **item)
        db.add(competitor)
        competitors[item["name"]] = competitor
    db.commit()
    for competitor in competitors.values():
        db.refresh(competitor)
    return competitors


def _create_evidence(
    db: Session,
    run: models.ResearchRun,
    evidence_cards: list[dict[str, Any]],
    competitors: dict[str, models.Competitor],
) -> None:
    for item in evidence_cards:
        item = item.copy()
        competitor_name = item.pop("competitor_name")
        competitor = competitors.get(competitor_name) if competitor_name else None
        card = models.EvidenceCard(
            run_id=run.id,
            competitor_id=competitor.id if competitor else None,
            collected_at=_parse_datetime(item.pop("collected_at")),
            extracted_at=_parse_datetime(item.pop("extracted_at")),
            **item,
        )
        db.add(card)
    db.commit()


def _create_agent_outputs(
    db: Session,
    run: models.ResearchRun,
    agent_outputs: list[dict[str, Any]],
) -> None:
    for index, output in enumerate(agent_outputs, start=1):
        db.add(
            models.AgentOutput(
                run_id=run.id,
                status="completed",
                order_index=index,
                **output,
            )
        )
    db.commit()


def _create_final_report(db: Session, run: models.ResearchRun, report: dict[str, Any]) -> None:
    db.add(models.FinalReport(run_id=run.id, **report))
    db.commit()


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)
