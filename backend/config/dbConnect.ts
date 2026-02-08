import mongoose from "mongoose";

const connectDb = async() : Promise<void>=>{
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL as string)
        console.log(`MongoDb is successfully connected: ${connection.connection.host}`);
    }
    catch(error){
        // console.error(`MongoDb connection error: ${error}`);
        console.log(error);
        process.exit(1); // Exit process with failure        
    }
}


export default connectDb;