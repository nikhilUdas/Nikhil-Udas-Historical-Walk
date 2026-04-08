import "dotenv/config";
import { sendOTPEmail } from "../src/utils/emailService.js";

async function testEmail() {
  console.log("🚀 Starting Email Test...");
  console.log("Environment Variables:");
  console.log(`- SMTP_USER: ${process.env.SMTP_USER || "Not set"}`);
  console.log(`- SMTP_PASS: ${process.env.SMTP_PASS ? "****" : "Not set"}`);
  console.log(`- SMTP_HOST: ${process.env.SMTP_HOST || "smtp.gmail.com (default)"}`);
  console.log(`- SMTP_PORT: ${process.env.SMTP_PORT || "465 (default)"}`);
  console.log(`- SMTP_SECURE: ${process.env.SMTP_SECURE || "false (default)"}`);
  
  const testEmail = "historical.walkofficial@gmail.com"; // Test by sending it to yourself
  const testOtp = "123456";
  const testName = "Test User";

  try {
    console.log(`\n📧 Attempting to send test email to ${testEmail}...`);
    await sendOTPEmail(testEmail, testOtp, testName);
    console.log("\n✅ SUCCESS: Email sent successfully!");
  } catch (error: any) {
    console.error("\n❌ FAILURE: Could not send email.");
    console.error("Error Detail:", error.message);
    process.exit(1);
  }
}

testEmail();
