import { Router } from "express";
import * as doctorProfileController from "../controllers/doctorProfile.controller";
import * as doctorDocumentController from "../controllers/doctorDocument.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";
import { validateBody } from "../middleware/validate";
import { doctorProfileUpsertSchema, documentReplaceSchema, documentUploadSchema } from "../validators/doctor.validators";

const router = Router();

router.use(authenticate, requireRole("doctor"));

router.post("/profile", validateBody(doctorProfileUpsertSchema), doctorProfileController.createProfile);
router.get("/profile", doctorProfileController.getProfile);
router.patch("/profile", validateBody(doctorProfileUpsertSchema), doctorProfileController.updateProfile);
router.get("/profile/status", doctorProfileController.getVerificationStatus);
router.post("/submit-review", doctorProfileController.submitForReview);

router.post("/documents", validateBody(documentUploadSchema), doctorDocumentController.uploadDocument);
router.get("/documents", doctorDocumentController.listDocuments);
router.patch("/documents/:id", validateBody(documentReplaceSchema), doctorDocumentController.replaceDocument);
router.delete("/documents/:id", doctorDocumentController.deleteDocument);

export default router;
