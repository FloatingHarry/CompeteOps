from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db


router = APIRouter(prefix="/api/runs/{run_id}/evidence", tags=["evidence"])


@router.get("", response_model=list[schemas.EvidenceCardRead])
def get_evidence(run_id: str, db: Session = Depends(get_db)):
    if not db.get(models.ResearchRun, run_id):
        raise HTTPException(status_code=404, detail="Research run not found")
    statement = (
        select(models.EvidenceCard)
        .where(models.EvidenceCard.run_id == run_id)
        .order_by(models.EvidenceCard.id.asc())
    )
    return db.scalars(statement).all()
