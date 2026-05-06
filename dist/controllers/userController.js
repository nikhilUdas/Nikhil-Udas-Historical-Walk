import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "../middleware/auth.js";
import prisma from "../models/index.js";
import { sendOTPEmail } from "../utils/emailService.js";
import { fileToBase64 } from "../utils/fileUpload.js";
import { getFullUrl } from "../utils/mediaPath.js";
const JWT_SECRET = process.env.JWT_SECRET || "historicalwalksecret";
const OTP_EXPIRY_MINUTES = 10;
//generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
//compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
//JWT token
const generateToken = (userId, role, type) => {
    return jwt.sign({ userId, role, type }, JWT_SECRET, { expiresIn: "7d" });
};
// Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Missing required fields: name, email, and password are required",
        });
    }
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
                existingUserId: existingUser.user_id,
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
                    role: "user",
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
        const isDevelopment = process.env.NODE_ENV !== "production";
        let emailSent = false;
        try {
            const emailPromise = sendOTPEmail(result.user.email, result.otpCode, result.user.name);
            await emailPromise;
            emailSent = true;
        }
        catch (emailError) {
            emailSent = false;
            if (emailError?.response) {
                console.error("SMTP Response:", emailError.response);
            }
            if (emailError?.responseCode) {
                console.error("SMTP Response Code:", emailError.responseCode);
            }
            console.error("==========================================\n");
        }
        const responseData = {
            message: emailSent
                ? "User registered successfully. Please check your email for the OTP verification code."
                : "User registered successfully. Please verify your email with the OTP code. (Email sending failed - check server logs)",
            userId: result.user.user_id,
            emailSent: emailSent,
            ...(isDevelopment && { otp: result.otpCode }),
        };
        return res.status(201).json(responseData);
    }
    catch (error) {
        console.error("Error registering user:", error);
        if (error.code === "P2002") {
            return res.status(400).json({ message: "Email already in use" });
        }
        return res
            .status(500)
            .json({ message: "Error registering user", error: error.message });
    }
};
// Resend OTP
export const resendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
        const isDevelopment = process.env.NODE_ENV !== "production";
        try {
            await sendOTPEmail(user.email, otpCode, user.name);
        }
        catch (emailError) {
            console.error("❌ Error sending OTP email:", emailError?.message || emailError);
            console.error("Full error:", emailError);
        }
        return res.status(200).json({
            message: "OTP has been regenerated.",
            ...(isDevelopment && { otp: otpCode }),
        });
    }
    catch (error) {
        console.error("Error resending OTP:", error);
        return res
            .status(500)
            .json({ message: "Error resending OTP", error: error.message });
    }
};
// Verify OTP
export const verifyOTP = async (req, res) => {
    const { email, otp_code } = req.body;
    if (!email || !otp_code) {
        return res.status(400).json({ message: "Email and OTP code are required" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
                created_at: "desc",
            },
        });
        if (!otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
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
        const token = generateToken(user.user_id, user.role, "user");
        return res.status(200).json({
            message: "OTP verified successfully",
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
        console.error("Error verifying OTP:", error);
        return res
            .status(500)
            .json({ message: "Error verifying OTP", error: error.message });
    }
};
// Login (supports both Admin and User)
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const admin = await prisma.admin.findUnique({
            where: { email: email },
        });
        if (admin) {
            const isPasswordValid = await comparePassword(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = generateToken(admin.admin_id, "admin", "admin");
            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    userId: admin.admin_id,
                    email: admin.email,
                    name: admin.name,
                    role: "admin",
                    type: "admin",
                    isVerified: true,
                },
            });
        }
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = generateToken(user.user_id, user.role, "user");
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                type: "user",
                isVerified: user.email_verified,
            },
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res
            .status(500)
            .json({ message: "Error during login", error: error.message });
    }
};
// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userResult = await prisma.user.findUnique({
            where: { user_id: userId },
            include: {
                tickets: {
                    include: {
                        museum: {
                            select: {
                                museum_id: true,
                                name: true,
                                description: true,
                                opening_hours: true,
                                gps_coordinates: true,
                            },
                        },
                    },
                },
                favorites: {
                    include: {
                        site: {
                            select: {
                                site_id: true,
                                name: true,
                                description: true,
                                photo_url: true,
                                gps_coordinates: true,
                            },
                        },
                    },
                },
                reviews: true,
            },
        });
        if (!userResult) {
            return res.status(404).json({ message: "User not found" });
        }
        // Map the favorites with binary-to-URL mapping after fetching
        const user = {
            ...userResult,
            favorites: userResult.favorites.map((fav) => ({
                ...fav,
                site: {
                    ...fav.site,
                    image_url: getFullUrl(req, fav.site.photo_url || fav.site.image_path, `/api/media/heritage-sites/${fav.site.site_id}/image`),
                },
            })),
        };
        return res.status(200).json({
            user: {
                userId: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.email_verified,
                profileImage: getFullUrl(req, user.profile_image, `/api/media/users/${user.user_id}/image?t=${Date.now()}`),
                tickets: user.tickets,
                favorites: user.favorites,
                reviews: user.reviews,
            },
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return res
            .status(500)
            .json({ message: "Error fetching user profile", error: error.message });
    }
};
// Update User Profile
export const updateUserProfile = async (req, res) => {
    const { name, email } = req.body;
    const files = req.files;
    const file = req.file || files?.image?.[0] || files?.profileImage?.[0] || null;
    try {
        const userId = req.user?.userId;
        console.log(`[Profile Update] Request received for userId: ${userId}`);
        console.log(`[Profile Update] Body:`, req.body);
        console.log(`[Profile Update] File:`, file
            ? {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            }
            : "No file");
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const updateData = {};
        if (name && typeof name === "string")
            updateData.name = name.trim();
        const trimmedEmail = typeof email === "string" ? email.trim() : "";
        if (trimmedEmail)
            updateData.email = trimmedEmail;
        // Handle profile image upload
        if (file) {
            console.log(`[Profile Update] Processing image: ${file.originalname}`);
            const base64Data = await fileToBase64(file);
            updateData.profile_image = base64Data;
            console.log(`[Profile Update] Image converted to Base64 (length: ${base64Data.length})`);
        }
        else if (typeof req.body?.profileImage === "string" &&
            req.body.profileImage.startsWith("data:image/")) {
            // Optional compatibility path for clients sending Base64 image in JSON body.
            updateData.profile_image = req.body.profileImage;
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }
        // If email is being updated, check if it's already in use
        if (trimmedEmail) {
            const existingUser = await prisma.user.findUnique({
                where: { email: trimmedEmail },
            });
            if (existingUser && existingUser.user_id !== userId) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }
        console.log(`[Profile Update] Executing Prisma update for user ${userId}...`);
        const updatedUser = await prisma.user.update({
            where: { user_id: Number(userId) }, // Ensure it's a number
            data: updateData,
        });
        console.log(`[Profile Update] Success. New profile_image exists: ${!!updatedUser.profile_image}`);
        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                userId: updatedUser.user_id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                isVerified: updatedUser.email_verified,
                profileImage: getFullUrl(req, updatedUser.profile_image, `/api/media/users/${updatedUser.user_id}/image?t=${Date.now()}`),
            },
        });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        return res
            .status(500)
            .json({ message: "Error updating user profile", error: error.message });
    }
};
// Forgot Password - Step 1: Request OTP by email
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User with this email not found" });
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
        const isDevelopment = process.env.NODE_ENV !== "production";
        let emailSent = false;
        try {
            await sendOTPEmail(user.email, otpCode, user.name);
            emailSent = true;
        }
        catch (emailError) {
            console.error("❌ Error sending forgot password OTP email:", emailError?.message || emailError);
        }
        return res.status(200).json({
            message: emailSent
                ? "OTP has been sent to your email. Please check your inbox."
                : "OTP has been generated. (Email sending failed - check server logs)",
            emailSent: emailSent,
            ...(isDevelopment && { otp: otpCode }),
        });
    }
    catch (error) {
        console.error("Error in forgot password:", error);
        return res.status(500).json({
            message: "Error processing forgot password request",
            error: error.message,
        });
    }
};
// Forgot Password - Step 2: Verify OTP and reset password
export const resetPassword = async (req, res) => {
    const { email, otp_code, new_password } = req.body;
    if (!email || !otp_code || !new_password) {
        return res.status(400).json({
            message: "Email, OTP code, and new password are required",
        });
    }
    if (new_password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long",
        });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User with this email not found" });
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
                created_at: "desc",
            },
        });
        if (!otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
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
            message: "Password has been reset successfully. You can now login with your new password.",
        });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return res
            .status(500)
            .json({ message: "Error resetting password", error: error.message });
    }
};
//# sourceMappingURL=userController.js.map