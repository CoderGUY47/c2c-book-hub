import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";



declare global{     
    namespace Express{
        interface Request{
            id: string; //we can use req.id in our controllers to get user id
        }
    }
}


//check via cookies
const authenticatedUser = async(req:Request, res:Response, next:NextFunction)=>{
    const token = req.cookies.access_token;
    if(!token){
        return response(res,401,'Unauthorized login: No token provided');
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET as string) as jwt.JwtPayload; 
        //check token valid or not and payload id when token is created
        if(!decode){
            return response(res,401,'Unauthorized login. User not found or Invalid token');
        }
        req.id = decode.userId; //we can use req.id in our controllers to get user id
        next(); //if everything is fine, proceed to the next middleware or route handler
    }
    catch(error){
        return response(res,401,'Unauthorized login. Invalid token or expired');
    }
} 


export {authenticatedUser};
//this middleware is used to protect routes that require authentication, ensuring that only logged-in users can access certain resources or perform specific actions.