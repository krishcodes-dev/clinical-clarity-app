import { create } from "zustand";
import { Reminder } from "@/features/reminders/types";
import { mockReminders } from "@/features/reminders/mocks";

interface RemindersState {
  reminders: Reminder[];
  addReminders: (items: Reminder[]) => void;
  setReminderStatus: (id: string, status: Reminder["status"]) => void;
}

export const useRemindersStore = create<RemindersState>((set) => ({
  reminders: mockReminders,
  addReminders: (items) =>
    set((s) => ({ reminders: [...s.reminders, ...items] })),
  setReminderStatus: (id, status) =>
    set((s) => ({
      reminders: s.reminders.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}));
