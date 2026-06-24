import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as doctorProfileService from "../services/doctorProfile.service";

export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await doctorProfileService.createProfile(req.user!.id, req.body);
  res.status(201).json(profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await doctorProfileService.updateProfile(req.user!.id, req.body);
  res.status(200).json(profile);
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await doctorProfileService.getProfile(req.user!.id);
  res.status(200).json(profile);
});

export const getVerificationStatus = asyncHandler(async (req: Request, res: Response) => {
  const status = await doctorProfileService.getVerificationStatus(req.user!.id);
  res.status(200).json(status);
});

export const submitForReview = asyncHandler(async (req: Request, res: Response) => {
  const profile = await doctorProfileService.submitForReview(req.user!.id);
  res.status(200).json(profile);
});
