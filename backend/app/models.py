from datetime import datetime, timezone
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def new_id() -> str:
    return str(uuid.uuid4())


class ResearchRun(Base):
    __tablename__ = "research_runs"

    id = Column(String, primary_key=True, default=new_id)
    market = Column(String, nullable=False)
    region = Column(String, default="Global", nullable=False)
    depth = Column(String, default="Standard", nullable=False)
    mode = Column(String, default="competitive_analysis", nullable=False)
    status = Column(String, default="pending", nullable=False)
    demo_note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    competitors = relationship("Competitor", back_populates="run", cascade="all, delete-orphan")
    evidence_cards = relationship("EvidenceCard", back_populates="run", cascade="all, delete-orphan")
    agent_outputs = relationship("AgentOutput", back_populates="run", cascade="all, delete-orphan")
    final_report = relationship("FinalReport", back_populates="run", cascade="all, delete-orphan", uselist=False)


class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(String, primary_key=True, default=new_id)
    run_id = Column(ForeignKey("research_runs.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    website_url = Column(String, nullable=True)

    run = relationship("ResearchRun", back_populates="competitors")


class EvidenceCard(Base):
    __tablename__ = "evidence_cards"

    id = Column(String, primary_key=True)
    run_id = Column(ForeignKey("research_runs.id"), nullable=False)
    competitor_id = Column(ForeignKey("competitors.id"), nullable=True)
    source_title = Column(String, nullable=True)
    source_type = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    dimension = Column(String, nullable=False)
    claim = Column(Text, nullable=False)
    evidence_text = Column(Text, nullable=False)
    confidence = Column(String, nullable=False)
    collected_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    extracted_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    run = relationship("ResearchRun", back_populates="evidence_cards")
    competitor = relationship("Competitor")


class AgentOutput(Base):
    __tablename__ = "agent_outputs"

    id = Column(String, primary_key=True, default=new_id)
    run_id = Column(ForeignKey("research_runs.id"), nullable=False)
    agent_name = Column(String, nullable=False)
    status = Column(String, default="pending", nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    input_summary = Column(Text, nullable=True)
    output_json = Column(JSON, nullable=True)
    output_markdown = Column(Text, nullable=True)
    evidence_ids = Column(JSON, default=list, nullable=False)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    run = relationship("ResearchRun", back_populates="agent_outputs")


class FinalReport(Base):
    __tablename__ = "final_reports"

    id = Column(String, primary_key=True, default=new_id)
    run_id = Column(ForeignKey("research_runs.id"), nullable=False, unique=True)
    title = Column(String, nullable=False)
    executive_summary = Column(Text, nullable=False)
    competitor_landscape = Column(Text, nullable=False)
    feature_matrix = Column(JSON, default=list, nullable=False)
    pricing_matrix = Column(JSON, default=list, nullable=False)
    user_pain_points = Column(JSON, default=list, nullable=False)
    debate_summary = Column(Text, nullable=False)
    opportunity_gaps = Column(JSON, default=list, nullable=False)
    recommended_strategy = Column(Text, nullable=False)
    risks = Column(JSON, default=list, nullable=False)
    evidence_ids = Column(JSON, default=list, nullable=False)
    markdown = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    run = relationship("ResearchRun", back_populates="final_report")
