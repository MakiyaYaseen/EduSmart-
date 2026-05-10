import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            console.log("DB Already Connected");
            return;
        }
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected Successfully");
    }
    catch (error) {
        console.log("Database Connection Error:", error);
    }
}

export default connectDB;
