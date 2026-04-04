
import "dotenv/config";
import prisma from "./src/models/index.js";

async function main() {
  try {
    console.log("Checking Heritage Sites...");
    const heritageSites = await prisma.heritageSite.findMany({
      select: { site_id: true, name: true, photo_url: true, image_path: true }
    });
    console.log(JSON.stringify(heritageSites, null, 2));

    console.log("\nChecking Museums...");
    const museums = await prisma.museum.findMany({
      select: { museum_id: true, name: true, image_path: true }
    });
    console.log(JSON.stringify(museums, null, 2));
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit();
  }
}

main();
