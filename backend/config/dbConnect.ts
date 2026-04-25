import mongoose from "mongoose";

const connectDb = async() : Promise<void>=>{
    // If already connected, reuse the connection (important for Vercel serverless)
    if (mongoose.connection.readyState >= 1) return;

    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL as string)
        console.log(`MongoDb is successfully connected: ${connection.connection.host}`);
    }
    catch(error){
        console.error(`MongoDb connection error:`, error);
        throw error; // Throw instead of process.exit so callers can handle it
    }
}


export default connectDb;