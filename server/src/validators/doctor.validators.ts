import { z } from "zod";

export const doctorProfileUpsertSchema = z.object({
  registrationNumber: z.string().trim().min(1).max(255).optional(),
  qualification: z.string().trim().min(1).max(255).optional(),
  specialization: z.string().trim().min(1).max(255).optional(),
  yearsOfExperience: z.number().int().min(0).max(80).optional(),
  consultationFee: z.number().min(0).optional(),
  currentHospital: z.string().trim().max(255).nullable().optional(),
  bio: z.string().trim().max(5000).nullable().optional(),
  declarationAccepted: z.boolean().optional(),
});

const documentTypeEnum = z.enum([
  "medical_degree",
  "medical_council_registration",
  "government_id",
  "profile_photo",
  "additional_certification",
]);

export const documentUploadSchema = z.object({
  documentType: documentTypeEnum,
  fileUrl: z.string().url(),
  originalFileName: z.string().trim().max(255).optional(),
  mimeType: z.string().trim().max(100).optional(),
  fileSizeBytes: z.number().int().positive().optional(),
});

export const documentReplaceSchema = z.object({
  fileUrl: z.string().url(),
  originalFileName: z.string().trim().max(255).optional(),
  mimeType: z.string().trim().max(100).optional(),
  fileSizeBytes: z.number().int().positive().optional(),
});
