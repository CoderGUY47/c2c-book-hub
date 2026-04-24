import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";



export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("payment")
      .populate("shippingAddress")
      .populate({ path: "items.product", model: "Product" });

    // console.log("Fetched Orders for User:", userId);
    // if (orders.length > 0) {
    //     console.log("Sample Order Address:", JSON.stringify(orders[0].shippingAddress, null, 2));
    // }

    // Fix existing orders with missing status directly in DB
    const migrationResult = await Order.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }, { status: "" }] },
      { $set: { status: "null" } }
    );
    
    if (migrationResult.modifiedCount > 0) {
      console.log(`Verified & Fixed: Updated ${migrationResult.modifiedCount} old orders to have 'null' status.`);
    }

    if (!orders || orders.length === 0) {
      return response(res, 404, "No orders found for this user.");
    }
    return response(res, 200, "User Orders fetched successfully", orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response(res, 500, "Internal Server Error");
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
  } catch (error) {
    console.error("Error fetching Order:", error);
    return response(res, 500, "Internal Server Error");
  }
};










import CartItems from "../models/CartItems";

export const createOrUpdateOrder = async(req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { orderId, shippingAddress, paymentMethod, totalAmount, paymentDetails } = req.body;
    
    // Using simple data if full payload isn't provided (fallback for initial order creation)
    const cart = await CartItems.findOne({ user: userId }).populate('items.product');
    
    if(!cart || cart.items.length === 0){
      return response(res, 400, "Cart is empty.");
    }

    let order;
    if (orderId) {
        order = await Order.findById(orderId);
    }

    if(order){
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.totalAmount = totalAmount || order.totalAmount;
      order.status = order.status || 'null';
      if(paymentDetails){
        order.paymentDetails = paymentDetails;
        order.paymentStatus = "complete";
      }
    }
    else{
      order = new Order({
        user: userId,
        items: cart.items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentDetails,
        paymentStatus: paymentDetails ? 'complete' : 'pending',
        status: 'null'
      });
    }
    
    
    await order.save();

    // If payment is complete, clear the cart
    if (order.paymentStatus === 'complete') {
        await CartItems.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    }

    return response(res, 200, "Order created or updated successfully", order);

  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
}
