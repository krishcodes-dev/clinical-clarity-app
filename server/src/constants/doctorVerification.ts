import { DoctorDocumentType } from "@prisma/client";

// Documents a doctor must have on file before submitForReview() will succeed.
export const REQUIRED_DOCUMENT_TYPES: DoctorDocumentType[] = [
  "medical_degree",
  "medical_council_registration",
  "government_id",
  "profile_photo",
];

// Profile fields that must be non-null before submitForReview() will succeed.
export const REQUIRED_PROFILE_FIELDS = [
  "registrationNumber",
  "qualification",
  "specialization",
  "yearsOfExperience",
  "consultationFee",
] as const;

// DoctorProfile verification states from which an admin can suspend the doctor.
export const SUSPENDABLE_STATUSES = ["under_review", "verified"] as const;

// DoctorProfile verification states from which an admin can request resubmission.
//
// "verified" is intentionally excluded: a verified doctor may already have
// patients, appointments, and platform activity tied to their profile. Sending
// them straight to profile_incomplete would unlock their core credential fields
// and erase verifiedAt with no intermediate audited freeze step. The correct
// path for a previously-verified doctor is suspendDoctor() first (which freezes
// the profile and requires a reason), and only then requestResubmission() from
// the resulting "suspended" state. See docs/2026-06-22_doctor-verification-hardening-review.md.
export const RESUBMITTABLE_STATUSES = ["under_review", "rejected", "suspended"] as const;
