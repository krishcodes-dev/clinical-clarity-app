/**
 * Centralized trust & compliance copy - single legally-reviewable source,
 * per UX Architecture Review §7.1. Indian regulatory framing: DPDP Act 2023
 * and ABDM (Ayushman Bharat Digital Mission) alignment.
 */
export const TRUST = {
  encryption: "Secure 256-bit SSL encrypted payment · UPI, cards & netbanking",
  dataProtection:
    "Your health data is encrypted and handled under India's DPDP Act 2023, aligned with ABDM standards.",
  uploadPrivacy:
    "Records are encrypted with 256-bit AES. No humans review your data unless you explicitly authorize a second opinion.",
  vault: "Stored in your private, encrypted lifelong health vault (ABHA-ready).",
} as const;

export const AI_DISCLAIMER =
  "*This is just an insight and may be inaccurate. AI can make mistakes. For advice, please consult our recommended medical practitioners.";

export const AI_DISCLAIMER_SHORT =
  "*AI-generated insight. May be inaccurate. Consult a medical professional.";

export const AI_EMERGENCY =
  "If you are experiencing symptoms, call 112 (emergency) or 108 (ambulance) immediately.";

export const AI_CONSENT_POINTS = [
  {
    icon: "psychology",
    title: "What our AI does",
    body: "Identifies markers, medication names and date ranges in your reports, and explains them in plain language.",
  },
  {
    icon: "block",
    title: "What it is not",
    body: "It does not diagnose, treat, or replace your doctor. Insights are educational only.",
  },
  {
    icon: "lock",
    title: "How your data is handled",
    body: "Reports are processed in an encrypted environment under the DPDP Act and stored only in your private health vault.",
  },
] as const;

export const BRAND = "Clinical Clarity";
