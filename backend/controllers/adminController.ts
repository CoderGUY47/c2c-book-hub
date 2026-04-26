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
