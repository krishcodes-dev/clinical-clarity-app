import { DoctorProfile, REQUIRED_DOCUMENT_TYPES, REQUIRED_PROFILE_FIELDS } from "./types";

export interface OnboardingProgress {
  profileComplete: boolean;
  documentsComplete: boolean;
  declarationAccepted: boolean;
  submitted: boolean;
  percent: number;
}

/** Derives onboarding progress from real backend state - never from screen position. */
export function deriveOnboardingProgress(profile: DoctorProfile | null): OnboardingProgress {
  if (!profile) {
    return { profileComplete: false, documentsComplete: false, declarationAccepted: false, submitted: false, percent: 0 };
  }

  const profileComplete = REQUIRED_PROFILE_FIELDS.every(
    (field) => profile[field] !== null && profile[field] !== undefined
  );
  const presentTypes = new Set(profile.documents.map((d) => d.documentType));
  const documentsComplete = REQUIRED_DOCUMENT_TYPES.every((type) => presentTypes.has(type));
  const declarationAccepted = profile.declarationAccepted;
  const submitted = profile.submittedAt !== null || profile.verificationStatus !== "profile_incomplete";

  let percent = 0;
  if (profileComplete) percent = 25;
  if (profileComplete && documentsComplete) percent = 50;
  if (profileComplete && documentsComplete && declarationAccepted) percent = 75;
  if (submitted) percent = 100;

  return { profileComplete, documentsComplete, declarationAccepted, submitted, percent };
}
