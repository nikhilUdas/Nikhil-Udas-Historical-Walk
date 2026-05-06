const BREVO_API_KEY = (process.env.BREVO_API_KEY || process.env.brevo_api_key)?.trim();
const SMTP_USER = (process.env.SMTP_USER || process.env.smtp_user)?.trim();
const SMTP_FROM = (process.env.SMTP_FROM || process.env.smtp_from || SMTP_USER || 'historical.walkofficial@gmail.com')?.trim();

if (!BREVO_API_KEY) {
  console.warn('⚠️  Brevo API key not found in environment variables. Emails will not be sent.');
} else {
  console.log('✅ Brevo API initialized successfully for email service.');
}

// Send OTP email using Brevo's HTTP API
export const sendOTPEmail = async (email: string, otpCode: string, fullName: string): Promise<void> => {
  if (!BREVO_API_KEY) {
    const errorMsg = 'BREVO_API_KEY is not configured in environment variables.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  console.log(`[EmailService] Preparing email via Brevo API from: ${SMTP_FROM} to: ${email}`);

  const payload = {
    sender: {
      name: 'Historical Walk',
      email: SMTP_FROM
    },
    to: [
      {
        email: email,
        name: fullName
      }
    ],
    subject: 'Historical Walk - Email Verification OTP',
    htmlContent: `
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
    `
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      console.error('\n ===== EMAIL SENDING FAILED (Brevo API) =====');
      console.error('Status:', response.status);
      console.error('Error Data:', errorData);
      console.error('===============================================\n');
      throw new Error(`Brevo API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json() as any;
    console.log(`✅ OTP email successfully sent to ${email}. Message ID: ${data.messageId}`);
  } catch (error: any) {
    console.error('\n ===== EMAIL SENDING EXCEPTION =====');
    console.error(error);
    console.error('=====================================\n');
    throw new Error(`Failed to send OTP email: ${error?.message || 'Unknown error'}`);
  }
};