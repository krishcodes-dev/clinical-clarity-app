-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('patient', 'doctor', 'lab_tech', 'lab_admin', 'hospital_staff', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "user_source" AS ENUM ('self_signup', 'hospital', 'lab', 'admin_created', 'imported');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('pending', 'active', 'inactive', 'blocked');

-- CreateEnum
CREATE TYPE "otp_purpose" AS ENUM ('signup', 'login');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mobile" VARCHAR NOT NULL,
    "email" VARCHAR,
    "full_name" VARCHAR,
    "role" "user_role" NOT NULL DEFAULT 'patient',
    "source" "user_source" NOT NULL,
    "status" "user_status" NOT NULL,
    "mobile_verified_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mobile" VARCHAR NOT NULL,
    "otp_hash" VARCHAR NOT NULL,
    "purpose" "otp_purpose" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR NOT NULL,
    "device_info" VARCHAR,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "otp_verifications_mobile_idx" ON "otp_verifications"("mobile");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
