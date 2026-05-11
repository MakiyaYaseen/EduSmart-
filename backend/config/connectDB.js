import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        }
        
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000, // 5 seconds mein connect nahi hua toh fail ho jaye bajaye 30s wait karne ke
            socketTimeoutMS: 45000,
        });
        
        console.log("DB Connected Successfully");
    }
    catch (error) {
        console.log("Database Connection Error:", error);
        // Error throw karna zaroori hai taake request handle na ho agar DB down ho
        throw error;
    }
}

export default connectDB;
