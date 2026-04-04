
import { getFullUrl } from "./src/utils/mediaPath.js";

function testGetFullUrl() {
  const mockReq = {
    protocol: "http",
    get: (header: string) => (header === "host" ? "localhost:8000" : null)
  } as any;

  const testPath = "uploads/sites/myimage.jpg";
  const expected = "http://localhost:8000/uploads/sites/myimage.jpg";
  const result = getFullUrl(mockReq, testPath);

  if (result === expected) {
    console.log("✅ getFullUrl test passed!");
    console.log(`Input: ${testPath}`);
    console.log(`Output: ${result}`);
  } else {
    console.error("❌ getFullUrl test failed!");
    console.error(`Expected: ${expected}`);
    console.error(`Received: ${result}`);
  }

  // Test already full URL
  const fullUrl = "https://example.com/img.jpg";
  if (getFullUrl(mockReq, fullUrl) === fullUrl) {
    console.log("✅ getFullUrl (already full) test passed!");
  } else {
    console.error("❌ getFullUrl (already full) test failed!");
  }
}

testGetFullUrl();
