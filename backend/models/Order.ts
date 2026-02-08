import mongoose, { Document, Schema } from "mongoose";
import { IAddress } from "./Address";

// Interface for a single item in an order
export interface IOrderItem extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

// --- Main Order Interface ---

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: mongoose.Types.ObjectId | IAddress;
  paymentStatus: "pending" | "processing" | "complete" | "delivered" | "failed";
  paymentMethod: string;
  // Payment fields are now handled by the Payment model
  payment: mongoose.Types.ObjectId; // Reference to the Payment document
  paymentDetails?: {
    ssl_order_id?: string;
    ssl_payment_id?: string;
    ssl_signature?: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "null";
}

// --- Mongoose Schemas ---//
const orderItemsSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemsSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: Schema.Types.ObjectId, ref: "Address" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    paymentMethod: { type: String },
    paymentDetails: {
      ssl_order_id: String,
      ssl_payment_id: String,
      ssl_signature: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "complete", "delivered", "failed"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "null"],
      default: "null",
    },
  },
  { timestamps: true }
);



export default mongoose.model<IOrder>("Order", OrderSchema);
