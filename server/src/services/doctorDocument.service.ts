import { DoctorDocument, DoctorDocumentType } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";

export interface DocumentFileInput {
  documentType: DoctorDocumentType;
  fileUrl: string;
  originalFileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
}

export interface DocumentReplaceInput {
  fileUrl: string;
  originalFileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
}

async function getOwnedProfileOrThrow(userId: string) {
  const profile = await prisma.doctorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(404, "DOCTOR_PROFILE_NOT_FOUND", "Doctor profile not found");
  }
  return profile;
}

async function getOwnedDocumentOrThrow(userId: string, documentId: string): Promise<DoctorDocument> {
  const document = await prisma.doctorDocument.findUnique({
    where: { id: documentId },
    include: { doctorProfile: true },
  });
  if (!document || document.doctorProfile.userId !== userId) {
    throw new AppError(404, "DOCUMENT_NOT_FOUND", "Document not found");
  }
  return document;
}

export async function uploadDocument(userId: string, input: DocumentFileInput): Promise<DoctorDocument> {
  const profile = await getOwnedProfileOrThrow(userId);
  if (profile.profileLocked) {
    throw new AppError(423, "PROFILE_LOCKED", "This profile is locked and cannot accept new documents");
  }

  const existing = await prisma.doctorDocument.findUnique({
    where: { doctorProfileId_documentType: { doctorProfileId: profile.id, documentType: input.documentType } },
  });
  if (existing) {
    throw new AppError(
      409,
      "DOCUMENT_TYPE_EXISTS",
      `A document of type '${input.documentType}' already exists. Use replaceDocument instead.`,
    );
  }

  return prisma.doctorDocument.create({
    data: {
      doctorProfileId: profile.id,
      documentType: input.documentType,
      fileUrl: input.fileUrl,
      originalFileName: input.originalFileName,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
    },
  });
}

// Replacing a document keeps the same row (and id) so the audit trail of who
// reviewed prior versions is not silently discarded by a delete+recreate.
export async function replaceDocument(
  userId: string,
  documentId: string,
  input: DocumentReplaceInput,
): Promise<DoctorDocument> {
  const document = await getOwnedDocumentOrThrow(userId, documentId);
  const profile = await getOwnedProfileOrThrow(userId);
  if (profile.profileLocked) {
    throw new AppError(423, "PROFILE_LOCKED", "This profile is locked and cannot accept document changes");
  }

  return prisma.doctorDocument.update({
    where: { id: document.id },
    data: {
      fileUrl: input.fileUrl,
      originalFileName: input.originalFileName,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      // A re-upload always needs fresh admin review, regardless of the previous verdict.
      verificationStatus: "pending_review",
      rejectionReason: null,
      reviewedAt: null,
      reviewedById: null,
    },
  });
}

export async function deleteDocument(userId: string, documentId: string): Promise<void> {
  const document = await getOwnedDocumentOrThrow(userId, documentId);
  const profile = await getOwnedProfileOrThrow(userId);

  // profileLocked is the single source of truth for "can the doctor still edit
  // onboarding data" — under_review and verified both lock the profile, while
  // profile_incomplete and rejected leave it open for the doctor to fix things.
  if (profile.profileLocked) {
    throw new AppError(423, "PROFILE_LOCKED", "This profile is locked and documents cannot be deleted");
  }

  await prisma.doctorDocument.delete({ where: { id: document.id } });
}

export async function listDocuments(userId: string): Promise<DoctorDocument[]> {
  const profile = await getOwnedProfileOrThrow(userId);
  return prisma.doctorDocument.findMany({
    where: { doctorProfileId: profile.id },
    orderBy: { documentType: "asc" },
  });
}
