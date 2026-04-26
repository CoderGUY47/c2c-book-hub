import multer from "multer";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import { RequestHandler } from "express";
 
dotenv.config(); // Load environment variables from .env file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

interface CustomFile extends Express.Multer.File {
    path: string;
}


// Multer configuration for file upload
const uploadToCloudinary = (file: CustomFile): Promise<UploadApiResponse> => {
    const options: UploadApiOptions = {
        resource_type: "image", // or "raw" for non-image files
    };

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, options, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result as UploadApiResponse);
        });
    });
}


//use multer to store images locally, temporarily and then upload to cloudinary
const multerMiddleware: RequestHandler = multer({ dest: 'uploads/' }).array('images',4); //dest is the folder name where images are stored temporarily and 4 images can be uploaded at a time


export { uploadToCloudinary, multerMiddleware };