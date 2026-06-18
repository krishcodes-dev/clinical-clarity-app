import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.delete("/me", authenticate, usersController.deleteAccount);

export default router;
