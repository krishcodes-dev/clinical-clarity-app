-- AlterTable
ALTER TABLE "doctor_profiles" ADD COLUMN     "verified_by_id" UUID;

-- CreateIndex
CREATE INDEX "doctor_profiles_verified_by_id_idx" ON "doctor_profiles"("verified_by_id");

-- AddForeignKey
ALTER TABLE "doctor_profiles" ADD CONSTRAINT "doctor_profiles_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
