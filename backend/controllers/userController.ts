import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";
import { uploadToCloudinary } from "../config/cloudinaryConfig";

export const updateUserProfile = async(req: Request, res: Response)=>{
    try{
        const {userId} = req.params; // Assuming authenticatedUser middleware adds user to req
        if(!userId){
            return response(res, 400, "User is required, please enter the valid user id.");
        }
        const {name, email, phoneNumber}= req.body;
        
        const updateData: any = {};
        if (name && name.trim() !== "") updateData.name = name;
        if (email && email.trim() !== "") updateData.email = email;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        
        const images = req.files as Express.Multer.File[];
        if (images && images.length > 0) {
            const uploadImage = await uploadToCloudinary(images[0] as any);
            updateData.profilePicture = uploadImage.secure_url;
        }

        const updateUser = await User.findByIdAndUpdate(userId, 
            updateData,
            {new:true, runValidators:true},
        ).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');

        if(!updateUser){
            return response(res, 404, "User not found.");
        }

        return response(res, 200, "User profile update successfully.", updateUser);
    } 
    catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again later.");
    }
}