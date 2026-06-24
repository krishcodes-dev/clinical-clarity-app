import { DoctorDocument, DoctorProfile } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { REQUIRED_DOCUMENT_TYPES, REQUIRED_PROFILE_FIELDS } from "../constants/doctorVerification";

export interface DoctorProfileInput {
  registrationNumber?: string;
  qualification?: string;
  specialization?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  currentHospital?: string | null;
  bio?: string | null;
  declarationAccepted?: boolean;
}

export interface SubmissionCheck {
  canSubmit: boolean;
  missingFields: string[];
  missingDocuments: string[];
  declarationAccepted: boolean;
}

type ProfileWithDocuments = DoctorProfile & { documents: DoctorDocument[] };

// Reusable by controllers/services that need to know readiness without submitting.
export function canSubmitForReview(profile: DoctorProfile, documents: DoctorDocument[]): SubmissionCheck {
  const missingFields = REQUIRED_PROFILE_FIELDS.filter((field) => profile[field] === null || profile[field] === undefined);

  const presentDocumentTypes = new Set(documents.map((doc) => doc.documentType));
  const missingDocuments = REQUIRED_DOCUMENT_TYPES.filter((type) => !presentDocumentTypes.has(type));

  const declarationAccepted = profile.declarationAccepted;

  return {
    canSubmit: declarationAccepted && missingFields.length === 0 && missingDocuments.length === 0,
    missingFields,
    missingDocuments,
    declarationAccepted,
  };
}

async function getProfileOrThrow(userId: string): Promise<ProfileWithDocuments> {
  const profile = await prisma.doctorProfile.findUnique({
    where: { userId },
    include: { documents: true },
  });
  if (!profile) {
    throw new AppError(404, "DOCTOR_PROFILE_NOT_FOUND", "Doctor profile not found");
  }
  return profile;
}

function assertEditable(profile: DoctorProfile): void {
  if (profile.profileLocked) {
    throw new AppError(423, "PROFILE_LOCKED", "This profile is locked and cannot be edited");
  }
}

export async function createProfile(userId: string, data: DoctorProfileInput): Promise<DoctorProfile> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  if (user.role !== "doctor") {
    throw new AppError(403, "FORBIDDEN", "Only doctor accounts may create a doctor profile");
  }

  const existing = await prisma.doctorProfile.findUnique({ where: { userId } });
  if (existing) {
    throw new AppError(409, "DOCTOR_PROFILE_EXISTS", "A doctor profile already exists for this user");
  }

  if (data.declarationAccepted) {
    throw new AppError(400, "VALIDATION_ERROR", "declarationAccepted cannot be set on creation");
  }

  return prisma.doctorProfile.create({
    data: {
      userId,
      registrationNumber: data.registrationNumber,
      qualification: data.qualification,
      specialization: data.specialization,
      yearsOfExperience: data.yearsOfExperience,
      consultationFee: data.consultationFee,
      currentHospital: data.currentHospital,
      bio: data.bio,
    },
  });
}

export async function updateProfile(userId: string, data: DoctorProfileInput): Promise<DoctorProfile> {
  const profile = await getProfileOrThrow(userId);
  assertEditable(profile);

  const declarationFields =
    data.declarationAccepted === true && !profile.declarationAccepted
      ? { declarationAccepted: true, declarationAcceptedAt: new Date() }
      : data.declarationAccepted === false
        ? { declarationAccepted: false, declarationAcceptedAt: null }
        : {};

  return prisma.doctorProfile.update({
    where: { userId },
    data: {
      registrationNumber: data.registrationNumber,
      qualification: data.qualification,
      specialization: data.specialization,
      yearsOfExperience: data.yearsOfExperience,
      consultationFee: data.consultationFee,
      currentHospital: data.currentHospital,
      bio: data.bio,
      ...declarationFields,
    },
  });
}

export async function getProfile(userId: string): Promise<ProfileWithDocuments> {
  return getProfileOrThrow(userId);
}

export async function getVerificationStatus(userId: string) {
  const profile = await getProfileOrThrow(userId);
  return {
    verificationStatus: profile.verificationStatus,
    profileLocked: profile.profileLocked,
    submittedAt: profile.submittedAt,
    verifiedAt: profile.verifiedAt,
    rejectionReason: profile.rejectionReason,
    suspensionReason: profile.suspensionReason,
  };
}

export async function submitForReview(userId: string): Promise<DoctorProfile> {
  const profile = await getProfileOrThrow(userId);
  assertEditable(profile);

  if (profile.verificationStatus === "under_review") {
    throw new AppError(409, "ALREADY_UNDER_REVIEW", "This profile is already under review");
  }
  if (profile.verificationStatus === "verified") {
    throw new AppError(409, "ALREADY_VERIFIED", "This profile is already verified");
  }

  const check = canSubmitForReview(profile, profile.documents);
  if (!check.canSubmit) {
    throw new AppError(
      400,
      "PROFILE_INCOMPLETE",
      `Profile is not ready for review. Missing fields: [${check.missingFields.join(", ")}], ` +
        `missing documents: [${check.missingDocuments.join(", ")}], ` +
        `declaration accepted: ${check.declarationAccepted}`,
    );
  }

  return prisma.doctorProfile.update({
    where: { userId },
    data: {
      verificationStatus: "under_review",
      submittedAt: new Date(),
    },
  });
}
