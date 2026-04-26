import { Request, Response } from "express";
import SellerPayment from "../models/SellerPayment";
import Order from "../models/Order";
import Payment from "../models/Payment";
import { response } from "../utils/responseHandler";
import Products from "../models/Products";
import User from "../models/User";

export const getAllOrders = async(req:Request, res:Response)=>{
    try{
        const {status, paymentStatus,startDate,endDate} = req.query;
        const paidOrderRecord = await SellerPayment.find().select("order")
        const paidOrderIds = paidOrderRecord.map((record: any)=>record.order.toString());

        const query : any = {
            paymentStatus:"complete",
            _id:{$nin:paidOrderIds},
        }

        if(status){
            query.status = status;
        }
        query.paymentStatus = paymentStatus || "complete";

        if(startDate && endDate){
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }
        
        const orders = await Order.find(query)
        .populate({
            path:"items.product",
            populate:{
                path:"seller",
                select:"name email phoneNumber paymentMode paymentDetails" //paymentDetails is for payment mode
            }
        })
        .populate("user", "name email")
        .populate("shippingAddress")
        .sort({createdAt: -1});

        return response(res,200,"Orders fetched successfully", {orders})
    }
    catch(error){
        console.log("Error fetching orders", error);
        return response(res,500,"Internal server error");
    }
}

export const updateOrder = async(req:Request, res:Response)=>{
    try{
        const{id} = req.params;
        const {status, paymentStatus, notes} = req.body;
        const order = await Order.findById(id);
        if(!order){
            return response(res,404,"Order not found");
        }
        if(status){
            order.status = status;
        }
        if(paymentStatus){
            order.paymentStatus = paymentStatus;
        }
        if(notes){
            order.notes = notes;
        }
        await order.save();
        return response(res,200,"Order updated successfully", order);
    }
    catch(error){
        console.log("Error updating order", error);
        return response(res,500,"Internal server error");
    }
}

export const processSellerPayment = async(req:Request, res:Response)=>{
    try{
        const {orderId} = req.params;
        const {productId, amount, paymentMethod, notes} = req.body;
        const user = req.id;

        if(!productId || !amount || !paymentMethod){
            return response(res,400,"Missing required fields : productId, amount, paymentMethod");
        }  

        const order = await Order.findById(orderId).populate({
            path:"items.product",
            populate:{
                path:"seller",
            }
        });

        if(!order){
            return response(res,404,"Order not found");
        }

        //find the specific product in the order
        const orderItem = order.items.find((item: any) => (item.product)._id.toString() === productId);
        if(!orderItem){
            return response(res,404,"Product not found in order");
        }

        //find the seller of the product
        const sellerPayment = new SellerPayment({
            seller: (orderItem.product as any).seller._id,
            order: order._id,
            product: productId,
            amount,
            paymentMethod,
            status: "complete",
            processedBy: user,
            notes,
        });

        await sellerPayment.save();

        return response(res,200,"Seller payment processed successfully", sellerPayment);
    }
    catch(error){
        console.log("Error processing seller payment", error);
        return response(res,500,"Internal server error");
    }
}

export const getDashboardStats = async(req:Request, res:Response)=>{
    try{
        const [
          totalProducts,
          totalUsers,
          totalOrders,
          statusCounts,
          recentOrders,
          revenue,
          monthlySales,
        ] = await Promise.all([
          Products.countDocuments(),
          User.countDocuments(),
          Order.countDocuments(),
          Order.aggregate([ 
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ]),
          Order.find()
            .select("user totalAmount status createdAt")
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),
          Order.aggregate([
            { $match: { paymentStatus: "complete" }},
            { $group: { _id: null, total: { $sum: "$totalAmount"}}},
          ]),
          Order.aggregate([ 
            { $match: { paymentStatus: "complete" }},
            { $group: {
                _id: {
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" },
                },
                totalSales: {$sum: "$totalAmount" },
                orderCount: {$sum: 1 },
              }},
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
              },
            },
          ]),
        ]);

        const ordersByStatus ={
            processing:0, 
            shipped:0, 
            delivered:0, 
            cancelled:0
        }

        statusCounts.forEach((item:any)=>{
            const status = item._id as keyof typeof ordersByStatus;
            if(ordersByStatus.hasOwnProperty(status)){
                ordersByStatus[status] = item.count;
            }
        });

        return response(res,200,"Dashboard stats fetched successfully", {
            counts:{
                orders: totalOrders,
                users: totalUsers,
                products: totalProducts,
                revenue: revenue.length>0?revenue[0].total:0,
            },
            ordersByStatus, 
            recentOrders,
            monthlySales,
        });
    }
    catch(error){
        console.log("Error fetching dashboard stats", error);
        return response(res,500,"Internal server error");
    }
}

export const getSellerPayment = async(req:Request, res:Response)=>{
    try{
        const {sellerId, status, paymentStatus, paymentMethod, startDate,endDate} = req.query;
        const query : any = {}
        if(sellerId && sellerId !== 'all'){
            query.seller = sellerId;
        }
        if(status && status !== 'all'){
            query.status = status;
        }
        if(paymentMethod && paymentMethod !== 'all'){
            query.paymentMethod = paymentMethod;
        }
        if(startDate && endDate){
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }
        const payments = await SellerPayment.find(query)
        .populate("seller", "name email phoneNumber")
        .populate("order")
        .populate("product", "title genre finalPrice images paymentMode paymentDetails")
        .populate("processedBy", "name")
        .sort({createdAt: -1});
        const users = await User.find();
        return response(res,200,"Seller payments fetched successfully", {payments, users}); 
    }
    catch(error){
        console.log("Failed to fetched seller payments", error);
        return response(res,500,"Internal server error");
    }
}

export const getPaymentTransactions = async(req: Request, res: Response) => {
    try {
        const { provider, status, startDate, endDate } = req.query;
        const query: any = {};
        if (provider && provider !== 'all') {
            query.provider = provider;
        }
        if (status && status !== 'all') {
            query.status = status;
        }
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }
        const payments = await Payment.find(query)
            .populate("user", "name email")
            .populate({
                path: "order",
                populate: {
                    path: "items.product",
                    populate: {
                        path: "seller",
                        select: "name email phoneNumber"
                    },
                    select: "title images finalPrice seller paymentMode paymentDetails"
                }
            })
            .sort({ createdAt: -1 });
        return response(res, 200, "Payment transactions fetched successfully", { payments });
    } catch (error) {
        console.log("Failed to fetch payment transactions", error);
        return response(res, 500, "Internal server error");
    }
}
