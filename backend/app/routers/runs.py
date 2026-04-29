from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.workflow import create_research_run


router = APIRouter(prefix="/api/runs", tags=["runs"])


@router.post("", response_model=schemas.ResearchRunRead)
def create_run(payload: schemas.ResearchRunCreate, db: Session = Depends(get_db)):
    return create_research_run(db, payload)


@router.get("", response_model=list[schemas.ResearchRunRead])
def list_runs(db: Session = Depends(get_db)):
    statement = select(models.ResearchRun).order_by(models.ResearchRun.created_at.desc())
    return db.scalars(statement).all()


@router.get("/{run_id}", response_model=schemas.ResearchRunRead)
def get_run(run_id: str, db: Session = Depends(get_db)):
    run = db.get(models.ResearchRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Research run not found")
    return run


@router.get("/{run_id}/agent-outputs", response_model=list[schemas.AgentOutputRead])
def get_agent_outputs(run_id: str, db: Session = Depends(get_db)):
    _ensure_run(db, run_id)
    statement = (
        select(models.AgentOutput)
        .where(models.AgentOutput.run_id == run_id)
        .order_by(models.AgentOutput.order_index.asc())
    )
    return db.scalars(statement).all()


def _ensure_run(db: Session, run_id: str) -> None:
    if not db.get(models.ResearchRun, run_id):
        raise HTTPException(status_code=404, detail="Research run not found")
