import { AppNotification } from "./types";

export const mockNotifications: AppNotification[] = [
  {
    id: "no1",
    kind: "report",
    title: "Your Lipid Profile report is ready",
    body: "AI insights have been generated for your Oct 14 test.",
    timeAgo: "2h ago",
    read: false,
  },
  {
    id: "no2",
    kind: "reminder",
    title: "Missed: Vitamin D3 Sachet",
    body: "Scheduled for 08:00 AM today. Tap to mark done or snooze.",
    timeAgo: "4h ago",
    read: false,
  },
  {
    id: "no3",
    kind: "appointment",
    title: "Appointment tomorrow, 10:30 AM",
    body: "Video consult with Dr. Sneha Patil. Run a device check before joining.",
    timeAgo: "6h ago",
    read: true,
  },
  {
    id: "no4",
    kind: "insight",
    title: "HbA1c trend improving",
    body: "Down 17% over 24 months. View your progress report.",
    timeAgo: "1d ago",
    read: true,
  },
  {
    id: "no5",
    kind: "system",
    title: "Privacy policy updated",
    body: "Review the changes to how your records are stored.",
    timeAgo: "3d ago",
    read: true,
  },
];
