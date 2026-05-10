import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import CartItems from "../models/CartItems";
import Product from "../models/Products"; // Ensure Product model is registered for populate()
import Address from "../models/Address"; // Ensure Address model is registered for populate()
import Payment from "../models/Payment"; // Ensure Payment model is registered for populate()
import User from "../models/User"; // Ensure User model is registered for populate()
import crypto from "crypto";


export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;

    // Migrate old orders with invalid status/paymentStatus before fetching
    await Order.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }, { status: "" }, { status: "null" }] },
      { $set: { status: "processing" } }
    );
    await Order.updateMany(
      { $or: [{ paymentStatus: { $exists: false } }, { paymentStatus: null }, { paymentStatus: "" }, { paymentStatus: "null" }, { paymentStatus: "pending_payment" }] },
      { $set: { paymentStatus: "processing" } }
    );

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("payment")
      .populate("shippingAddress")
      .populate({ path: "items.product", model: "Product" });

    if (!orders || orders.length === 0) {
      return response(res, 404, "No orders found for this user.");
    }
    return response(res, 200, "User Orders fetched successfully", orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return response(res, 500, `Order fetch error: ${error?.message}`);
  }
};

/**
 * Fetch orders where the current user is the SELLER.
 */
export const getOrdersBySeller = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;

    // Find all products owned by this user
    const sellerProducts = await Product.find({ seller: userId }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    // Find orders containing any of these products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
      .sort({ createdAt: -1 })
      .populate("user", "name email profilePicture")
      .populate("shippingAddress")
      .populate({ path: "items.product", model: "Product" });

    return response(res, 200, "Seller Orders fetched successfully", orders);
  } catch (error: any) {
    console.error("Error fetching seller orders:", error);
    return response(res, 500, `Seller Order fetch error: ${error?.message}`);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate("payment")
      .populate({ path: "items.product", model: "Product" });

    if (!order) {
      return response(res, 404, "Order not found");
    }
    return response(res, 200, "Order fetched by Id successfully", order);
  } catch (error: any) {
    console.error("Error fetching Order:", error);
    return response(res, 500, `Order getById error: ${error?.message}`);
  }
};


export const createOrUpdateOrder = async(req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { orderId, shippingAddress, paymentMethod, totalAmount, paymentDetails } = req.body;

    const cart = await CartItems.findOne({ user: userId }).populate('items.product');

    if(!cart || cart.items.length === 0){
      return response(res, 400, "Cart is empty.");
    }

    let order: any;
    if (orderId) {
      order = await Order.findById(orderId);
      
      // Ownership check: Prevent updating orders belonging to other users
      if (order && order.user.toString() !== userId) {
        return response(res, 403, "Access denied. Order belongs to another user.");
      }
      
      // State check: If order is already completed, it shouldn't be updated during a new checkout flow
      if (order && (order.paymentStatus === "complete" || order.status === "delivered")) {
         // If they were trying to update an already completed order, we should probably ignore the orderId
         // and let the 'else' block create a NEW one, but returning 400 is safer to avoid confusion.
         return response(res, 400, "Cannot update a completed order.");
      }
    }

    if(order){
      // Always sanitize fields that may have invalid values from old data
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.totalAmount = totalAmount || order.totalAmount;
      if(paymentDetails){
        order.paymentDetails = paymentDetails;
        order.paymentStatus = "complete";
      }
    } else {
      const orderItems = cart.items.map((item: any) => {
        let prodId = item?.product;
        if (item?.product && typeof item.product === 'object' && item.product._id) {
            prodId = item.product._id;
        }
        return {
          product: prodId,
          quantity: item?.quantity || 1,
        };
      });

      // Use cart total as fallback if totalAmount not sent from frontend
      const cartTotal = cart.items.reduce((sum: number, item: any) => {
        const price = item.product?.price || item.product?.sellingPrice || 0;
        return sum + (price * item.quantity);
      }, 0);

      order = new Order({
        user: userId,
        items: orderItems,
        totalAmount: totalAmount || cartTotal,
        shippingAddress: shippingAddress || undefined,
        paymentMethod: paymentMethod || "sslcommerz",
        paymentDetails: paymentDetails || undefined,
        paymentStatus: paymentDetails ? 'complete' : 'processing',
        status: 'processing'
      });
    }

    // FINAL HARDEN: Ensure status fields are NEVER null or invalid strings before saving
    const validStatuses = ['pending', 'processing', 'ready_for_handover', 'shipped', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'processing', 'complete', 'delivered', 'failed'];

    const s = order.status ? String(order.status).toLowerCase() : "";
    const ps = order.paymentStatus ? String(order.paymentStatus).toLowerCase() : "";

    if (!order.status || s === 'null' || s === "" || !validStatuses.includes(order.status)) {
      order.status = 'processing';
    }
    if (!order.paymentStatus || ps === 'null' || ps === "" || ps === 'pending_payment' || !validPaymentStatuses.includes(order.paymentStatus)) {
      order.paymentStatus = 'processing';
    }

    await order.save();

    if (order.paymentStatus === 'complete') {
      await CartItems.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    }

    return response(res, 200, "Order created or updated successfully", order);

  } catch (error: any) {
    console.error("Order creation error:", error?.name, error?.message);
    // Use a safer error detail extraction to avoid JSON circular ref crashes
    const errorDetails = error?.errors ? Object.keys(error.errors).map(key => ({
      field: key,
      message: error.errors[key].message
    })) : null;

    return response(res, 500, `ORDER ERROR [${error?.name}]: ${error?.message}`, {
      name: error?.name,
      validationErrors: errorDetails,
    });
  }
}

// --- Handover Feature Functions ---

/**
 * Seller marks an order as ready for campus handover.
 * This generates a unique handoverCode.
 */
export const markOrderAsReady = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return response(res, 404, "Order not found");

    // Check if the current user is the seller of the product(s) in the order
    // (Assuming simple 1-product-per-order or same seller for all items for now)
    const product = order.items[0]?.product as any;
    if (product?.seller?.toString() !== userId) {
      return response(res, 403, "Only the seller can mark this order as ready.");
    }

    if (order.status === 'delivered') {
       return response(res, 400, "Order is already delivered.");
    }

    // Generate a unique 6-character code
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    order.status = 'ready_for_handover';
    order.handoverCode = code;
    await order.save();

    return response(res, 200, "Order is now ready for handover. Tell the buyer to meet you!", {
      status: order.status,
      handoverCode: order.handoverCode
    });
  } catch (error: any) {
    return response(res, 500, `Handover ready error: ${error.message}`);
  }
};

/**
 * Seller verifies the handover by scanning the Buyer's QR code (which contains the handoverCode).
 */
export const verifyHandoverCode = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { orderId, scannedCode } = req.body;

    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return response(res, 404, "Order not found");

    // Verification
    const product = order.items[0]?.product as any;
    if (product?.seller?.toString() !== userId) {
      return response(res, 403, "Unauthorized: You are not the seller of this book.");
    }

    if (order.handoverCode !== scannedCode) {
      return response(res, 400, "Invalid Handover Code. Please scan the buyer's QR code again.");
    }

    // Update status to delivered
    order.status = 'delivered';
    order.paymentStatus = 'complete'; // Handover implies payment is settled or released
    await order.save();

    return response(res, 200, "Handover Verified Successfully! The book is now marked as delivered.", {
      status: order.status
    });
  } catch (error: any) {
    return response(res, 500, `Handover verification error: ${error.message}`);
  }
};
