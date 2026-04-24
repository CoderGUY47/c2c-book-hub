import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

// In a serverless environment, we preserve the DB connection across function 
// invocations using the global object.
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDb = async (): Promise<void> => {
  if (cached.conn) {
    return;
  }

  if (!MONGODB_URL) {
    console.error("MONGODB_URL is not defined in the environment variables!");
    return;
  }

  if (!cached.promise) {
    console.log("Initializing new MongoDB connection...");
    const opts = {
      bufferCommands: true,
    };
    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongooseInstance) => {
      console.log(`MongoDb is successfully connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((error) => {
      console.log("MongoDB connection error:", error);
      cached.promise = null;
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("Failed to await MongoDB connection:", error);
  }
};

export default connectDb;