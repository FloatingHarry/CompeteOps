import type {
  AgentOutput,
  Competitor,
  EvidenceCard,
  FinalReport,
  ResearchRun,
  ResearchRunCreate,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function createRun(payload: ResearchRunCreate) {
  return apiFetch<ResearchRun>("/api/runs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getRun(runId: string) {
  return apiFetch<ResearchRun>(`/api/runs/${runId}`);
}

export function getCompetitors(runId: string) {
  return apiFetch<Competitor[]>(`/api/runs/${runId}/competitors`);
}

export function getEvidence(runId: string) {
  return apiFetch<EvidenceCard[]>(`/api/runs/${runId}/evidence`);
}

export function getAgentOutputs(runId: string) {
  return apiFetch<AgentOutput[]>(`/api/runs/${runId}/agent-outputs`);
}

export function getReport(runId: string) {
  return apiFetch<FinalReport>(`/api/runs/${runId}/report`);
}
