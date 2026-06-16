import { create } from "zustand";
import { Doctor } from "@/features/consultations/types";

interface ConsultDraft {
  doctor?: Doctor;
  mode?: "video" | "audio" | "chat";
  slotLabel?: string;
}

interface CareState {
  /** Consultation funnel draft */
  consultDraft: ConsultDraft;
  updateConsultDraft: (patch: Partial<ConsultDraft>) => void;
  resetConsultDraft: () => void;
}

export const useCareStore = create<CareState>((set) => ({
  consultDraft: {},
  updateConsultDraft: (patch) =>
    set((s) => ({ consultDraft: { ...s.consultDraft, ...patch } })),
  resetConsultDraft: () => set({ consultDraft: {} }),
}));
