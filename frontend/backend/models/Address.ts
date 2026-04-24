import mongoose, { Document, Schema } from "mongoose";

//user schema make document for typescript issue
export interface IAddress extends Document {
    user: mongoose.Types.ObjectId;
    addressLine1: string;
    addressLine2?: string;
    phoneNumber: string;
    city: string;
    state: string;
    postalCode: string;
}

const addressSchema = new Schema<IAddress>({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
  addressLine1: {type: String, required: true},
  addressLine2: {type: String, default: null},
  phoneNumber: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  postalCode: {type: String, required: true},
},{timestamps:true}); 

export default mongoose.model<IAddress>("Address", addressSchema);