import bcrypt from "bcrypt";
import "dotenv/config";
import prisma from "../src/models/index";

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    // Hash the admin password
    const adminPassword = await bcrypt.hash("123456", 10);

    // 1. Seed Admin in Admin table
    const admin = await prisma.admin.upsert({
      where: { email: "admin@historicalwalk.com" },
      update: { password: adminPassword },
      create: {
        name: "System Admin",
        email: "admin@historicalwalk.com",
        password: adminPassword,
      },
    });
    console.log("✅ Admin table seeded!");
    console.log("   Email: admin@historicalwalk.com");
    console.log("   Password: 123456 (hashed)");

    // 2. Seed Admin User in User table with admin role
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@historicalwalk.com" },
      update: { password: adminPassword },
      create: {
        name: "System Admin",
        email: "admin@historicalwalk.com",
        password: adminPassword,
        role: "admin",
        email_verified: true,
      },
    });
    console.log("✅ Admin user in User table seeded!");
    console.log("   Role: admin");
    console.log("   Email Verified: Yes");

    // 3. Seed Regular Users
    const userPassword = await bcrypt.hash("user123", 10);
    const user1 = await prisma.user.upsert({
      where: { email: "john@example.com" },
      update: {},
      create: {
        name: "John Doe",
        email: "john@example.com",
        password: userPassword,
        role: "user",
        email_verified: true,
        location: "Kathmandu",
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: "jane@example.com" },
      update: {},
      create: {
        name: "Jane Smith",
        email: "jane@example.com",
        password: userPassword,
        role: "user",
        email_verified: true,
        location: "Lalitpur",
      },
    });
    console.log("✅ Sample users seeded");
    console.log("🚀 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

