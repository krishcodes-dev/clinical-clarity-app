import { z } from "zod";

export const rejectDoctorSchema = z.object({
  reason: z.string().trim().min(1, "reason is required").max(2000),
});

export const suspendDoctorSchema = z.object({
  reason: z.string().trim().min(1, "reason is required").max(2000),
});

export const requestResubmissionSchema = z.object({
  reason: z.string().trim().max(2000).optional(),
});

export const rejectDocumentSchema = z.object({
  reason: z.string().trim().min(1, "reason is required").max(2000),
});

export const doctorListQuerySchema = z.object({
  status: z
    .enum(["profile_incomplete", "under_review", "verified", "rejected", "suspended"])
    .optional(),
  // Convenience filter for admin reporting, e.g. "doctors approved by this admin".
  // Backed by DoctorProfile.verifiedById, not a substitute for AuditLog history.
  verifiedBy: z.string().uuid().optional(),
});
