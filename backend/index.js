import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import cookieParser from 'cookie-parser';
import authRouter from './route/authRoute.js';
import userRouter from './route/userRoute.js';
import cors from "cors";
import courseRouter from './route/courseRoute.js';
import orderRoute from './route/orderRoute.js';
import reviewRouter from './route/reviewRoute.js';
import progressRouter from "./route/progressRoute.js";
import assignmentRouter from './route/assignmentRoute.js';
import certificateRouter from './route/certificateRoute.js';
import aiRouter from './route/aiRoute.js';
import discussionRouter from './route/discussionRoute.js';
import notificationRouter from './route/notificationRoute.js';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// CORS should be first!
app.use(cors({
    origin: 'https://edu-smart-qvdz.vercel.app',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Set-Cookie"]
}));

// Disable helmet for now to ensure connection, we can add it back later with proper config
// app.use(helmet());

// Rate Limiting (15 mins mein 100 requests max)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", limiter);

app.use(express.json());
app.use(cookieParser());

// Connect DB Middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: "Database Connection Error" });
    }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use('/api/order', orderRoute);
app.use("/api/review", reviewRouter);
app.use("/api/progress", progressRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/certificate", certificateRouter);
app.use("/api/ai", aiRouter);
app.use("/api/discussion", discussionRouter);
app.use("/api/notification", notificationRouter);
// Test Route
app.get("/", (req, res) => {
    res.send("Hello from Server");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});

// Export for Vercel Serverless
export default app;
