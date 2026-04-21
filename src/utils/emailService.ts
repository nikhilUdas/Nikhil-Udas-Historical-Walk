import nodemailer from 'nodemailer';

const SMTP_USER = (process.env.SMTP_USER || process.env.smtp_user)?.trim();
const SMTP_PASS = (process.env.SMTP_PASS || process.env.smtp_pass)?.trim();
const SMTP_HOST = (process.env.SMTP_HOST || process.env.smtp_host || 'smtp-relay.brevo.com')?.trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || process.env.smtp_port) || 587;
const SMTP_FROM = (process.env.SMTP_FROM || process.env.smtp_from || SMTP_USER)?.trim();

const smtpSecureRaw = (process.env.SMTP_SECURE || process.env.smtp_secure)?.toString().trim().toLowerCase();
const SMTP_SECURE = smtpSecureRaw === 'true' || smtpSecureRaw === '1' || (SMTP_PORT === 465 && smtpSecureRaw !== 'false');



// Create transporter only if credentials exist
let transporter: nodemailer.Transporter | null = null;

if (SMTP_USER && SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      
      connectionTimeout: 60000, 
      greetingTimeout: 60000,
      socketTimeout: 60000,
      debug: true, 
      logger: true,
      pool: false, 
    } as any);
    
    // Verify connection asynchronously (don't block startup)
    transporter.verify((error: any, success) => {
      if (error) {
        console.error('❌ SMTP Connection Verification Failed:');
        console.error('   Error code:', error?.code);
        console.error('   Error message:', error?.message);
        if (error?.code === 'EAUTH') {
          console.error('   AUTHENTICATION ERROR: Check your SMTP_USER and SMTP_PASS (App Password)');
        }
      } else {
        console.log('✅ SMTP Connection verified successfully');
      }
    });
  } catch (error) {
    console.error(' Failed to create email transporter:', error);
  }
} else {
  console.warn('  Email transporter not created - missing credentials');
}

// Send OTP email
export const sendOTPEmail = async (email: string, otpCode: string, fullName: string): Promise<void> => {
  // Proceed to send the OTP email
  
  if (!SMTP_USER || !SMTP_PASS) {
    const errorMsg = 'SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in .env file';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  if (!transporter) {
    const errorMsg = 'Email transporter not initialized. Check SMTP configuration.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  // SMTP user is configured
  console.log(`[EmailService] Preparing email from: ${SMTP_FROM || SMTP_USER} to: ${email}`);

  const mailOptions = {
    from: SMTP_FROM || SMTP_USER,
    to: email,
    subject: 'Historical Walk - Email Verification OTP',
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
    // Ensure transporter is ready
    if (!transporter) {
      throw new Error('Email transporter is null. Cannot send email.');
    }
    const info = await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error('\n ===== EMAIL SENDING FAILED =====');
    console.error('Error code:', error?.code);
    console.error('Error command:', error?.command);
    console.error('Error message:', error?.message);
    console.error('Error response:', error?.response);
    console.error('Error responseCode:', error?.responseCode);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('===================================\n');
    
    // Provide specific error messages
    if (error?.code === 'EAUTH') {
      const detailedError = 'SMTP authentication failed. This usually means:\n' +
        '1. You are using your regular Gmail password instead of an App Password\n' +
        '2. Your App Password is incorrect\n' +
        '3. 2-Step Verification is not enabled on your Google Account\n\n' +
        'To fix:\n' +
        '1. Go to https://myaccount.google.com/security\n' +
        '2. Enable 2-Step Verification if not already enabled\n' +
        '3. Go to App Passwords: https://myaccount.google.com/apppasswords\n' +
        '4. Generate a new App Password for "Mail"\n' +
        '5. Use that 16-character password (no spaces) in your .env file as SMTP_PASS';
      console.error(detailedError);
      throw new Error(detailedError);
    } else if (error?.code === 'ECONNECTION' || error?.code === 'ETIMEDOUT') {
      throw new Error('Could not connect to SMTP server. Check your internet connection and firewall settings.');
    } else if (error?.code === 'EENVELOPE') {
      throw new Error('Invalid email address. Check the recipient email format.');
    } else {
      throw new Error(`Failed to send OTP email: ${error?.message || 'Unknown error'} (Code: ${error?.code || 'N/A'})`);
    }
  }
};