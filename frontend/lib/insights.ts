import type { AgentOutput, Competitor, EvidenceCard, FinalReport, MatrixRow } from "./types";

export function scoreLevel(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("strong") || normalized.includes("yes")) {
    return 86;
  }
  if (normalized.includes("medium") || normalized.includes("developing") || normalized.includes("likely")) {
    return 58;
  }
  if (normalized.includes("low") || normalized.includes("limited") || normalized.includes("unknown")) {
    return 28;
  }
  if (normalized.includes("usage")) {
    return 68;
  }
  return 46;
}

export function shortEvidenceId(ids?: string[]) {
  return ids?.[0] ?? "ev";
}

export function evidenceDistribution(evidence: EvidenceCard[]) {
  const counts = new Map<string, number>();
  evidence.forEach((card) => counts.set(card.dimension, (counts.get(card.dimension) ?? 0) + 1));
  return Array.from(counts.entries())
    .map(([dimension, count]) => ({ dimension, count }))
    .sort((a, b) => b.count - a.count);
}

export function getStrategyAgentMode(agents: AgentOutput[]) {
  const strategy = agents.find((agent) => agent.output_json?.node_name === "strategy_agent");
  return {
    mode: strategy?.output_json?.execution_mode ?? "sample",
    model: strategy?.output_json?.model_name,
    fallbackReason: strategy?.output_json?.fallback_reason,
  };
}

export function summaryStats(report: FinalReport, competitors: Competitor[], evidence: EvidenceCard[], agents: AgentOutput[]) {
  const directCount = competitors.filter((competitor) => competitor.category === "direct").length;
  return [
    { label: "Competitors", value: competitors.length, detail: `${directCount} direct rivals` },
    { label: "Evidence Cards", value: evidence.length, detail: `${evidenceDistribution(evidence).length} signal dimensions` },
    { label: "Agent Nodes", value: agents.length, detail: "LangGraph workflow" },
    { label: "Opportunity Gaps", value: report.opportunity_gaps.length, detail: "strategy candidates" },
  ];
}

export function matrixValue(row: MatrixRow, key: string) {
  return typeof row[key] === "string" || typeof row[key] === "number" ? String(row[key]) : "";
}

const workflowGtmPresets: Record<string, { workflow: number; gtm: number; rationale: string }> = {
  Cursor: {
    workflow: 88,
    gtm: 64,
    rationale: "AI-native editor with strong workflow pull and growing team motion.",
  },
  "GitHub Copilot": {
    workflow: 62,
    gtm: 94,
    rationale: "Deep ecosystem distribution through GitHub, IDEs, and enterprise seats.",
  },
  "Claude Code": {
    workflow: 78,
    gtm: 70,
    rationale: "Terminal-native agent workflow with leverage from a broader model platform.",
  },
  Windsurf: {
    workflow: 82,
    gtm: 52,
    rationale: "Focused AI coding environment with less incumbent distribution leverage.",
  },
  "Replit Agent": {
    workflow: 74,
    gtm: 76,
    rationale: "Cloud creation and hosting loop gives it an end-to-end builder workflow.",
  },
  Devin: {
    workflow: 90,
    gtm: 45,
    rationale: "Autonomous engineering wedge is high-workflow, but less broadly distributed.",
  },
  Codex: {
    workflow: 80,
    gtm: 74,
    rationale: "Repository-level agent workflow with platform leverage from developer tooling.",
  },
};

export function workflowGtmPosition(competitor: Competitor, row?: MatrixRow) {
  const preset = workflowGtmPresets[competitor.name];
  if (preset) {
    return preset;
  }

  const workflow = Math.round(
    (scoreLevel(row?.core_features) + scoreLevel(row?.ai_capability) + scoreLevel(row?.team_features)) / 3,
  );
  const pricingMotion = matrixValue(row ?? {}, "pricing_strategy").toLowerCase();
  const gtm =
    pricingMotion.includes("ecosystem") || competitor.category === "indirect"
      ? 78
      : pricingMotion.includes("enterprise")
        ? 66
        : Math.round((scoreLevel(row?.enterprise) + scoreLevel(row?.team_features)) / 2);

  return {
    workflow,
    gtm,
    rationale: "Directional score derived from feature depth, team readiness, category, and pricing motion.",
  };
}

export function evidenceCountByDimension(evidence: EvidenceCard[], dimension: EvidenceCard["dimension"]) {
  return evidence.filter((card) => card.dimension === dimension).length;
}
