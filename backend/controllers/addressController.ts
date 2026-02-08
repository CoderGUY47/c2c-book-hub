import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpdateAddressByUserId = async(req: Request, res: Response)=>{
    try{
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req
        const { addressLine1, addressLine2, phoneNumber, city, state, postalCode, addressId } = req.body; // get address from body
        
        if(!userId){
            return response(res, 400, "User is Unauthorized, please enter the valid user id.");
        }
        
        if(addressId){
            const existingAddress = await Address.findById(addressId);
            if(!existingAddress){
                return response(res, 404, "Address not found.");
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.phoneNumber = phoneNumber;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.postalCode = postalCode;
            await existingAddress.save();
            return response(res, 200, "Address updated successfully.", existingAddress);
        }
        else{
            if(!addressLine1 || !phoneNumber || !city || !state || !postalCode){
                return response(res, 400, "Please fill all the required fields to create a new address.");
            }
            const newAddress = new Address({ 
                user: userId,
                addressLine1,
                addressLine2,
                state,        
                city,phoneNumber,
                postalCode 
            });

            await newAddress.save(); //save method for save the new address

            await User.findByIdAndUpdate(
                userId,
                {$push: {addresses: newAddress._id}}, //push the new address id to user's addresses array and _id is used because it's come from the table
                {new:true}
            )
            return response(res, 200, "New address created successfully.", newAddress);
        }
    }
    catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again later.");
    }
}


export const getAddressByUserId = async(req: Request, res: Response)=>{
    try {
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req

        if(!userId){
            return response(res, 400, "User is Unauthorized, please enter the valid user id.");
        }
        const address = await User.findById(userId).populate("addresses"); //populate the addresses array with the address details

        if(!address){
            return response(res, 404, "No addresses found for the user.");
        }

        return response(res, 200, "User address get successfully.", address);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again later.");
    }
}









/*
import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpdateAddressByUserId = async(req: Request, res: Response)=>{
    try{
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req
        const { addressLine1, addressLine2, phoneNumber, city, state, postalCode, addressId } = req.body; // get address from body
        
        if(!userId){
            return response(res, 400, "User is Unauthorized, please enter the valid user id.");
        }
        if(!addressLine1 || !phoneNumber || !city || !state || !postalCode){
            return response(res, 400, "Please fill all the required fields to create a new address.");
        }
        
        if(addressId){
            const existingAddress = await Address.findById(addressId);
            if(!existingAddress){
                return response(res, 404, "Address not found.");
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.phoneNumber = phoneNumber;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.postalCode = postalCode;
            await existingAddress.save();
            return response(res, 200, "Address updated successfully.", existingAddress);
        }
        else{
            const newAddress = new Address({ 
                user: userId,
                addressLine1,
                addressLine2,
                state,        
                city,phoneNumber,
                postalCode 
            });

            await newAddress.save(); //save method for save the new address

            await User.findByIdAndUpdate(
                userId,
                {$push: {addresses: newAddress._id}}, //push the new address id to user's addresses array and _id is used because it's come from the table
                {new:true}
            )
            return response(res, 200, "New address created successfully.", newAddress);
        }
    }
    catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again later.");
    }
}


export const getAddressByUserId = async(req: Request, res: Response)=>{
    try {
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req

        if(!userId){
            return response(res, 400, "User is Unauthorized, please enter the valid user id.");
        }
        const address = await User.findById(userId).populate("addresses"); //populate the addresses array with the address details

        if(!address){
            return response(res, 404, "No addresses found for the user.");
        }

        return response(res, 200, "User address get successfully.", address);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again later.");
    }
}
*/