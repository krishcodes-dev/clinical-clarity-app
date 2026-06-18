import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";

export async function deleteAccount(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }

  const now = new Date();

  // Revoke every active refresh token so all devices are logged out immediately.
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null, expiresAt: { gt: now } },
    data: { revokedAt: now },
  });

  // Soft-delete: mark deletedAt for the 30-day grace period and block re-login.
  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: now, status: "blocked" },
  });
}
