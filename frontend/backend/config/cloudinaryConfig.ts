import multer from "multer";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import { RequestHandler } from "express";
 
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

interface CustomFile extends Express.Multer.File {
    buffer: Buffer;
}

const uploadToCloudinary = (file: CustomFile): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result as UploadApiResponse);
            }
        );
        uploadStream.end(file.buffer);
    });
}

// Memory storage is a MUST for Vercel
const multerMiddleware: RequestHandler = multer({ storage: multer.memoryStorage() }).array('images', 4);

export { uploadToCloudinary, multerMiddleware };