
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const museums = await prisma.museum.findMany({ take: 5 });
  console.log("MUSEUMS:");
  console.log(JSON.stringify(museums, null, 2));

  const sites = await prisma.heritageSite.findMany({ take: 5 });
  console.log("\nHERITAGE SITES:");
  console.log(JSON.stringify(sites, null, 2));

  const reviews = await prisma.review.findMany({ take: 5 });
  console.log("\nREVIEWS:");
  console.log(JSON.stringify(reviews, null, 2));

  await prisma.$disconnect();
}

check().catch(console.error);
