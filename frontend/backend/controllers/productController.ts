import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import Products from "../models/Products";
import mongoose from "mongoose";



export const createProduct = async (req: Request, res: Response) => {
    try {
        // Compact: Trim all relevant string fields using a loop
        const sanitizedBody: any = { ...req.body };
        [
            'title',
            'subtitle',
            'category',
            'condition',
            'classType',
            'author',
            'genre',
            'description',
            'paymentMode'
        ].forEach(field => {
            if (typeof sanitizedBody[field] === 'string') {
                sanitizedBody[field] = sanitizedBody[field].trim();
            }
        });
        const sellerId = req.id; // Assuming authenticatedUser middleware adds user to req

        const images = req.files as Express.Multer.File[]; // Type assertion to access files
        if (!images || images.length === 0) {
            return response(res, 400, 'No images uploaded');
        }

        let parsedPaymentsDetails;
        try {
            parsedPaymentsDetails = typeof sanitizedBody.paymentDetails === 'string'
                ? JSON.parse(sanitizedBody.paymentDetails)
                : sanitizedBody.paymentDetails;
        } catch (e) {
            return response(res, 400, 'Invalid paymentDetails JSON');
        }

        if (sanitizedBody.paymentMode === 'SSLCommerz' && (!parsedPaymentsDetails || !parsedPaymentsDetails.sessionId)) {
            return response(res, 400, 'Session ID is required for SSLCommerz payment mode');
        }

        if (sanitizedBody.paymentMode === 'Bank Account' &&
            (
                !parsedPaymentsDetails ||
                !parsedPaymentsDetails.bankDetails ||
                !parsedPaymentsDetails.bankDetails.accountNumber ||
                !parsedPaymentsDetails.bankDetails.bicCode ||
                !parsedPaymentsDetails.bankDetails.bankName)) {
            return response(res, 400, 'Complete bank details are required for Bank Account payment.');
        }

        const uploadPromise = images.map(file => uploadToCloudinary(file as any));
        const uploadImages = await Promise.all(uploadPromise);
        const imageUrls = uploadImages.map(image => image.secure_url);


        // Use the sanitized body and parsed paymentDetails for easy maintainability
        const product = new Products({
            ...sanitizedBody,
            paymentDetails: parsedPaymentsDetails,
            seller: sellerId,
            images: imageUrls
        });
        await product.save();
        return response(res, 201, 'Product created successfully', product);
    }
    catch (error:any) {
        console.error('Error creating product:', error);
        return response(res, 500, error.message || 'Internal Server Error');
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.find({})
            .sort({ createdAt: -1 })
            .populate('seller', 'name email');
        
        return response(res, 200, 'Products fetched successfully', products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return response(res, 500, 'Internal Server Error');
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let query;

        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            // Check if valid ObjectId exists at the end of the slug (Pattern: ...-objectid)
            const idMatch = id.match(/-([0-9a-fA-F]{24})$/);
            
            if (idMatch) {
               // If ID found at end, use it
               query = { _id: idMatch[1] };
            } else {
               // Fallback: search by title (replace dashes with spaces)
               const titleQuery = id.replace(/-/g, ' ');
               query = { title: { $regex: new RegExp(`^${titleQuery}$`, 'i') } };
            }
        }

        const product = await Products.findOne(query)
            .populate({
                path: 'seller',
                select: 'name email profilePicture phoneNumber addresses',
                populate: {
                    path: 'addresses',
                    model: 'Address'
                }
            });

        if (!product) {
            return response(res, 404, 'Product not found');
        }
        return response(res, 200, 'Products fetched successfully', product);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return response(res, 500, 'Internal Server Error');
    }
}


//delete product by id
export const deleteProduct= async (req: Request, res: Response) => {
    try{
        const product = await Products.findByIdAndDelete(req.params.productId) // Assuming authenticatedUser middleware adds user to req
        if(!product){
            return response(res,404,'Product not found');
        }
        return response(res, 200, 'Products deleted successfully', product);
    }
    catch(error){
        console.error('Error fetching products:', error);
        return response(res, 500, 'Internal Server Error');
    }
}



//get products by seller id
export const getProductBySellerId = async(req: Request, res:Response)=>{
    try{
        const sellerId = req.params.sellerId;  // Get sellerId from request parameters
        if(!sellerId){
            return response(res,400,'Product of this seller is not found, please try again with valid id.');
        }

        const product = await Products.find({seller: sellerId}) // Find products by sellerId
        .sort({createdAt:-1}) //newest products first
        .populate('seller', 'name email profilePicture phoneNumber addresses') //select specific fields to return
        console.log(product)
            if(!product){
                return response(res,404,'Product of this seller id is not found.');
            }

        return response(res, 200, 'Products fetched by sellerId successfully', product);
    }
    catch(error){
        console.error('Error fetching products:', error);
        return response(res, 500, 'Internal Server Error');
    }
}















































































//there are whitespace error with BIC enum values, so previous code is commented out, 
//with the help of sanitizedBody and trim() to remove any whitespace occurs in internal or external files
//the old code is down below for reference where the mistakes are made, but i could not find it out till now, 
//so that's why use those trim() method to remove whitespace from both ends of a string and parse paymentDetails JSON safely































/*
import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import Products from "../models/Products";



export const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;

        const sellerId = req.id; // Assuming authenticatedUser middleware adds user to req

        const images = req.files as Express.Multer.File[]; // Type assertion to access files
        if (!images || images.length === 0) {
            return response(res, 400, 'No images uploaded');
        }

        // Parse and validate paymentDetails
        let parsedPaymentsDetails = undefined;
        try {
            parsedPaymentsDetails = typeof sanitizedBody.paymentDetails === 'string'
                ? JSON.parse(sanitizedBody.paymentDetails)
                : sanitizedBody.paymentDetails;
        } catch (e) {
            return response(res, 400, 'Invalid paymentDetails JSON');
        }
        if (sanitizedBody.paymentMode === 'BIC' && (!parsedPaymentsDetails || !parsedPaymentsDetails.bicId)) {
            return response(res, 400, 'BIC ID is required for BIC payment mode');
        }
        if (sanitizedBody.paymentMode === 'Bank Account' &&
            (
                !parsedPaymentsDetails ||
                !parsedPaymentsDetails.bankDetails ||
                !parsedPaymentsDetails.bankDetails.accountNumber ||
                !parsedPaymentsDetails.bankDetails.bicCode ||
                !parsedPaymentsDetails.bankDetails.bankName)) {
            return response(res, 400, 'Complete bank details are required for Bank Account payment.');
        }

        const uploadPromise = images.map(file => uploadToCloudinary(file as any));
        const uploadImages = await Promise.all(uploadPromise);
        const imageUrls = uploadImages.map(image => image.secure_url);


        const product = new Products({
            title,
            description,
            subject,
            category, condition,classType,price, finalPrice, shippingCharge,
            paymentMode,
            paymentDetails: parsedPaymentsDetails,
            author,
            edition,
            seller: sellerId, // Assuming authenticatedUser middleware adds user to req
            images: imageUrls
        })
        await product.save();
        return response(res, 201, 'Product created successfully', product);
    }
    catch (error) {
        console.error('Error creating product:', error);
        return response(res, 500, 'Internal Server Error');
    }
}
*/