import mongoose from "mongoose";

let isConnected = false;

const connectDb = async() : Promise<void>=>{
    if (isConnected) return;
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL as string)
        isConnected = !!connection.connections[0].readyState;
        console.log(`MongoDb is successfully connected: ${connection.connection.host}`);
    }
    catch(error){
        console.log("MongoDB connection error:", error);
    }
}

export default connectDb;