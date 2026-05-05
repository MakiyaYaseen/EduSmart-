import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected Successfully");
    }
    catch (error) {
        console.log("Database Connection Error:", error);
    }
}

export default connectDB;
