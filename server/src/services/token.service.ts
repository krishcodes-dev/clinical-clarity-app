import { UserRole } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { hashToken } from "../utils/hash";
import {
  REFRESH_TOKEN_TTL_MS,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function issueTokenPair(
  userId: string,
  role: UserRole,
  deviceInfo?: string
): Promise<TokenPair> {
  const accessToken = signAccessToken({ id: userId, role });
  const refreshToken = signRefreshToken(userId);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      deviceInfo,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(refreshToken: string, deviceInfo?: string): Promise<TokenPair> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid or expired refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findFirst({ where: { tokenHash } });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid or expired refresh token");
  }



  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  return issueTokenPair(user.id, user.role, deviceInfo);
}

export async function revokeRefreshToken(userId: string, refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findFirst({ where: { tokenHash, userId } });

  if (!stored || stored.revokedAt) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid or expired refresh token");
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });
}
