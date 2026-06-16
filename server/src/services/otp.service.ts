import { OtpPurpose, User } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";
import { compareOtp, generateOtp, hashOtp } from "../utils/hash";
import { sendSms } from "./sms.service";

const MAX_REQUESTS_PER_WINDOW = 3;
const RATE_LIMIT_WINDOW_MIN = 15;
const MAX_VERIFY_ATTEMPTS = 5;

export async function requestOtp(mobile: string): Promise<void> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60 * 1000);

  const recentRequestCount = await prisma.otpVerification.count({
    where: { mobile, createdAt: { gte: windowStart } },
  });

  if (recentRequestCount >= MAX_REQUESTS_PER_WINDOW) {
    throw new AppError(429, "OTP_RATE_LIMITED", "Too many OTP requests. Please try again later.");
  }

  const now = new Date();

  // Invalidate any previous unverified, still-active OTPs for this mobile.
  await prisma.otpVerification.updateMany({
    where: { mobile, verifiedAt: null, expiresAt: { gt: now } },
    data: { expiresAt: now },
  });

  const existingUser = await prisma.user.findUnique({ where: { mobile } });
  const purpose: OtpPurpose = existingUser ? "login" : "signup";

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(now.getTime() + env.otpExpiryMin * 60 * 1000);

  await prisma.otpVerification.create({
    data: { mobile, otpHash, purpose, expiresAt },
  });

  await sendSms(mobile, otp);
}

export interface VerifyOtpResult {
  user: User;
  isNewUser: boolean;
}

export async function verifyOtpAndResolveUser(mobile: string, otp: string): Promise<VerifyOtpResult> {
  const now = new Date();

  const otpRecord = await prisma.otpVerification.findFirst({
    where: { mobile, verifiedAt: null, expiresAt: { gt: now } },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord || otpRecord.attempts >= MAX_VERIFY_ATTEMPTS) {
    throw new AppError(400, "OTP_INVALID", "Invalid or expired OTP");
  }

  const isMatch = await compareOtp(otp, otpRecord.otpHash);

  if (!isMatch) {
    const attempts = otpRecord.attempts + 1;
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: {
        attempts,
        ...(attempts >= MAX_VERIFY_ATTEMPTS ? { expiresAt: now } : {}),
      },
    });
    throw new AppError(400, "OTP_INVALID", "Invalid or expired OTP");
  }

  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { verifiedAt: now },
  });

  let user = await prisma.user.findUnique({ where: { mobile } });
  let isNewUser = false;

  if (!user) {
    user = await prisma.user.create({
      data: {
        mobile,
        role: "patient",
        source: "self_signup",
        status: "active",
        mobileVerifiedAt: now,
      },
    });
    isNewUser = true;
  } else {
    if (user.status === "blocked") {
      throw new AppError(403, "USER_BLOCKED", "This account has been blocked");
    }

    const updateData: { status?: "active"; mobileVerifiedAt?: Date } = {};
    if (user.status === "pending") {
      updateData.status = "active";
    }
    if (!user.mobileVerifiedAt) {
      updateData.mobileVerifiedAt = now;
    }

    if (Object.keys(updateData).length > 0) {
      user = await prisma.user.update({ where: { id: user.id }, data: updateData });
    }
  }

  return { user, isNewUser };
}
