import bcrypt from "bcrypt";
import "dotenv/config";
import prisma from "../src/models/index";

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@historicalwalk.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@historicalwalk.com",
      password: adminPassword,
    },
  });
  console.log("✅ Admin seeded");

  // 2. Seed Users
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
  console.log("✅ Users seeded");

  // 3. Seed Heritage Sites
  const site1 = await prisma.heritageSite.create({
    data: {
      name: "Patan Durbar Square",
      description: "A marvel of Newar architecture in the heart of Lalitpur.",
      photo_url: "https://example.com/patan.jpg",
      gps_coordinates: "27.6744° N, 85.3245° E",
      images: {
        create: [
          { image_data: "uploads/sites/dummy_image_data_1.jpg" },
          { image_data: "uploads/sites/dummy_image_data_2.jpg" },
        ],
      },
      stories: {
        create: [
          {
            title: "The Tale of the Stone Elephants",
            content: "Legend says the elephants come alive at night...",
            god_or_goddess_name: "Vishnu",
          },
        ],
      },
      routes: {
        create: [
          {
            start_location: "Patan Gate",
            end_location: "Krishna Mandir",
            distance: "500m",
            estimated_time: "10 mins",
          },
        ],
      },
    },
  });

  const site2 = await prisma.heritageSite.create({
    data: {
      name: "Boudhanath Stupa",
      description: "One of the largest spherical stupas in the world.",
      photo_url: "https://example.com/boudha.jpg",
      gps_coordinates: "27.7215° N, 85.3620° E",
    },
  });
  console.log("✅ Heritage Sites, Stories, and Routes seeded");

  // 4. Seed Museums
  const museum1 = await prisma.museum.create({
    data: {
      name: "Patan Museum",
      description:
        "Traditional sacred art of Nepal in an architectural setting.",
      opening_hours: "10:00 AM - 5:00 PM",
      gps_coordinates: "27.6744° N, 85.3245° E",
      images: {
        create: [{ image_data: "uploads/museums/museum_image_1.jpg" }],
      },
    },
  });

  const museum2 = await prisma.museum.create({
    data: {
      name: "Narayanhiti Palace Museum",
      description: "Former royal palace and now a public museum.",
      opening_hours: "11:00 AM - 4:00 PM",
      gps_coordinates: "27.7126° N, 85.3168° E",
    },
  });
  console.log("✅ Museums seeded");

  // 5. Seed Tickets & Payments
  const ticket1 = await prisma.ticket.create({
    data: {
      user_id: user1.user_id,
      museum_id: museum1.museum_id,
      price: 1000.0,
      payment_status: "completed",
      pidx: "PIDX_123456",
      quantity: 2,
      qr_code: "QR_CODE_001",
      status: "active",
      payments: {
        create: {
          payment_method: "Khalti",
          amount: 1000.0,
          payment_date: new Date(),
        },
      },
    },
  });
  console.log("✅ Tickets and Payments seeded");

  // 6. Seed story payments
  await prisma.storyPayment.create({
    data: {
      user_id: user1.user_id,
      story_id: (await prisma.story.findFirst())?.story_id || 1,
      amount: 50.0,
      payment_method: "Esewa",
      status: "completed",
      transaction_uuid: "TXN-STORY-001",
    },
  });

  // 7. Seed site payments
  await prisma.sitePayment.create({
    data: {
      user_id: user2.user_id,
      site_id: site2.site_id,
      amount: 200.0,
      payment_method: "Fonepay",
      status: "completed",
      transaction_uuid: "TXN-SITE-001",
    },
  });
  console.log("✅ Specific Model Payments seeded");

  // 8. Seed Favorite Sites
  await prisma.favoriteSite.create({
    data: {
      user_id: user1.user_id,
      site_id: site1.site_id,
    },
  });
  console.log("✅ Favorite Sites seeded");

  // 9. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        user_id: user1.user_id,
        type: "ticket_purchased",
        title: "Ticket Confirmed",
        message: "Your ticket for Patan Museum has been confirmed.",
      },
      {
        user_id: user2.user_id,
        type: "site_update",
        title: "New Story Added",
        message: "Check out the new story for Boudhanath Stupa.",
      },
    ],
  });
  console.log("✅ Notifications seeded");

  // 10. Seed Reviews
  await prisma.review.create({
    data: {
      user_id: user1.user_id,
      museum_id: museum1.museum_id,
      rating: 5,
      thoughts: "Amazing collection of artifacts!",
    },
  });
  console.log("✅ Reviews seeded");

  console.log("🚀 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
