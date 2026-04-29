from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db


router = APIRouter(prefix="/api/runs/{run_id}/competitors", tags=["competitors"])


@router.get("", response_model=list[schemas.CompetitorRead])
def get_competitors(run_id: str, db: Session = Depends(get_db)):
    if not db.get(models.ResearchRun, run_id):
        raise HTTPException(status_code=404, detail="Research run not found")
    statement = (
        select(models.Competitor)
        .where(models.Competitor.run_id == run_id)
        .order_by(models.Competitor.category.asc(), models.Competitor.name.asc())
    )
    return db.scalars(statement).all()
