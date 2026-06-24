import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";
import { validateBody, validateQuery } from "../middleware/validate";
import {
  doctorListQuerySchema,
  rejectDoctorSchema,
  rejectDocumentSchema,
  requestResubmissionSchema,
  suspendDoctorSchema,
} from "../validators/admin.validators";

const router = Router();

router.use(authenticate, requireRole("admin", "super_admin"));

router.get("/doctors", validateQuery(doctorListQuerySchema), adminController.listDoctors);
router.get("/doctors/:id", adminController.getDoctorDetail);
router.post("/doctors/:id/approve", adminController.approveDoctor);
router.post("/doctors/:id/reject", validateBody(rejectDoctorSchema), adminController.rejectDoctor);
router.post("/doctors/:id/suspend", validateBody(suspendDoctorSchema), adminController.suspendDoctor);
router.post(
  "/doctors/:id/request-resubmission",
  validateBody(requestResubmissionSchema),
  adminController.requestResubmission,
);

router.post("/doctors/:doctorId/documents/:documentId/approve", adminController.approveDocument);
router.post(
  "/doctors/:doctorId/documents/:documentId/reject",
  validateBody(rejectDocumentSchema),
  adminController.rejectDocument,
);

export default router;
