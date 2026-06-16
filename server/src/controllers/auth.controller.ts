import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";

export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile } = req.body;
  await authService.requestOtp(mobile);
  res.status(200).json({ message: "If this mobile number is valid, an OTP has been sent." });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile, otp } = req.body;
  const deviceInfo = req.headers["user-agent"];
  const result = await authService.verifyOtp(mobile, otp, deviceInfo);
  res.status(200).json(result);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const deviceInfo = req.headers["user-agent"];
  const result = await authService.refreshTokens(refreshToken, deviceInfo);
  res.status(200).json(result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(req.user!.id, refreshToken);
  res.status(200).json({ message: "Logged out successfully" });
});
