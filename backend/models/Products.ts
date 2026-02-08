import mongoose, { Schema, Document } from "mongoose";



export interface IProduct extends Document{
    title: string;
    subtitle: string;
    images: string[];
    category: string;
    condition: string;
    classType: string;
    price: number;
    author?: string;
    aboutAuthor?: string;
    description?: string;
    genre: string;
    year: string;
    pageCount: number;
    releaseDate: string;
    finalPrice: number;
    shippingCharge: string;
    seller: mongoose.Types.ObjectId; // Reference to User model
    paymentMode: "Bank Account" | "SSLCommerz";
    paymentDetails:{
        sessionId?: string;
        bankDetails?: {
            accountNumber: string;
            bicCode: string;
            bankName: string;
        };
        SslcommerzDetails?: {};
    }
}




const productShema = new Schema<IProduct>({
    title: {type:String, required:true},
    subtitle: {type:String},
    category: {type:String, required:true},
    condition: {type:String, required:true},
    classType: {type:String, required:true},
    images: [{type:String}],
    price: {type:Number, required:true},
    author: {type:String, required:true},
    aboutAuthor: {type:String},
    description: {type:String},
    genre: {type:String},
    year: {type:String},
    pageCount: {type:Number},
    releaseDate: {type:String},
    finalPrice: {type:Number, required:true},
    shippingCharge: {type:String},
    paymentMode: {type:String, enum: ['Bank Account', 'SSLCommerz'], required:true},
    paymentDetails:{
        sessionId: {type: String},
        bankDetails: {
            accountNumber: {type:String},
            bicCode: {type:String},
            bankName: {type:String},
        },
        SslcommerzDetails: {type: Object}
    },
    seller: {type:Schema.Types.ObjectId, ref:"User", required:true}
    },
    {timestamps:true}
);

export default mongoose.model<IProduct>("Product", productShema);