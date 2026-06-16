import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";
import { UserRole } from "@prisma/client";

export interface AccessTokenPayload {
  id: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  id: string;
  jti: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
}

export function signRefreshToken(userId: string): string {
  const payload: RefreshTokenPayload = { id: userId, jti: crypto.randomUUID() };
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: "30d" });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
}

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
