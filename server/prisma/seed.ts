import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { mobile: "9999999999" },
    update: {},
    create: {
      mobile: "9999999999",
      fullName: "Super Admin",
      role: "super_admin",
      source: "admin_created",
      status: "active",
      mobileVerifiedAt: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { mobile: "8888888888" },
    update: {},
    create: {
      mobile: "8888888888",
      fullName: "Hospital Imported Patient",
      role: "patient",
      source: "hospital",
      status: "pending",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
