/** ---------- Reminders ---------- */
export type ReminderType =
  | "medication"
  | "appointment"
  | "test"
  | "hydration"
  | "lifestyle"
  | "vaccination";

export type ReminderStatus = "upcoming" | "done" | "missed" | "overdue";

export interface Reminder {
  id: string;
  title: string;
  subtitle?: string;
  type: ReminderType;
  time: string;
  dateLabel: string;
  status: ReminderStatus;
  recurring?: string; // "Daily", "Mon/Wed/Fri"
  fromPrescriptionId?: string;
}
