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
