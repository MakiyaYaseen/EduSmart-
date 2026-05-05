import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "User not authenticated: Token is missing" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!verifyToken) {
            return res.status(401).json({ message: "User not authenticated: Invalid token" });
        }

        req.userId = verifyToken.userId;
        next();

    } catch (error) {
        console.error("isAuth Middleware Error:", error.message);
        return res.status(401).json({ message: "Authentication Failed: Please log in again" });
    }
};

export const isStudent = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Only students can perform this action."
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isEducator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== "educator") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Only educators can perform this action."
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default isAuth;