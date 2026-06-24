-- CreateEnum
CREATE TYPE "doctor_verification_status" AS ENUM ('profile_incomplete', 'under_review', 'verified', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "doctor_document_type" AS ENUM ('medical_degree', 'medical_council_registration', 'government_id', 'profile_photo', 'additional_certification');

-- CreateEnum
CREATE TYPE "document_verification_status" AS ENUM ('pending_review', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "audit_action" AS ENUM ('doctor_profile_approved', 'doctor_profile_rejected', 'doctor_profile_suspended', 'doctor_profile_resubmission_requested', 'document_approved', 'document_rejected', 'user_blocked', 'user_unblocked', 'user_role_changed');

-- CreateTable
CREATE TABLE "doctor_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "registration_number" VARCHAR NOT NULL,
    "qualification" VARCHAR NOT NULL,
    "specialization" VARCHAR NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "consultation_fee" DECIMAL(10,2) NOT NULL,
    "current_hospital" VARCHAR,
    "bio" TEXT,
    "verification_status" "doctor_verification_status" NOT NULL DEFAULT 'profile_incomplete',
    "verified_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "profile_locked" BOOLEAN NOT NULL DEFAULT false,
    "declaration_accepted" BOOLEAN NOT NULL DEFAULT false,
    "declaration_accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "doctor_profile_id" UUID NOT NULL,
    "document_type" "doctor_document_type" NOT NULL,
    "file_url" VARCHAR NOT NULL,
    "original_file_name" VARCHAR,
    "mime_type" VARCHAR(100),
    "file_size_bytes" INTEGER,
    "verification_status" "document_verification_status" NOT NULL DEFAULT 'pending_review',
    "rejection_reason" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_id" UUID,

    CONSTRAINT "doctor_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "admin_id" UUID NOT NULL,
    "action" "audit_action" NOT NULL,
    "target_entity_type" VARCHAR(50) NOT NULL,
    "target_entity_id" UUID NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profiles_user_id_key" ON "doctor_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profiles_registration_number_key" ON "doctor_profiles"("registration_number");

-- CreateIndex
CREATE INDEX "doctor_profiles_verification_status_idx" ON "doctor_profiles"("verification_status");

-- CreateIndex
CREATE INDEX "doctor_profiles_specialization_idx" ON "doctor_profiles"("specialization");

-- CreateIndex
CREATE INDEX "doctor_documents_doctor_profile_id_idx" ON "doctor_documents"("doctor_profile_id");

-- CreateIndex
CREATE INDEX "doctor_documents_document_type_idx" ON "doctor_documents"("document_type");

-- CreateIndex
CREATE INDEX "doctor_documents_verification_status_idx" ON "doctor_documents"("verification_status");

-- CreateIndex
CREATE INDEX "doctor_documents_reviewed_by_id_idx" ON "doctor_documents"("reviewed_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_documents_profile_type_unique" ON "doctor_documents"("doctor_profile_id", "document_type");

-- CreateIndex
CREATE INDEX "audit_logs_admin_id_idx" ON "audit_logs"("admin_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_target_entity_type_target_entity_id_idx" ON "audit_logs"("target_entity_type", "target_entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "doctor_profiles" ADD CONSTRAINT "doctor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_documents" ADD CONSTRAINT "doctor_documents_doctor_profile_id_fkey" FOREIGN KEY ("doctor_profile_id") REFERENCES "doctor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_documents" ADD CONSTRAINT "doctor_documents_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
