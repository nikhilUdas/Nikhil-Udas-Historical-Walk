
import { initializeUploadDirectories } from "./src/utils/fileUpload.js";
import fs from "fs";
import path from "path";

async function verify() {
  console.log("Running initializeUploadDirectories...");
  initializeUploadDirectories();

  const baseDir = path.join(process.cwd(), "uploads");
  const subDirs = ["stories", "users", "museums", "sites", "misc"];

  let allExist = true;
  if (!fs.existsSync(baseDir)) {
    console.error("❌ uploads directory was not created");
    allExist = false;
  } else {
    console.log("✅ uploads directory exists");
  }

  subDirs.forEach(subDir => {
    const subDirPath = path.join(baseDir, subDir);
    if (!fs.existsSync(subDirPath)) {
      console.error(`❌ uploads/${subDir} directory was not created`);
      allExist = false;
    } else {
      console.log(`✅ uploads/${subDir} directory exists`);
    }
  });

  if (allExist) {
    console.log("\nAll directories verified successfully!");
  } else {
    console.error("\nSome directories are missing.");
  }
}

verify().catch(console.error);
