import mongoose, { mongo } from "mongoose";

const connectDb = async()=>{
    mongoose.connection.on('connected', ()=>{
        console.log("Database Connected✅");
    })
    await mongoose.connect(`${process.env.MONGO_URI}/coding-leanring`)
}

export default connectDb