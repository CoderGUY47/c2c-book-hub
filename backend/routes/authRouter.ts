import { NextFunction, Request, Response, Router } from "express";
import * as authController from "../controllers/authController";
import { authenticatedUser } from "../middleWare/authMiddleware";
import passport from "passport";
import { IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";

const router = Router();

//for registration
router.post("/register", authController.register);
// without this "/register" method, the server show 404 not found error, and it will not register the user mail and password and show validation message


//for login
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/login", authController.login);


//for forgot password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword); //without token , could not reset passwrod


//for logout
router.get("/logout", authController.logout);


//verify authentication
router.get("/verify-auth", authenticatedUser, authController.checkUserAuth); //if user is authenticated then only user can access this route, otherwise not allowed


router.get("/google", passport.authenticate('google',{
    scope: ['profile', 'email']
}))


//google callback
router.get('/google/callback',passport.authenticate ('google', {failureRedirect: `${process.env.FRONTEND_URL}`,
    session: false,
}),
async(req:Request, res: Response, next: NextFunction) : Promise<void> =>{ //cookies will be created here and stored in browser
    try{
        const user = req.user as IUser;
        const accessToken = await generateToken(user)
        res.cookie('access_token', accessToken, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.redirect(`${process.env.FRONTEND_URL}`); // Redirect to frontend after successful login
    }
    catch(error){
        next(error);
    }
})

export default router;