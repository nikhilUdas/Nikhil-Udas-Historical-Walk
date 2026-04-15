import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = (
  process.env.sendgrid_api_key || process.env.SENDGRID_API_KEY
)?.trim();

const SENDGRID_FROM_EMAIL = (
  process.env.sendgrid_from_email ||
  process.env.SENDGRID_FROM_EMAIL ||
  process.env.smtp_user ||
  process.env.SMTP_USER
)?.trim();

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn("Email service not configured - missing SENDGRID_API_KEY");
}

// Send OTP email
export const sendOTPEmail = async (
  email: string,
  otpCode: string,
  fullName: string,
): Promise<void> => {
  if (!SENDGRID_API_KEY) {
    throw new Error(
      "SendGrid API key not configured. Set SENDGRID_API_KEY in environment variables.",
    );
  }

  if (!SENDGRID_FROM_EMAIL) {
    throw new Error(
      "Sender email not configured. Set SENDGRID_FROM_EMAIL in environment variables.",
    );
  }

  const mailOptions = {
    to: email,
    from: SENDGRID_FROM_EMAIL,
    subject: "Historical Walk - Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Historical Walk Email Verification</h2>
        <p>Hello ${fullName},</p>
        <p>Thank you for registering with Historical Walk. Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #2c3e50; margin: 0; font-size: 32px; letter-spacing: 5px;">${otpCode}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          Best regards,<br>
          The Historical Walk Team
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(mailOptions);
  } catch (error: any) {
    const sendGridMessage =
      error?.response?.body?.errors?.map((e: any) => e.message).join("; ") ||
      error?.message ||
      "Unknown SendGrid error";

    console.error("SendGrid email sending failed:", sendGridMessage);
    throw new Error(`Failed to send OTP email: ${sendGridMessage}`);
  }
};