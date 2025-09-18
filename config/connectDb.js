import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database!");
    } catch (err) {
        console.error(" MongoDB connection error:", err.message);
    }
};

export default connectDb;