import mongoose, { Document, Schema } from "mongoose";



interface ISslCommerzPaymentDetails {
  provider: "sslcommerz";
  tran_id?: string;
  sessionkey?: string;
  bank_tran_id?: string;
  card_type?: string;
  amount?: string;
  createResponse?: Record<string, any>;
  validation?: Record<string, any>;
  ipnPayload?: Record<string, any>;
  failPayload?: Record<string, any>;
  cancelPayload?: Record<string, any>;
  refund_ref_id?: string;
}

type TProviderDetails = ISslCommerzPaymentDetails | Record<string, any>;

// --- Main Payment Interface ---

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "successful" | "failed" | "refunded" | "cancelled";
  provider: string; // e.g., 'sslcommerz', 'bkash', 'cod'
  providerDetails: TProviderDetails;
}

// --- Mongoose Schema ---

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "BDT" },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded", "cancelled"],
      default: "pending",
      required: true,
    },
    provider: { type: String, required: true },
    providerDetails: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
