import { PrismaClient } from '../generated/prisma/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Default admin credentials
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@historicalwalk.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Admin';

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('⚠️  Please change the default password after first login!');
  } else {
    console.log('✅ Admin user already exists.');
  }

  console.log('\n✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

