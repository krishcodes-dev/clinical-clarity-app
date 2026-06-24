import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as doctorDocumentService from "../services/doctorDocument.service";

export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await doctorDocumentService.uploadDocument(req.user!.id, req.body);
  res.status(201).json(document);
});

export const replaceDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await doctorDocumentService.replaceDocument(req.user!.id, req.params.id, req.body);
  res.status(200).json(document);
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  await doctorDocumentService.deleteDocument(req.user!.id, req.params.id);
  res.status(200).json({ message: "Document deleted" });
});

export const listDocuments = asyncHandler(async (req: Request, res: Response) => {
  const documents = await doctorDocumentService.listDocuments(req.user!.id);
  res.status(200).json(documents);
});
