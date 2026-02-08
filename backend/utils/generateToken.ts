import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

//we send user to take out userid and set it to the token, it happened when any user add api or any post, if there is id then user id is logged in will show.
export const generateToken = (user: IUser) : string=>{
    return jwt.sign({userId: user?._id}, process.env.JWT_SECRET as string, {expiresIn:'1d'}); 
    //can use also email or name instead of id like {email: user?.email}
}


//generatetoken is used for mainly store user id in the token and save it our cookies
