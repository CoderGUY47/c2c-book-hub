import passport from 'passport';
import {Strategy as GoogleStrategy, Profile} from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { Request } from 'express';
import User, { IUser } from '../../models/User';


dotenv.config(); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
    passReqToCallback: true,
}, 
async (
    req:Request, 
    accessToken, 
    refreshToken, 
    profile,
    done:(error:any,user?:IUser | false) => void)=>{
        const {emails, displayName, photos} = profile;
        console.log('[GOOGLE STRATEGY] Profile received:', {
            displayName,
            email: emails?.[0]?.value,
            hasPhotos: !!photos,
            photosCount: photos?.length,
            photoUrl: photos?.[0]?.value,
            fullProfile: JSON.stringify(profile)
        });
        try{
            // Here, you would typically search for the user in your database and create a new user if they don't exist. For demonstration, we'll just return a mock user object.
            let user = await User.findOne({email: emails?.[0]?.value}); //find user by email
            if(user) //if user not found, create new user
            {
                if(photos?.[0]?.value){
                    console.log('[GOOGLE STRATEGY] Updating existing user with profile picture:', photos[0].value);
                    user.profilePicture = photos[0].value;
                    await user.save();
                }
                console.log('[GOOGLE STRATEGY] Existing user returned:', {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture
                });
                return done(null, user); //user found, return user
            }

            console.log('[GOOGLE STRATEGY] Creating new user with profile picture:', photos?.[0]?.value);
            user = await User.create({
                googleId: profile.id,
                name: displayName,
                email: emails?.[0]?.value,
                profilePicture: photos?.[0]?.value, 
                isVerified: emails?.[0]?.verified || false,
                agreeTerms: true,
            })
            console.log('[GOOGLE STRATEGY] New user created:', {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            });
            return done(null, user); //new user created, return user

        }
        catch(error){
            done(error); //error occurred, return error
        }
}))


export default passport;