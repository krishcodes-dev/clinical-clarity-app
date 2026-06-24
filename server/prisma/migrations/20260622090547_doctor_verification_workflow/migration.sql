-- AlterTable
ALTER TABLE "doctor_profiles" ADD COLUMN     "suspension_reason" TEXT,
ALTER COLUMN "registration_number" DROP NOT NULL,
ALTER COLUMN "qualification" DROP NOT NULL,
ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "years_of_experience" DROP NOT NULL,
ALTER COLUMN "consultation_fee" DROP NOT NULL;
