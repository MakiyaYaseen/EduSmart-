import Stripe from 'stripe';
import User from '../model/userModel.js';
import Course from '../model/courseModel.js';
import Order from '../model/orderModel.js';
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Stripe Session Create Karna & Save Pending Order in MongoDB
export const createStripeOrder = async (req, res) => {
    try {
        const { courseId, title, price, thumbnail } = req.body;
        const userId = req.userId;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',
                        product_data: {
                            name: title,
                            images: [thumbnail || "https://via.placeholder.com/150"],
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/payment-success?courseId=${courseId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/view-course/${courseId}`,
            metadata: {
                courseId: courseId,
                userId: userId
            }
        });

        // Save pending order to MongoDB
        await Order.create({
            userId,
            courseId,
            amount: price,
            paymentId: session.id,
            status: "pending"
        });

        res.status(200).json({
            success: true,
            url: session.url
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. User ko Enroll Karna & Mark Order as Completed
export const enrollUser = async (req, res) => {
    try {
        const { courseId, sessionId } = req.body;
        const userId = req.userId;

        console.log("Starting Enrollment for User:", userId);

        if (!userId || !courseId) {
            return res.status(400).json({ success: false, message: "Missing User ID or Course ID" });
        }

        // 1. User update karein (Add course to enrolled list)
        const userUpdate = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { enrolledCourses: courseId } },
            { new: true }
        );

        // 2. Course update karein (Add user to enrolled students)
        const courseUpdate = await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { enrolledStudent: userId } },
            { new: true }
        );

        // 3. Order status completed karein
        if (sessionId) {
            await Order.findOneAndUpdate(
                { paymentId: sessionId },
                { status: "completed" }
            );
        } else {
            // Fallback if session ID is not passed
            await Order.findOneAndUpdate(
                { userId, courseId, status: "pending" },
                { status: "completed" },
                { sort: { createdAt: -1 } }
            );
        }

        if (!userUpdate || !courseUpdate) {
            return res.status(404).json({
                success: false,
                message: "User or Course not found in database."
            });
        }

        res.status(200).json({
            success: true,
            message: "Database Updated! Enrollment Successful."
        });

    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};