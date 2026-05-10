import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";

export const updateUserProfile = async(req: Request, res: Response)=>{
    try{
        const {userId} = req.params;
        if(!userId){
            return response(res, 400, "User is required, please enter the valid user id.");
        }
        const {name, email, phoneNumber, profilePicture} = req.body;
        
        const updateData: any = {};
        if (name && name.trim() !== "") updateData.name = name;
        if (email && email.trim() !== "") updateData.email = email;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        // Accept profilePicture as a plain URL string (uploaded to ImgBB on the frontend)
        if (profilePicture && profilePicture.trim() !== "") updateData.profilePicture = profilePicture;

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

export const saveInstitutionInfo = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).id;
        if (!userId) return response(res, 401, "Unauthenticated.");

        const { institution, institutionType, department, institutionRole, studentId } = req.body;

        if (!institution || !institutionType || !institutionRole) {
            return response(res, 400, "Institution name, type, and your role are required.");
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                institution,
                institutionType,
                department: department || null,
                institutionRole,
                studentId: studentId || null,
                hasCompletedProfile: true,
                isVerified: true,
            },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');

        if (!user) return response(res, 404, "User not found.");

        return response(res, 200, "Institution info saved. Welcome to OxPecker BookHub! \uD83C\uDF89", user);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again later.");
    }
}