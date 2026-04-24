import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItems, { ICartItem } from "../models/CartItems";




export const addToCart = async(req: Request, res: Response)=>{
    try{
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req
        const {productId, quantity} = req.body; //get productId and quantity from body
        const product = await Products.findById(productId); //find product by id
        if(!product){
            return response(res,404,'Product not found in the cart');
        }
        // if(product.seller.toString()===userId){
        //     return response(res,400,'You cannot add your own product to the cart');
        // }

        let cart = await CartItems.findOne({user: userId}); //find cart of the user
        if(!cart){ //if cart not exist, create new cart
            cart = new CartItems({ //create new cart
                user: userId,
                items: []
            });
        }

        const existingItem = cart.items.find(item => item.product.toString()=== productId); //check if product already exist in cart
        if(existingItem){ //if product exist in cart, update quantity
            existingItem.quantity += quantity;
        }
        else{ //if product not exist in cart, add new item
            const newItem = {
                product: productId,
                quantity: quantity
            }
            cart.items.push(newItem as ICartItem); //type assertion
        }
        await cart.save();
        
        const populatedCart = await CartItems.findById(cart._id).populate("items.product");
        return response(res,200,'Item added to cart successfully', populatedCart);
    }
    catch(error){
        console.log(error);
        return response(res,500,'Internal server error, Keep trying...!');
    }
}




//remove item from cart
export const removeFromCart = async(req: Request, res: Response)=>{
    try{
        const userId = req.id; // Assuming authenticatedUser middleware adds user to req
        const {productId} = req.params; //get productId and quantity from body

        let cart = await CartItems.findOne({user: userId}); //find cart of the user
        if(!cart){ //if cart not exist, create new cart
            return response(res,404,'Cart not found for this user');
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId); //remove item from cart

        await cart.save();
        await cart.populate("items.product");
        return response(res,200,'Item removed from cart successfully', cart);
    }
    catch(error){
        console.log(error);
        return response(res,500,'Internal server error, Keep trying...!');
    }
}




//get cart of the user
export const getCartByUser = async(req: Request, res: Response)=>{
    try{
        const userId = req.params.userId; //get userId from params, it used by admin to get cart of any user

        let cart = await CartItems.findOne({user: userId}).populate("items.product"); //find cart of the user
        if(!cart){ //if cart not exist, create new cart
            return response(res,404,'Cart is empty.',{items:[]}); //if cart not found, return empty array
        }

        await cart.save();
        return response(res,200,'User cart get successfully', cart);
    }
    catch(error){
        console.log(error);
        return response(res,500,'Internal server error, Keep trying...!');
    }
}