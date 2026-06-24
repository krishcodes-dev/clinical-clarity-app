import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join(", ");
      next(new AppError(400, "VALIDATION_ERROR", message));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "query"}: ${issue.message}`)
        .join(", ");
      next(new AppError(400, "VALIDATION_ERROR", message));
      return;
    }
    req.query = result.data as typeof req.query;
    next();
  };
}
