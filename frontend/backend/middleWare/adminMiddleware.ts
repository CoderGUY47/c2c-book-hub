import { Request, Response, NextFunction } from "express";


export const isAdmin = async(req:Request, res:Response, next:NextFunction)=>{
    try{
       const role = req.role;
       if(role !== "admin"){
        res.status(403).json({success:false, message:"Unauthorized access: Admin access required"});
        return;
       }
       next();
    }
    catch(error){
        res.status(500).json({success:false, message:"Internal server error"});
    }
}