import { z } from "zod";

const indianMobileRegex = /^[6-9]\d{9}$/;

export const otpRequestSchema = z.object({
  mobile: z.string().regex(indianMobileRegex, "mobile must be a valid 10-digit Indian mobile number"),
});

export const otpVerifySchema = z.object({
  mobile: z.string().regex(indianMobileRegex, "mobile must be a valid 10-digit Indian mobile number"),
  otp: z.string().regex(/^\d{6}$/, "otp must be a 6-digit code"),
});

export const tokenRefreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required"),
});
