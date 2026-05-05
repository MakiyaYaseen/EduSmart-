import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "pkr" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    paymentId: { type: String }, // Stripe Session ID or PaymentIntent ID
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
