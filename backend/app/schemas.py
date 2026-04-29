from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


RunMode = Literal["competitive_analysis", "supplier_evaluation"]
RunStatus = Literal["pending", "running", "completed", "failed"]
CompetitorCategory = Literal["direct", "indirect", "emerging"]
SourceType = Literal["website", "pricing", "docs", "blog", "news", "review", "manual", "mock"]
EvidenceDimension = Literal["product", "pricing", "user_voice", "market_signal", "risk", "positioning"]
Confidence = Literal["low", "medium", "high"]


class ResearchRunCreate(BaseModel):
    market: str = Field(min_length=1, examples=["AI coding tools"])
    region: str = "Global"
    depth: str = "Standard"

    @field_validator("market")
    @classmethod
    def market_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("market must not be blank")
        return value


class ResearchRunRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    market: str
    region: str
    depth: str
    mode: RunMode
    status: RunStatus
    demo_note: str | None = None
    created_at: datetime
    updated_at: datetime


class CompetitorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    run_id: str
    name: str
    category: CompetitorCategory
    description: str | None = None
    website_url: str | None = None


class EvidenceCardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    run_id: str
    competitor_id: str | None = None
    source_title: str | None = None
    source_type: SourceType
    source_url: str | None = None
    dimension: EvidenceDimension
    claim: str
    evidence_text: str
    confidence: Confidence
    collected_at: datetime
    extracted_at: datetime


class AgentOutputRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    run_id: str
    agent_name: str
    status: RunStatus
    order_index: int
    input_summary: str | None = None
    output_json: dict[str, Any] | None = None
    output_markdown: str | None = None
    evidence_ids: list[str] = []
    error_message: str | None = None
    created_at: datetime


class FinalReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    run_id: str
    title: str
    executive_summary: str
    competitor_landscape: str
    feature_matrix: list[dict[str, Any]]
    pricing_matrix: list[dict[str, Any]]
    user_pain_points: list[dict[str, Any]]
    debate_summary: str
    opportunity_gaps: list[dict[str, Any]]
    recommended_strategy: str
    risks: list[dict[str, Any]]
    evidence_ids: list[str]
    markdown: str
    created_at: datetime
