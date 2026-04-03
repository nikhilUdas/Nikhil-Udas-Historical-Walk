import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import { initializeSocket } from "./services/socketService.js";
// ❗ FIX 1: Correct route import (your file has 'userRoutes')
import adminHeritageSiteRoutes from "./routes/adminHeritageSiteRoute.js";
import adminStoryRoutes from "./routes/adminStoryRoute.js";
import favoriteRoutes from "./routes/favoriteRoute.js";
import heritageSiteRoutes from "./routes/heritageSiteRoute.js";
import mediaRoutes from "./routes/mediaRoute.js";
import museumRoutes from "./routes/museumRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import storyRoutes from "./routes/storyRoute.js";
import ticketRoutes from "./routes/ticketRoute.js";
import userRoutes from "./routes/userRoute.js";
import { registerUser } from "./controllers/userController.js";
const app = express();
const httpServer = http.createServer(app);
// Initialize Socket.io
initializeSocket(httpServer);
// CORS configuration - MUST be before other middleware
app.use(cors({
    origin: ["http://localhost:8081", "http://127.0.0.1:8081"], // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
}));
// Debug middleware to log all requests (must be first - before body parsing)
app.use((req, res, next) => {
    // Force immediate output to ensure we see requests
    const timestamp = new Date().toISOString();
    const logMsg = `\n ===== INCOMING REQUEST [${timestamp}] =====\nMethod: ${req.method}\nPath: ${req.path}\nOriginal URL: ${req.originalUrl}\n`;
    // Use console.error to ensure visibility
    console.error(`INCOMING REQUEST: ${req.method} ${req.path} `);
    // Write to both stdout and console
    process.stdout.write(logMsg);
    console.log(logMsg);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    next();
});
// Body parsing middleware - AFTER request logging
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Routes
app.get("/", async (req, res) => {
    res.send("This is the backend server of Historical Walk!");
});
// Test route
app.get("/api/test", (req, res) => {
    console.log(" TEST ENDPOINT HIT! ");
    res.json({
        message: "API routes are working!",
        timestamp: new Date().toISOString(),
    });
});
// Simple POST test endpoint
app.post("/api/test", (req, res) => {
    console.log(" POST TEST ENDPOINT HIT! ");
    console.log("Body received:", req.body);
    res.json({
        message: "POST endpoint is working!",
        body: req.body,
        timestamp: new Date().toISOString(),
    });
});
// User routes - mounted at /api/users
app.use("/api/users", (req, res, next) => {
    next();
}, userRoutes);
// Admin story routes - mounted at /api/admin/stories
app.use("/api/admin/stories", adminStoryRoutes);
// Admin heritage site routes - mounted at /api/admin/sites
app.use("/api/admin/sites", adminHeritageSiteRoutes);
// Public heritage site routes - mounted at /api/heritage-sites
app.use("/api/heritage-sites", heritageSiteRoutes);
// Public story routes - mounted at /api/stories
app.use("/api/stories", storyRoutes);
// Museum routes - mounted at /api/museums
app.use("/api/museums", museumRoutes);
// Notification routes - mounted at /api/notifications
app.use("/api/notifications", notificationRoutes);
// Payment routes - mounted at /api/payment
app.use("/api/payment", paymentRoutes);
// Ticket routes - mounted at /api/tickets
app.use("/api/tickets", ticketRoutes);
// Admin stats route - mounted at /api/admin/stats
import adminStatsRoutes from "./routes/adminStatsRoute.js";
app.use("/api/admin/stats", adminStatsRoutes);
// Media routes - for serving images
app.use("/api/media", mediaRoutes);
// Favorite routes - for user's favorite heritage sites
app.use("/api/favorites", favoriteRoutes);
app.post("/api/users/register", async (req, res) => {
    console.log(" Direct register route hit!");
    console.log("Request body:", req.body);
    try {
        await registerUser(req, res);
    }
    catch (error) {
        console.error("Error in register route:", error);
        if (!res.headersSent) {
            res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
});
// 404 handler
app.use((req, res) => {
    console.log(` 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.path}`,
    });
});
// Final global error handler to capture 500s
app.use((err, req, res, next) => {
    console.error(" GLOBAL ERROR HANDLER CAUGHT:", err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {},
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});
const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT ERROR:", err);
});
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED PROMISE REJECTION:", err);
});
httpServer.listen(PORT, HOST, () => {
    console.log(`SERVER STARTED SUCCESSFULLY`);
    console.log(`Port: ${PORT}`);
    console.log(`Socket.io is running on ws://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map