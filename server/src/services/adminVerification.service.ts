import { DoctorProfile, DoctorVerificationStatus } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { RESUBMITTABLE_STATUSES, SUSPENDABLE_STATUSES } from "../constants/doctorVerification";

async function getProfileOrThrow(doctorProfileId: string): Promise<DoctorProfile> {
  const profile = await prisma.doctorProfile.findUnique({ where: { id: doctorProfileId } });
  if (!profile) {
    throw new AppError(404, "DOCTOR_PROFILE_NOT_FOUND", "Doctor profile not found");
  }
  return profile;
}

export async function listDoctors(status?: DoctorVerificationStatus, verifiedBy?: string) {
  return prisma.doctorProfile.findMany({
    where: {
      ...(status ? { verificationStatus: status } : {}),
      ...(verifiedBy ? { verifiedById: verifiedBy } : {}),
    },
    include: { user: { select: { id: true, mobile: true, fullName: true, email: true } } },
    orderBy: { submittedAt: "asc" },
  });
}

export async function getDoctorDetail(doctorProfileId: string) {
  const profile = await prisma.doctorProfile.findUnique({
    where: { id: doctorProfileId },
    include: {
      user: { select: { id: true, mobile: true, fullName: true, email: true } },
      documents: { orderBy: { documentType: "asc" } },
    },
  });
  if (!profile) {
    throw new AppError(404, "DOCTOR_PROFILE_NOT_FOUND", "Doctor profile not found");
  }
  return profile;
}

export async function approveDoctor(adminId: string, doctorProfileId: string): Promise<DoctorProfile> {
  const profile = await getProfileOrThrow(doctorProfileId);
  if (profile.verificationStatus !== "under_review") {
    throw new AppError(
      409,
      "INVALID_STATE",
      `Cannot approve a profile in status '${profile.verificationStatus}'. Only profiles under_review can be approved.`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.doctorProfile.update({
      where: { id: doctorProfileId },
      data: {
        verificationStatus: "verified",
        verifiedAt: new Date(),
        verifiedById: adminId,
        profileLocked: true,
        rejectionReason: null,
        suspensionReason: null,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId,
        action: "doctor_profile_approved",
        targetEntityType: "DoctorProfile",
        targetEntityId: doctorProfileId,
      },
    });

    return updated;
  });
}

export async function rejectDoctor(adminId: string, doctorProfileId: string, reason: string): Promise<DoctorProfile> {
  const profile = await getProfileOrThrow(doctorProfileId);
  if (profile.verificationStatus !== "under_review") {
    throw new AppError(
      409,
      "INVALID_STATE",
      `Cannot reject a profile in status '${profile.verificationStatus}'. Only profiles under_review can be rejected.`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.doctorProfile.update({
      where: { id: doctorProfileId },
      data: {
        verificationStatus: "rejected",
        rejectionReason: reason,
        profileLocked: false,
        verifiedAt: null,
        verifiedById: null,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId,
        action: "doctor_profile_rejected",
        targetEntityType: "DoctorProfile",
        targetEntityId: doctorProfileId,
        reason,
      },
    });

    return updated;
  });
}

export async function suspendDoctor(adminId: string, doctorProfileId: string, reason: string): Promise<DoctorProfile> {
  const profile = await getProfileOrThrow(doctorProfileId);
  if (!SUSPENDABLE_STATUSES.includes(profile.verificationStatus as (typeof SUSPENDABLE_STATUSES)[number])) {
    throw new AppError(
      409,
      "INVALID_STATE",
      `Cannot suspend a profile in status '${profile.verificationStatus}'.`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.doctorProfile.update({
      where: { id: doctorProfileId },
      data: {
        verificationStatus: "suspended",
        suspensionReason: reason,
        // Freeze the profile so a suspended doctor cannot edit their way out of review.
        profileLocked: true,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId,
        action: "doctor_profile_suspended",
        targetEntityType: "DoctorProfile",
        targetEntityId: doctorProfileId,
        reason,
      },
    });

    return updated;
  });
}

export async function requestResubmission(
  adminId: string,
  doctorProfileId: string,
  reason?: string,
): Promise<DoctorProfile> {
  const profile = await getProfileOrThrow(doctorProfileId);
  if (!RESUBMITTABLE_STATUSES.includes(profile.verificationStatus as (typeof RESUBMITTABLE_STATUSES)[number])) {
    throw new AppError(
      409,
      "INVALID_STATE",
      `Cannot request resubmission for a profile in status '${profile.verificationStatus}'.`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.doctorProfile.update({
      where: { id: doctorProfileId },
      data: {
        verificationStatus: "profile_incomplete",
        profileLocked: false,
        submittedAt: null,
        verifiedAt: null,
        verifiedById: null,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId,
        action: "doctor_profile_resubmission_requested",
        targetEntityType: "DoctorProfile",
        targetEntityId: doctorProfileId,
        reason,
      },
    });

    return updated;
  });
}

async function getDocumentOrThrow(documentId: string) {
  const document = await prisma.doctorDocument.findUnique({ where: { id: documentId } });
  if (!document) {
    throw new AppError(404, "DOCUMENT_NOT_FOUND", "Document not found");
  }
  return document;
}

export async function approveDocument(adminId: string, documentId: string) {
  await getDocumentOrThrow(documentId);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.doctorDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: "approved",
        reviewedAt: new Date(),
        reviewedById: adminId,
        rejectionReason: null,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId,
        action: "document_approved",
        targetEntityType: "DoctorDocument",
        targetEntityId: documentId,
      },
    });

    return updated;
  });
}

export async function rejectDocument(adminId: string, documentId: string, reason: string) {
  await getDocumentOrThrow(documentId);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.doctorDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: "rejected",
        reviewedAt: new Date(),
        reviewedById: adminId,
        rejectionReason: reason,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId,
        action: "document_rejected",
        targetEntityType: "DoctorDocument",
        targetEntityId: documentId,
        reason,
      },
    });

    return updated;
  });
}
