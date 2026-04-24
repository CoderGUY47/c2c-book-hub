import mongoose, { Schema, Document } from "mongoose";


export interface IWishList extends Document{
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[]; // used to store array of product ids
}


const wishListSchema = new Schema<IWishList>({
    user: {type:Schema.Types.ObjectId, ref:'User', required:true}, //used for user id
    products: [{type:Schema.Types.ObjectId, ref:'Product',}] //used to store array of product ids
},{timestamps:true});


export default mongoose.model<IWishList>("WishList", wishListSchema);