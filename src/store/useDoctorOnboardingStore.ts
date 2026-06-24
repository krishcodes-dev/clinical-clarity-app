import { create } from "zustand";
import { ApiError, doctorOnboardingApi } from "@/features/doctorOnboarding/api";
import {
  DoctorDocument,
  DoctorDocumentType,
  DoctorProfile,
  DoctorProfileUpsertInput,
  DocumentUpsertInput,
} from "@/features/doctorOnboarding/types";

interface DoctorOnboardingState {
  profile: DoctorProfile | null;
  isLoading: boolean;
  error: string | null;
  lockedNotice: string | null;

  fetchProfile: () => Promise<void>;
  patchProfile: (data: DoctorProfileUpsertInput) => Promise<DoctorProfile>;
  submitForReview: () => Promise<DoctorProfile>;
  upsertDocument: (type: DoctorDocumentType, input: DocumentUpsertInput) => Promise<DoctorDocument>;
  dismissLockedNotice: () => void;
}

const PROFILE_LOCKED_MESSAGE =
  "Your profile is currently locked because it has been verified. To make changes, contact support or wait for a resubmission request.";

export const useDoctorOnboardingStore = create<DoctorOnboardingState>()((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  lockedNotice: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // First-time doctors have no profile row yet - the backend has no
      // "create if missing" GET, so a 404 here means "not started".
      const profile = await doctorOnboardingApi.getProfile();
      set({ profile, isLoading: false });
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        set({ profile: null, isLoading: false });
        return;
      }
      const message = e instanceof Error ? e.message : "Failed to load verification status";
      set({ error: message, isLoading: false });
    }
  },

  patchProfile: async (data) => {
    const existing = get().profile;
    try {
      // declarationAccepted may only be set via update - the backend rejects
      // it on the initial create call.
      const { declarationAccepted, ...createData } = data;
      const profile = existing
        ? await doctorOnboardingApi.updateProfile(data)
        : await doctorOnboardingApi.createProfile(createData);
      set({ profile: { ...profile, documents: profile.documents ?? existing?.documents ?? [] } });
      return profile;
    } catch (e) {
      if (e instanceof ApiError && e.status === 423) {
        set({ lockedNotice: PROFILE_LOCKED_MESSAGE });
      }
      throw e;
    }
  },

  submitForReview: async () => {
    try {
      const profile = await doctorOnboardingApi.submitForReview();
      set((s) => ({ profile: { ...profile, documents: s.profile?.documents ?? [] } }));
      return profile;
    } catch (e) {
      if (e instanceof ApiError && e.status === 423) {
        set({ lockedNotice: PROFILE_LOCKED_MESSAGE });
      }
      throw e;
    }
  },

  upsertDocument: async (type, input) => {
    const existing = get().profile?.documents.find((d) => d.documentType === type);
    try {
      const document = existing
        ? await doctorOnboardingApi.replaceDocument(existing.id, input)
        : await doctorOnboardingApi.createDocument(type, input);
      set((s) => {
        if (!s.profile) return {};
        const documents = existing
          ? s.profile.documents.map((d) => (d.id === document.id ? document : d))
          : [...s.profile.documents, document];
        return { profile: { ...s.profile, documents } };
      });
      return document;
    } catch (e) {
      if (e instanceof ApiError && e.status === 423) {
        set({ lockedNotice: PROFILE_LOCKED_MESSAGE });
      }
      throw e;
    }
  },

  dismissLockedNotice: () => set({ lockedNotice: null }),
}));
