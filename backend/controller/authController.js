import User from "../model/userModel.js";
import OTP from "../model/otpModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";

// ========================= SEND SIGNUP OTP =========================
export const sendSignUpOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter a valid email" });
        }

        // Check if user already exists
        const existUser = await User.findOne({ email });
        if (existUser) {
            console.log(`Signup attempt for existing user: ${email}`);
            return res.status(400).json({
                message: "This email is already registered. Please try logging in instead.",
                exists: true
            });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP in temporary collection
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send email
        await sendMail(email, otp, "Verify Your Email for Signup");

        return res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        return res.status(500).json({ message: `Send Signup OTP error: ${error}` });
    }
};

// ========================= SIGNUP CONTROLLER =========================
export const signUp = async (req, res) => {
    try {
        const { name, email, password, role, otp } = req.body;

        // Check if user exists
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // OTP verification
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter a valid email" });
        }

        // Password validation
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        // Delete OTP record after successful signup
        await OTP.deleteOne({ email });

        // Generate JWT token
        const token = genToken(user._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ message: `SignUp error: ${error}` });
    }
};

// ========================= LOGIN CONTROLLER =========================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "Please login with Google" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = genToken(user._id);
        console.log("Login JWT Token:", token);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Return response (no password)
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                enrolledCourses: user.enrolledCourses,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        return res.status(500).json({ message: `Login error: ${error}` });
    }
};

// ========================= LOGOUT CONTROLLER =========================
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `LogOut error: ${error}` });
    }
};
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP data in DB
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        user.isOtpVerified = false;

        await user.save();

        // Send email
        await sendMail(email, otp);

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Send OTP Error: ${error}` });
    }
};
//   VERIFY OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // OTP match check
        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP expiry check
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Mark OTP as verified
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Verify OTP Error: ${error}` });
    }
};

//   RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP verification required" });
        }

        // Hash new password
        const hashPassword = await bcrypt.hash(password, 10);

        user.password = hashPassword;
        user.isOtpVerified = false;

        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Reset Password Error: ${error}` });
    }
};

export const googleAuth = async (req, res) => {
    try {
        let { name, email, role } = req.body;
        if (!role) role = "student";
        let user = await User.findOne({ email }); // <-- let

        if (!user) {
            user = await User.create({
                name,
                email,
                role
            });
        }

        const token = genToken(user._id);
        console.log("Login JWT Token:", token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                enrolledCourses: user.enrolledCourses,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        return res.status(500).json({ message: `GoogleAuth Error: ${error}` });
    }
}
