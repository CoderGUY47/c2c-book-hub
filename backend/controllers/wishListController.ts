import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItems, { ICartItem } from "../models/CartItems";
import WishList from "../models/WishList";


export const addToWishlist = async(req: Request, res: Response)=>{
    try{
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req
        const {productId, quantity} = req.body; //get productId and quantity from body
        const product = await Products.findById(productId); //find product by id
        if(!product){
            return response(res,404,'Product not found in the cart');
        }

        let wishList = await WishList.findOne({user: userId}); //find cart of the user
        if(!wishList){ //if cart not exist, create new cart
            wishList = new WishList({ //create new cart
                user: userId,
                products: []
            });
        }
        if(!wishList.products.includes(productId)){
            wishList.products.push(productId); //type assertion and it helps to avoid ts error
            await wishList.save();
        }

        return response(res,200,'Item added to wishlist successfully', wishList);
    }
    catch(error){
        console.log(error);
        return response(res,500,'Internal server error, Keep trying...!');
    }
}




//remove item from cart
export const removeFromWishlist = async(req: Request, res: Response)=>{
    try{
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req
        const {productId} = req.params; //get productId and quantity from body

        let wishList = await WishList.findOne({user: userId}); //find cart of the user
        if(!wishList){ //if cart not exist, create new cart
            return response(res,404,'Wishlist not found for this user');
        }
        wishList.products = wishList.products.filter((id) => id.toString() !== productId); //remove product from wishlist
        await wishList.save();

        return response(res,200,'Item removed from wishlist successfully');
    }
    catch(error){
        console.log(error);
        return response(res,500,'Internal server error, Keep trying...!');
    }
}




//get cart of the user
export const getWishlistByUser = async(req: Request, res: Response)=>{
    try{
        const userId = req.id; 

        let wishList = await WishList.findOne({user: userId}).populate('products'); //find cart of the user and populate product details, populate means fetch the details of the product from product collection
        if(!wishList){ //if cart not exist, create new cart
            return response(res,404,'Wishlist is empty.',{Products:[]}); //if cart not found, return empty array
        }

        await wishList.save();
        return response(res,200,'User wishlist get successfully', wishList);
    }
    catch(error){
        console.log(error);
        return response(res,500,'Internal server error, Keep trying...!');
    }
}