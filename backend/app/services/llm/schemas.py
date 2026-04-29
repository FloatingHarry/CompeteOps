from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


class OpportunityGap(BaseModel):
    gap: str = Field(min_length=1)
    rationale: str = Field(min_length=1)
    evidence_ids: list[str] = Field(min_length=1)


class StrategyRisk(BaseModel):
    risk: str = Field(min_length=1)
    severity: Literal["low", "medium", "high"]
    mitigation: str = Field(min_length=1)
    evidence_ids: list[str] = Field(min_length=1)


class StrategyLLMOutput(BaseModel):
    manager_view: str = Field(min_length=1)
    opportunity_gaps: list[OpportunityGap] = Field(min_length=1)
    recommended_strategy: str = Field(min_length=1)
    risks: list[StrategyRisk] = Field(min_length=1)
    confidence: Literal["low", "medium", "high"]
    evidence_ids: list[str] = Field(min_length=1)

    @field_validator("evidence_ids")
    @classmethod
    def evidence_ids_must_be_unique(cls, value: list[str]) -> list[str]:
        return list(dict.fromkeys(value))

    @model_validator(mode="after")
    def strategy_must_be_evidence_grounded(self) -> "StrategyLLMOutput":
        nested_ids = set(self.evidence_ids)
        for gap in self.opportunity_gaps:
            nested_ids.update(gap.evidence_ids)
        for risk in self.risks:
            nested_ids.update(risk.evidence_ids)
        if not nested_ids:
            raise ValueError("strategy output must include evidence IDs")
        return self
