import { Request, Response } from "express";
import { DoctorVerificationStatus } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminVerificationService from "../services/adminVerification.service";

export const listDoctors = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as DoctorVerificationStatus | undefined;
  const verifiedBy = req.query.verifiedBy as string | undefined;
  const doctors = await adminVerificationService.listDoctors(status, verifiedBy);
  res.status(200).json(doctors);
});

export const getDoctorDetail = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await adminVerificationService.getDoctorDetail(req.params.id);
  res.status(200).json(doctor);
});

export const approveDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await adminVerificationService.approveDoctor(req.user!.id, req.params.id);
  res.status(200).json(doctor);
});

export const rejectDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await adminVerificationService.rejectDoctor(req.user!.id, req.params.id, req.body.reason);
  res.status(200).json(doctor);
});

export const suspendDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await adminVerificationService.suspendDoctor(req.user!.id, req.params.id, req.body.reason);
  res.status(200).json(doctor);
});

export const requestResubmission = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await adminVerificationService.requestResubmission(req.user!.id, req.params.id, req.body.reason);
  res.status(200).json(doctor);
});

export const approveDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await adminVerificationService.approveDocument(req.user!.id, req.params.documentId);
  res.status(200).json(document);
});

export const rejectDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await adminVerificationService.rejectDocument(
    req.user!.id,
    req.params.documentId,
    req.body.reason,
  );
  res.status(200).json(document);
});
