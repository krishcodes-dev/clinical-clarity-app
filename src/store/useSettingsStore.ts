import { create } from "zustand";

interface SettingsState {
  /** Plain-language toggle for medical terms (UX review §7.2) */
  plainLanguage: boolean;
  togglePlainLanguage: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  plainLanguage: true,
  togglePlainLanguage: () => set((s) => ({ plainLanguage: !s.plainLanguage })),
}));
