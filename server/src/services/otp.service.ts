import { OtpPurpose, User } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";
import { sendOtpSms, verifyOtpExternal } from "./sms.service";

const MAX_REQUESTS_PER_WINDOW = 7;
const RATE_LIMIT_WINDOW_MIN = 15;

export async function requestOtp(mobile: string): Promise<void> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60 * 1000);

  const recentRequestCount = await prisma.otpVerification.count({
    where: { mobile, createdAt: { gte: windowStart } },
  });

  if (recentRequestCount >= MAX_REQUESTS_PER_WINDOW) {
    throw new AppError(429, "OTP_RATE_LIMITED", "Too many OTP requests. Please try again later.");
  }

  const now = new Date();

  // Expire any active request records so the audit trail stays clean.
  await prisma.otpVerification.updateMany({
    where: { mobile, verifiedAt: null, expiresAt: { gt: now } },
    data: { expiresAt: now },
  });

  // OTP generation and SMS delivery are fully delegated to the external provider.
  await sendOtpSms(mobile);

  const existingUser = await prisma.user.findUnique({ where: { mobile } });
  const purpose: OtpPurpose = existingUser ? "login" : "signup";
  const expiresAt = new Date(now.getTime() + env.otpExpiryMin * 60 * 1000);

  // Store a request record for rate limiting and audit.
  // otpHash is a sentinel — the actual OTP is owned by the external provider.
  await prisma.otpVerification.create({
    data: { mobile, otpHash: "external", purpose, expiresAt },
  });
}

export interface VerifyOtpResult {
  user: User;
  isNewUser: boolean;
}

export async function verifyOtpAndResolveUser(mobile: string, otp: string): Promise<VerifyOtpResult> {
  const now = new Date();

  // OTP verification is fully delegated to the external provider.
  const verified = await verifyOtpExternal(mobile, otp);
  if (!verified) {
    throw new AppError(400, "OTP_INVALID", "Invalid or expired OTP");
  }

  // Mark the most recent pending request record as verified for the audit trail.
  const otpRecord = await prisma.otpVerification.findFirst({
    where: { mobile, verifiedAt: null, expiresAt: { gt: now } },
    orderBy: { createdAt: "desc" },
  });
  if (otpRecord) {
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: now },
    });
  }

  let user = await prisma.user.findUnique({ where: { mobile } });
  let isNewUser = false;

  if (!user || user.deletedAt) {
    // No account exists, or the previous account was soft-deleted.
    if (user?.deletedAt) {
      await prisma.$transaction(async (tx) => {
        await tx.refreshToken.deleteMany({ where: { userId: user!.id } });
        await tx.user.delete({ where: { id: user!.id } });
      });
    }
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
