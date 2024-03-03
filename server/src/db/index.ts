import mongoose from "mongoose";

const DB_NAME = "mern-blog"

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMongoDB Connected successfully !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("\nMongoDB Connection Error: ", error);
        process.exit(1);
    }
}

export default connectDB;