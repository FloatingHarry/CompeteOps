export type ResearchRun = {
  id: string;
  market: string;
  region: string;
  depth: string;
  mode: "competitive_analysis" | "supplier_evaluation";
  status: "pending" | "running" | "completed" | "failed";
  demo_note?: string | null;
  created_at: string;
  updated_at: string;
};

export type ResearchRunCreate = {
  market: string;
  region?: string;
  depth?: string;
};

export type Competitor = {
  id: string;
  run_id: string;
  name: string;
  category: "direct" | "indirect" | "emerging";
  description?: string | null;
  website_url?: string | null;
};

export type EvidenceCard = {
  id: string;
  run_id: string;
  competitor_id?: string | null;
  source_title?: string | null;
  source_type: "website" | "pricing" | "docs" | "blog" | "news" | "review" | "manual" | "mock";
  source_url?: string | null;
  dimension: "product" | "pricing" | "user_voice" | "market_signal" | "risk" | "positioning";
  claim: string;
  evidence_text: string;
  confidence: "low" | "medium" | "high";
  collected_at: string;
  extracted_at: string;
};

export type AgentOutput = {
  id: string;
  run_id: string;
  agent_name: string;
  status: "pending" | "running" | "completed" | "failed";
  order_index: number;
  input_summary?: string | null;
  output_json?: AgentOutputMetadata | null;
  output_markdown?: string | null;
  evidence_ids: string[];
  error_message?: string | null;
  created_at: string;
};

export type AgentOutputMetadata = {
  contract_version?: string;
  node_name?: string;
  display_name?: string;
  role?: string;
  depends_on?: string[];
  state_keys_read?: string[];
  state_keys_written?: string[];
  tools_used?: string[];
  subroles?: string[];
  execution_mode?: "mock" | "llm" | "mock_fallback" | string;
  model_name?: string | null;
  fallback_reason?: string | null;
  result?: Record<string, unknown>;
};

export type FinalReport = {
  id: string;
  run_id: string;
  title: string;
  executive_summary: string;
  competitor_landscape: string;
  feature_matrix: MatrixRow[];
  pricing_matrix: MatrixRow[];
  user_pain_points: MatrixRow[];
  debate_summary: string;
  opportunity_gaps: MatrixRow[];
  recommended_strategy: string;
  risks: MatrixRow[];
  evidence_ids: string[];
  markdown: string;
  created_at: string;
};

export type MatrixRow = {
  evidence_ids?: string[];
  [key: string]: unknown;
};
