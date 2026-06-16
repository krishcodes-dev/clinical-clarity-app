import { prisma } from "../src/utils/prisma";

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
