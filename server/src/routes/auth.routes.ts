import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
  logoutSchema,
  otpRequestSchema,
  otpVerifySchema,
  tokenRefreshSchema,
} from "../validators/auth.validators";

const router = Router();

router.post("/otp/request", validateBody(otpRequestSchema), authController.requestOtp);
router.post("/otp/verify", validateBody(otpVerifySchema), authController.verifyOtp);
router.post("/token/refresh", validateBody(tokenRefreshSchema), authController.refreshToken);
router.post("/logout", authenticate, validateBody(logoutSchema), authController.logout);

export default router;
