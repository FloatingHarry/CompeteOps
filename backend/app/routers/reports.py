from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db


router = APIRouter(prefix="/api/runs/{run_id}/report", tags=["reports"])


@router.get("", response_model=schemas.FinalReportRead)
def get_report(run_id: str, db: Session = Depends(get_db)):
    if not db.get(models.ResearchRun, run_id):
        raise HTTPException(status_code=404, detail="Research run not found")
    statement = select(models.FinalReport).where(models.FinalReport.run_id == run_id)
    report = db.scalars(statement).first()
    if not report:
        raise HTTPException(status_code=404, detail="Final report not found")
    return report
