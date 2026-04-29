import type { Competitor, MatrixRow } from "@/lib/types";
import { matrixValue } from "@/lib/insights";
import { WorkflowGtmMap } from "./WorkflowGtmMap";

type CompetitiveMapProps = {
  rows: MatrixRow[];
};

export function CompetitiveMap({ rows }: CompetitiveMapProps) {
  const competitors: Competitor[] = rows.map((row) => ({
    id: matrixValue(row, "competitor"),
    run_id: "legacy-map",
    name: matrixValue(row, "competitor"),
    category: "direct",
    description: null,
    website_url: null,
  }));

  return <WorkflowGtmMap competitors={competitors} featureRows={rows} />;
}
