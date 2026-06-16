/** ---------- Records & EHR ---------- */
export type RecordCategoryId = "lab" | "prescription" | "consultation" | "imaging";

export type RecordSource = "lab_delivered" | "user_uploaded" | "ai_extracted";

export type MarkerStatus = "normal" | "borderline" | "abnormal" | "critical";

export interface Marker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: MarkerStatus;
  plainLanguage: string; // simple explanation (feature 2)
}

export interface HealthRecord {
  id: string;
  title: string;
  category: RecordCategoryId;
  date: string;
  source: RecordSource;
  labName?: string;
  fileName?: string;
  markers?: Marker[];
  verified: boolean;
}

export interface TrendPoint {
  label: string; // "Jan '25"
  value: number;
}

export interface TrendSeries {
  id: string;
  name: string;
  unit: string;
  points: TrendPoint[];
  changePct: number;
  direction: "improving" | "stable" | "worsening";
  latestSummary: string;
}

export type TimelineEventType = "test" | "consultation" | "upload" | "reminder";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  subtitle: string;
  date: string;
  recordId?: string;
}
