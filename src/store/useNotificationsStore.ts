import { create } from "zustand";

interface NotificationsState {
  unreadCount: number;
  markAllNotificationsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  unreadCount: 2,
  markAllNotificationsRead: () => set({ unreadCount: 0 }),
}));
