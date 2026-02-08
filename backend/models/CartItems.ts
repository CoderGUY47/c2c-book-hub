import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document{
    product: mongoose.Types.ObjectId; // Reference to Product model
    quantity: number;
}


export interface ICart extends Document{
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
}


const cartItemSchema = new Schema<ICartItem>({
    product: {type:Schema.Types.ObjectId, ref:'Product', required:true},
    quantity: {type:Number, required:true, min:1} //

})


const cartSchema = new Schema<ICart>({
    user: {type:Schema.Types.ObjectId, ref:'User', required:true}, //each user can have only one cart
    items: [cartItemSchema] //array of cart items
},{timestamps:true});


export default mongoose.model<ICart>("Cart", cartSchema);