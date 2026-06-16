import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "../errors/AppError";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError(401, "UNAUTHORIZED", "Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "FORBIDDEN", "You do not have permission to perform this action"));
      return;
    }

    next();
  };
}
