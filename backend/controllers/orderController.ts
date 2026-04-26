import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import CartItems from "../models/CartItems";


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
    }

    if(order){
      // Always sanitize fields that may have invalid values from old data
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.totalAmount = totalAmount || order.totalAmount;
      // Fix any invalid status values from old data
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      const validPaymentStatuses = ['pending', 'processing', 'complete', 'delivered', 'failed'];
      if (!order.status || !validStatuses.includes(order.status)) order.status = 'processing';
      if (!order.paymentStatus || !validPaymentStatuses.includes(order.paymentStatus)) order.paymentStatus = 'processing';
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

    await order.save();

    if (order.paymentStatus === 'complete') {
      await CartItems.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    }

    return response(res, 200, "Order created or updated successfully", order);

  } catch (error: any) {
    console.error("Order creation error:", error?.name, error?.message);
    console.error("Validation errors:", JSON.stringify(error?.errors, null, 2));
    return response(res, 500, error?.message || "Order creation failed", {
      name: error?.name,
      validationErrors: error?.errors,
    });
  }
}
