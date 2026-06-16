/** ---------- AI Insights ---------- */
export type InsightState =
  | "no_reports"
  | "first_report"
  | "healthy"
  | "critical"
  | "incomplete"
  | "conflict"
  | "error";

export type FindingSeverity = "normal" | "attention" | "critical";

export interface Finding {
  id: string;
  title: string;
  severity: FindingSeverity;
  markerName: string;
  value: string;
  referenceRange: string;
  summary: string;
  recordId: string;
}

export interface NextStep {
  id: string;
  title: string;
  description: string;
  action: "book_test" | "consult_doctor" | "set_reminder" | "lifestyle";
  urgency: "routine" | "soon" | "urgent";
}
