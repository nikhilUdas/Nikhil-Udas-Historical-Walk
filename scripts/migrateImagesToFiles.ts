import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const ensureDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const isBase64 = (str: string | null | undefined): boolean => {
  if (!str) return false;
  // Simple check for base64 data URL or long string without spaces
  return str.startsWith('data:image/') || (str.length > 500 && !str.includes(' ') && !str.includes('/'));
};

const saveBase64ToFile = (base64Data: string, subDir: string, fileNamePrefix: string): string => {
  let base64Image = base64Data;
  let extension = '.jpg';

  if (base64Data.startsWith('data:image/')) {
    const match = base64Data.match(/^data:image\/(\w+);base64,/);
    if (match) {
      extension = `.${match[1]}`;
      base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    }
  }

  const destination = path.join(UPLOADS_DIR, subDir);
  ensureDirectory(destination);

  const uniqueName = `${fileNamePrefix}_${Date.now()}_${Math.round(Math.random() * 1e9)}${extension}`;
  const filePath = path.join(destination, uniqueName);
  
  fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));
  
  // Return relative path for DB
  return `uploads/${subDir}/${uniqueName}`;
};

async function migrate() {
  console.log('Starting data migration: Base64 to Files...');

  // 1. Heritage Sites
  const sites = await prisma.heritageSite.findMany();
  for (const site of sites) {
    if (isBase64(site.image_path)) {
      console.log(`Migrating main image for site: ${site.name}`);
      const newPath = saveBase64ToFile(site.image_path!, 'sites', `site_${site.site_id}`);
      await prisma.heritageSite.update({
        where: { site_id: site.site_id },
        data: { image_path: newPath, photo_url: newPath }
      });
    }
  }

  // 2. Heritage Site Images (Additional)
  const siteImages = await prisma.heritageSiteImage.findMany();
  for (const img of siteImages) {
    if (isBase64(img.image_path)) {
      console.log(`Migrating additional image for site ID: ${img.site_id}`);
      const newPath = saveBase64ToFile(img.image_path, 'sites', `site_extra_${img.image_id}`);
      await prisma.heritageSiteImage.update({
        where: { image_id: img.image_id },
        data: { image_path: newPath }
      });
    }
  }

  // 3. Museums
  const museums = await prisma.museum.findMany();
  for (const museum of museums) {
    if (isBase64(museum.image_path)) {
      console.log(`Migrating main image for museum: ${museum.name}`);
      const newPath = saveBase64ToFile(museum.image_path!, 'museums', `museum_${museum.museum_id}`);
      await prisma.museum.update({
        where: { museum_id: museum.museum_id },
        data: { image_path: newPath }
      });
    }
  }

  // 4. Museum Images
  const museumImages = await prisma.museumImage.findMany();
  for (const img of museumImages) {
    if (isBase64(img.image_path)) {
      console.log(`Migrating additional image for museum ID: ${img.museum_id}`);
      const newPath = saveBase64ToFile(img.image_path, 'museums', `museum_extra_${img.image_id}`);
      await prisma.museumImage.update({
        where: { image_id: img.image_id },
        data: { image_path: newPath }
      });
    }
  }

  // 5. Stories
  const stories = await prisma.story.findMany();
  for (const story of stories) {
    if (isBase64(story.media_path)) {
      console.log(`Migrating media for story: ${story.title}`);
      const newPath = saveBase64ToFile(story.media_path!, 'stories', `story_${story.story_id}`);
      await prisma.story.update({
        where: { story_id: story.story_id },
        data: { media_path: newPath }
      });
    }
  }

  // 6. Users
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (isBase64(user.profile_image)) {
      console.log(`Migrating profile image for user: ${user.email}`);
      const newPath = saveBase64ToFile(user.profile_image!, 'users', `user_${user.user_id}`);
      await prisma.user.update({
        where: { user_id: user.user_id },
        data: { profile_image: newPath }
      });
    }
  }

  console.log('Migration complete!');
}

migrate()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
