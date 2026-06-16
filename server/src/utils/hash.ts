import bcrypt from "bcryptjs";
import crypto from "crypto";

const OTP_SALT_ROUNDS = 10;

export function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, OTP_SALT_ROUNDS);
}

export function compareOtp(otp: string, otpHash: string): Promise<boolean> {
  return bcrypt.compare(otp, otpHash);
}

export function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
