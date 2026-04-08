import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const heritageSites = await prisma.heritageSite.findMany({ select: { site_id: true, image_path: true } });
  const heritageSiteImages = await prisma.heritageSiteImage.findMany({ select: { image_id: true, image_path: true } });
  const museums = await prisma.museum.findMany({ select: { museum_id: true, image_path: true } });
  const museumImages = await prisma.museumImage.findMany({ select: { image_id: true, image_path: true } });

  console.log('Heritage Sites:', heritageSites);
  console.log('Heritage Site Images:', heritageSiteImages);
  console.log('Museums:', museums);
  console.log('Museum Images:', museumImages);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

Agent
