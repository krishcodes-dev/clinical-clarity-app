import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError(401, "UNAUTHORIZED", "Missing or invalid Authorization header"));
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new AppError(401, "UNAUTHORIZED", "Invalid or expired access token"));
  }
}
