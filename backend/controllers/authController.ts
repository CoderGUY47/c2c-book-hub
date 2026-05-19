import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import {
  sendResetPasswordLinkToEmail,
  sendVerificationToEmail,
  sendOtpToEmail,
} from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";
import { isAllowedEmail } from "../utils/authUtils";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, agreeTerms, role } = req.body;

    /* 
    // UNRESTRICTED REGISTRATION LOGIC (Old)
    const existingUser = await User.findOne({ email });
    */

    // RESTRICTED REGISTRATION LOGIC (Academic & Professional only) - Admin accounts are bypassed
    if (role !== "admin") {
      if (!email || !isAllowedEmail(email)) {
        return response(res, 400, "Only academic or professional emails are allowed.");
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If account was created via Google OAuth, tell user to use Google login
      if (existingUser.googleId) {
        return response(res, 400, "GOOGLE_ACCOUNT_EXISTS");
      }
      return response(res, 400, "User already exists");
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const user = new User({
      name,
      email,
      password,
      agreeTerms,
      verificationToken,
      role: role || "user",
    });
    await user.save();
    await sendVerificationToEmail(user.email, verificationToken);
    return response(
      res,
      200,
      "User registered successfully, Kindly check your email for verification",
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Keep trying...!");
  }
};

//for verify email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return response(res, 400, "The verification token is invalid or expired");
    }
    user.isVerified = true;
    user.verificationToken = undefined;

    const accessToken = generateToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true, //no one can use our own cookies, keep it private protected
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    await user.save();
    return response(res, 200, "Email verified successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Keep trying...!");
  }
};

//for verify login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; //not from params

    /* 
    // UNRESTRICTED LOGIN LOGIC (Old)
    const user = await User.findOne({ email }).select("+password");
    */

    const user = await User.findOne({ email }).select("+password");

    // RESTRICTED LOGIN LOGIC (Academic & Professional only) - Bypass for existing admin users
    if (!user || user.role !== "admin") {
      if (!email || !isAllowedEmail(email)) {
        return response(res, 400, "Only academic or professional emails are allowed.");
      }
    }

    if (!user) {
      return response(res, 400, "The Email or Password is invalid or expired");
    }

    // Check if the user signed up via Google OAuth (no password set)
    if (!user.password) {
      if (user.googleId) {
        return response(res, 400, "GOOGLE_ACCOUNT_EXISTS");
      }
      return response(
        res,
        400,
        "You have previously signed up with another provider. Please use the social login you originally signed up with.",
      );
    }

    if (!(await user.comparePassword(password))) {
      return response(res, 400, "The Email or Password is invalid or expired");
    }

    if (!user.isVerified) {
      return response(
        res,
        400,
        "Please verify your email before logging in and Check your email inbox or spam.",
      );
    }

    const accessToken = generateToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true, //no one can use our own cookies, keep it private protected
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    return response(
      res,
      200,
      "User logged in successfully",
      userWithoutPassword,
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Keep trying...!");
  }
};

//for forget password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return response(res, 404, "User not found with this email");
    }
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    await sendResetPasswordLinkToEmail(user.email, resetPasswordToken);

    return response(
      res,
      200,
      "Password reset instructions have been sent to your email if it exists.",
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Keep trying...!");
  }
};

//for reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }); //check if reset password changed within the expiry time
    if (!user) {
      return response(
        res,
        400,
        "The reset password token is invalid or expired",
      );
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return response(
      res,
      200,
      "Password has been reset successfully. Now you have to login with your new password.",
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Keep trying...!");
  }
};

//for logout
export const logout = async (_: Request, res: Response) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return response(res, 200, "User logged out successfully");
  } catch (error) {
    console.log(error);
    return response(
      res,
      500,
      "An Internal server error occurred, Keep trying...!",
    );
  }
};

//verfiy user is logged in or not, if logged in then only user can add api or post, otherwise not allowed
export const checkUserAuth = async (req: Request, res: Response) => {
  try {
    const userId = req?.id; //we can use req.id in our controllers to get user id
    if (!userId) {
      return response(
        res,
        401,
        "Unauthenticated: No user id found. Please log in again.",
      );
    }
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires -verificationToken",
    ); //exclude sensitive info
    if (!user) {
      return response(res, 403, "User not found");
    }
    return response(res, 201, "User is authenticated", user); //send user data to frontend
  } catch (error) {
    console.log(error);
    return response(
      res,
      500,
      "An Internal server error occurred, Keep trying...!",
    );
  }
};

// Send OTP to user's verified edu/govt email
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return response(res, 401, "Unauthenticated.");

    const user = await User.findById(userId);
    if (!user) return response(res, 404, "User not found.");

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpToEmail(user.email, otp, user.name);

    return response(res, 200, `OTP sent to ${user.email}. Valid for 10 minutes.`);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Failed to send OTP. Please try again.");
  }
};

// Verify OTP submitted by user
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return response(res, 401, "Unauthenticated.");

    const { otp } = req.body;
    if (!otp) return response(res, 400, "OTP is required.");

    const user = await User.findById(userId);
    if (!user) return response(res, 404, "User not found.");

    if (!user.otp || !user.otpExpires) {
      return response(res, 400, "No OTP was requested. Please request a new one.");
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

    // OTP is valid – clear it
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return response(res, 200, "OTP verified successfully! ✅ Thank you for using OxPecker BookHub.");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Failed to verify OTP. Please try again.");
  }
};
