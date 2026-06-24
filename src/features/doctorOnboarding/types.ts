/** ---------- Doctor onboarding & verification ---------- */
export type DoctorVerificationStatus =
  | "profile_incomplete"
  | "under_review"
  | "verified"
  | "rejected"
  | "suspended";

export type DoctorDocumentType =
  | "medical_degree"
  | "medical_council_registration"
  | "government_id"
  | "profile_photo"
  | "additional_certification";

export type DocumentVerificationStatus = "pending_review" | "approved" | "rejected";

export interface DoctorDocument {
  id: string;
  doctorProfileId: string;
  documentType: DoctorDocumentType;
  fileUrl: string;
  originalFileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  verificationStatus: DocumentVerificationStatus;
  rejectionReason: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
  reviewedById: string | null;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  registrationNumber: string | null;
  qualification: string | null;
  specialization: string | null;
  yearsOfExperience: number | null;
  consultationFee: number | null;
  currentHospital: string | null;
  bio: string | null;
  verificationStatus: DoctorVerificationStatus;
  verifiedAt: string | null;
  verifiedById: string | null;
  submittedAt: string | null;
  rejectionReason: string | null;
  suspensionReason: string | null;
  profileLocked: boolean;
  declarationAccepted: boolean;
  declarationAcceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  documents: DoctorDocument[];
}

export interface DoctorProfileUpsertInput {
  registrationNumber?: string;
  qualification?: string;
  specialization?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  currentHospital?: string | null;
  bio?: string | null;
  declarationAccepted?: boolean;
}

export interface DocumentUpsertInput {
  fileUrl: string;
  originalFileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
}

export const REQUIRED_PROFILE_FIELDS = [
  "registrationNumber",
  "qualification",
  "specialization",
  "yearsOfExperience",
  "consultationFee",
] as const;

export const REQUIRED_DOCUMENT_TYPES: DoctorDocumentType[] = [
  "medical_degree",
  "medical_council_registration",
  "government_id",
  "profile_photo",
];
