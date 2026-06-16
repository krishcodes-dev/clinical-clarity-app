/** ---------- Notifications ---------- */
export type NotificationKind =
  | "reminder"
  | "report"
  | "appointment"
  | "insight"
  | "system";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
}
