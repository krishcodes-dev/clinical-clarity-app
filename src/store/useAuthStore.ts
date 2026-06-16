import { create } from "zustand";

interface AuthState {
  /** Consents (UX review P1 screens) */
  onboardingConsentGiven: boolean;
  aiConsentGiven: boolean;
  setOnboardingConsent: (v: boolean) => void;
  setAiConsent: (v: boolean) => void;

  /** App lock (UI-only mock) */
  appLockEnabled: boolean;
  appLockPin: string | null;
  setAppLock: (enabled: boolean, pin?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  onboardingConsentGiven: false,
  aiConsentGiven: false,
  setOnboardingConsent: (v) => set({ onboardingConsentGiven: v }),
  setAiConsent: (v) => set({ aiConsentGiven: v }),

  appLockEnabled: false,
  appLockPin: null,
  setAppLock: (enabled, pin) =>
    set({ appLockEnabled: enabled, appLockPin: pin ?? null }),
}));
