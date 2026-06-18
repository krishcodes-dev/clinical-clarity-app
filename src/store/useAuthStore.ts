import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { saveTokens, clearTokens } from "@/utils/tokenStore";

// Persists non-sensitive state (user profile, flags) as encrypted JSON.
// Raw JWT strings are NOT stored here — they live in isolated tokenStore slots.
const secureStorage = createJSONStorage(() => ({
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}));

export interface AuthUser {
  id: string;
  mobile: string;
  full_name: string | null;
  role: string;
  isNewUser: boolean;
}

interface AuthState {
  /** Session */
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearSession: () => void;

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user, accessToken, refreshToken) => {
        // Tokens are written to their own SecureStore slots — not included in this state.
        saveTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true });
      },
      clearSession: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      onboardingConsentGiven: false,
      aiConsentGiven: false,
      setOnboardingConsent: (v) => set({ onboardingConsentGiven: v }),
      setAiConsent: (v) => set({ aiConsentGiven: v }),

      appLockEnabled: false,
      appLockPin: null,
      setAppLock: (enabled, pin) =>
        set({ appLockEnabled: enabled, appLockPin: pin ?? null }),
    }),
    {
      name: "auth-store",
      storage: secureStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboardingConsentGiven: state.onboardingConsentGiven,
        aiConsentGiven: state.aiConsentGiven,
        appLockEnabled: state.appLockEnabled,
        appLockPin: state.appLockPin,
      }),
    }
  )
);
