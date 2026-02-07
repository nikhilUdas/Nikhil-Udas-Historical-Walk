import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../models/index.js';
import '../middleware/auth.js';
import { sendOTPEmail } from '../utils/emailService.js';
const JWT_SECRET = process.env.JWT_SECRET || 'historicalwalksecret';
const OTP_EXPIRY_MINUTES = 10;
// Helper function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Helper function to hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
// Helper function to compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
// Helper function to generate JWT token
const generateToken = (userId, role, type) => {
    return jwt.sign({ userId, role, type }, JWT_SECRET, { expiresIn: '7d' });
};
// Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields: name, email, and password are required' });
    }
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists',
                existingUserId: existingUser.user_id
            });
        }
        // Hash password
        const hashedPassword = await hashPassword(password);
        // Create user and OTP in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword,
                    role: 'user',
                    email_verified: false,
                },
            });
            // Generate and store OTP
            const otpCode = generateOTP();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);
            await tx.userOTP.create({
                data: {
                    user_id: user.user_id,
                    otp_code: otpCode,
                    expires_at: expiresAt,
                    is_verified: false,
                },
            });
            return { user, otpCode };
        });
        // Send OTP email
        const isDevelopment = process.env.NODE_ENV !== 'production';
        let emailSent = false;
        try {
            const emailPromise = sendOTPEmail(result.user.email, result.otpCode, result.user.name);
            await emailPromise;
            emailSent = true;
        }
        catch (emailError) {
            emailSent = false;
            if (emailError?.response) {
                console.error('SMTP Response:', emailError.response);
            }
            if (emailError?.responseCode) {
                console.error('SMTP Response Code:', emailError.responseCode);
            }
            console.error('==========================================\n');
        }
        const responseData = {
            message: emailSent
                ? 'User registered successfully. Please check your email for the OTP verification code.'
                : 'User registered successfully. Please verify your email with the OTP code. (Email sending failed - check server logs)',
            userId: result.user.user_id,
            emailSent: emailSent,
            ...(isDevelopment && { otp: result.otpCode }),
        };
        return res.status(201).json(responseData);
    }
    catch (error) {
        console.error('Error registering user:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Email already in use' });
        }
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};
// Resend OTP
export const resendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otpCode = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);
        await prisma.userOTP.create({
            data: {
                user_id: user.user_id,
                otp_code: otpCode,
                expires_at: expiresAt,
                is_verified: false,
            },
        });
        const isDevelopment = process.env.NODE_ENV !== 'production';
        try {
            await sendOTPEmail(user.email, otpCode, user.name);
        }
        catch (emailError) {
            console.error('❌ Error sending OTP email:', emailError?.message || emailError);
            console.error('Full error:', emailError);
        }
        return res.status(200).json({
            message: 'OTP has been regenerated.',
            ...(isDevelopment && { otp: otpCode }),
        });
    }
    catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ message: 'Error resending OTP', error: error.message });
    }
};
// Verify OTP
export const verifyOTP = async (req, res) => {
    const { email, otp_code } = req.body;
    if (!email || !otp_code) {
        return res.status(400).json({ message: 'Email and OTP code are required' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = await prisma.userOTP.findFirst({
            where: {
                user_id: user.user_id,
                otp_code: otp_code,
                is_verified: false,
                expires_at: {
                    gt: new Date(),
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        if (!otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        // Mark OTP as verified and update user's email_verified status
        await prisma.$transaction(async (tx) => {
            await tx.userOTP.update({
                where: { otp_id: otp.otp_id },
                data: { is_verified: true },
            });
            await tx.user.update({
                where: { user_id: user.user_id },
                data: { email_verified: true },
            });
        });
        const token = generateToken(user.user_id, user.role, 'user');
        return res.status(200).json({
            message: 'OTP verified successfully',
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: true,
            },
        });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};
// Login (supports both Admin and User)
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const admin = await prisma.admin.findUnique({
            where: { email: email },
        });
        if (admin) {
            const isPasswordValid = await comparePassword(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const token = generateToken(admin.admin_id, 'admin', 'admin');
            return res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    userId: admin.admin_id,
                    email: admin.email,
                    name: admin.name,
                    role: 'admin',
                    type: 'admin',
                    isVerified: true,
                },
            });
        }
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user.user_id, user.role, 'user');
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                type: 'user',
                isVerified: user.email_verified,
            },
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
};
// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            include: {
                tickets: {
                    include: {
                        museum: true,
                    },
                },
                favorites: {
                    include: {
                        site: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            user: {
                userId: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.email_verified,
                tickets: user.tickets,
                favorites: user.favorites,
            },
        });
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};
// Update User Profile
export const updateUserProfile = async (req, res) => {
    const { name, password } = req.body;
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (password) {
            updateData.password = await hashPassword(password);
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: updateData,
        });
        return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                userId: updatedUser.user_id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                isVerified: updatedUser.email_verified,
            },
        });
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
};
// Forgot Password - Step 1: Request OTP by email
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User with this email not found' });
        }
        const otpCode = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);
        await prisma.userOTP.create({
            data: {
                user_id: user.user_id,
                otp_code: otpCode,
                expires_at: expiresAt,
                is_verified: false,
            },
        });
        const isDevelopment = process.env.NODE_ENV !== 'production';
        let emailSent = false;
        try {
            await sendOTPEmail(user.email, otpCode, user.name);
            emailSent = true;
        }
        catch (emailError) {
            console.error('❌ Error sending forgot password OTP email:', emailError?.message || emailError);
        }
        return res.status(200).json({
            message: emailSent
                ? 'OTP has been sent to your email. Please check your inbox.'
                : 'OTP has been generated. (Email sending failed - check server logs)',
            emailSent: emailSent,
            ...(isDevelopment && { otp: otpCode }),
        });
    }
    catch (error) {
        console.error('Error in forgot password:', error);
        return res.status(500).json({ message: 'Error processing forgot password request', error: error.message });
    }
};
// Forgot Password - Step 2: Verify OTP and reset password
export const resetPassword = async (req, res) => {
    const { email, otp_code, new_password } = req.body;
    if (!email || !otp_code || !new_password) {
        return res.status(400).json({
            message: 'Email, OTP code, and new password are required'
        });
    }
    if (new_password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long'
        });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User with this email not found' });
        }
        const otp = await prisma.userOTP.findFirst({
            where: {
                user_id: user.user_id,
                otp_code: otp_code,
                is_verified: false,
                expires_at: {
                    gt: new Date(),
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        if (!otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        const hashedPassword = await hashPassword(new_password);
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { user_id: user.user_id },
                data: { password: hashedPassword },
            });
            await tx.userOTP.update({
                where: { otp_id: otp.otp_id },
                data: { is_verified: true },
            });
        });
        return res.status(200).json({
            message: 'Password has been reset successfully. You can now login with your new password.',
        });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};
//# sourceMappingURL=userController.js.map