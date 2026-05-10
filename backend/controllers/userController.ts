import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";
import { isAllowedEmail } from "../utils/authUtils";
import { sendOtpToEmail } from "../config/emailConfig";

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

export const sendInstitutionOtp = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).id;
        if (!userId) return response(res, 401, "Unauthenticated.");

        const { educationalEmail } = req.body;
        if (!educationalEmail) {
            return response(res, 400, "Educational or Professional email is required.");
        }

        if (!isAllowedEmail(educationalEmail)) {
            return response(res, 400, "Please provide a valid institutional email (.edu.bd, .ac.bd, .gov.bd, etc).");
        }

        const user = await User.findById(userId);
        if (!user) return response(res, 404, "User not found.");

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendOtpToEmail(educationalEmail, otp, user.name);

        return response(res, 200, `OTP sent to ${educationalEmail}. Valid for 10 minutes.`);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Failed to send OTP. Please try again.");
    }
};

export const saveInstitutionInfo = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).id;
        if (!userId) return response(res, 401, "Unauthenticated.");

        const { institution, institutionType, department, institutionRole, studentId, educationalEmail, otp } = req.body;

        if (!institution || !institutionType || !institutionRole || !educationalEmail || !otp) {
            return response(res, 400, "Please fill in all required fields, including educational email and OTP.");
        }

        const user = await User.findById(userId);
        if (!user) return response(res, 404, "User not found.");

        if (!user.otp || !user.otpExpires) {
            return response(res, 400, "No OTP was requested. Please request an OTP first.");
        }

        if (new Date() > user.otpExpires) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return response(res, 400, "OTP has expired. Please request a new one.");
        }

        if (user.otp !== otp) {
            return response(res, 400, "Invalid OTP. Please try again.");
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                institution,
                institutionType,
                department: department || null,
                educationalEmail,
                institutionRole,
                studentId: studentId || null,
                hasCompletedProfile: true,
                isVerified: true,
                otp: undefined,
                otpExpires: undefined
            },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');

        if (!updatedUser) return response(res, 404, "User not found.");

        return response(res, 200, "Institution info saved. Welcome to OxPecker BookHub! 🎉", updatedUser);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again later.");
    }
}