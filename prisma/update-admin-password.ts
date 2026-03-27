import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../src/models/index';

async function main() {
  const adminEmail = 'admin@historicalwalk.com';
  const newPassword = 'admin123';

  console.log(`Updating password for ${adminEmail}...`);

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the admin record
  try {
    const updatedAdmin = await prisma.admin.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
      },
    });

    console.log('✅ Admin password updated successfully!');
    console.log('Email:', updatedAdmin.email);
    console.log('New hashed password:', updatedAdmin.password);
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    
    // If update fails, check if the admin exists
    const admin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });
    
    if (!admin) {
      console.log(`Admin with email ${adminEmail} not found. Creating instead...`);
      const createdAdmin = await prisma.admin.create({
        data: {
          name: 'Historical Admin',
          email: adminEmail,
          password: hashedPassword,
        },
      });
      console.log('✅ Admin user created successfully!');
    }
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // prisma.$disconnect() is not needed here if it's handled globally, 
    // but src/models/index usually doesn't disconnect automatically.
    // However, for a one-off script, we should probably still do it.
    // Wait, the original code had:
    // await prisma.$disconnect();
    // Since we are importing the shared instance, we can still disconnect it.
    await prisma.$disconnect();
  });
