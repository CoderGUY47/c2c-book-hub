import { Request, Response } from "express";
import sslcommerzService from "../services/sslcommerzService";
import Order from "../models/Order";
import CartItems from "../models/CartItems";
import { response } from "../utils/responseHandler";
import mongoose from "mongoose";
import Payment from "../models/Payment";

function getCallbackUrls(orderId: string) {
  const success = String(process.env.SSLCOMMERZ_SUCCESS_URL || "");
  const fail = String(process.env.SSLCOMMERZ_FAIL_URL || "");
  const cancel = String(process.env.SSLCOMMERZ_CANCEL_URL || "");
  const ipn = String(process.env.SSLCOMMERZ_IPN_URL || "");
  if (!success || !fail || !cancel) {
    throw new Error("SSLCOMMERZ callback URLs must be set in .env");
  }
  const attach = (base: string) => `${base}?orderId=${encodeURIComponent(orderId)}`;
  return {
    success_url: attach(success),
    fail_url: attach(fail),
    cancel_url: attach(cancel),
    ipn_url: ipn ? attach(ipn) : undefined,
  };
}

export const initSslPayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = (req as any).id;
    console.log("initSslPayment body:", req.body);
    const { shippingAddress, totalAmount, customer, orderId } = req.body;

    let order;

    if (orderId) {
      order = await Order.findById(orderId).session(session);
      if (!order) {
        throw new Error("Order not found.");
      }
      // If order exists, ensure we respect its totalAmount/Items
    } else {
      const cart = await CartItems.findOne({ user: userId }).session(session);
      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty.");
      }

      order = new Order({
        user: userId,
        items: cart.items,
        totalAmount,
        shippingAddress,
        paymentMethod: "sslcommerz",
        paymentStatus: "pending_payment",
        status: "null", // Ensure status is explicitly set to "null" by default
      });
      // Save the new order immediately so we have an ID
      await order.save({ session }); 
    }

    const tran_id = order._id.toString();
    const callbacks = getCallbackUrls(order._id.toString());

    // Use order's totalAmount if available (safer)
    const amountToPay = order.totalAmount || totalAmount;

    const sslSession = await sslcommerzService.createSession({
      total_amount: Number(amountToPay).toFixed(2),
      currency: "BDT",
      tran_id,
      ...callbacks,
      product_category: "eCommerce",
      product_name: `Order #${order._id.toString()}`,
      cus_name: customer?.name || "Customer",
      cus_email: customer?.email || "customer@example.com",
      cus_phone: customer?.phone || "00000000000",
      cus_add1: customer?.address || "N/A",
    });

    const payment = new Payment({
      user: userId,
      order: order._id,
      amount: amountToPay,
      provider: "sslcommerz",
      providerDetails: {
        tran_id,
        sessionkey: sslSession.sessionkey,
        createResponse: sslSession,
      },
    });

    order.payment = payment._id;

    await order.save({ session });
    await payment.save({ session });

    await session.commitTransaction();

    return response(res, 200, "SSLCOMMERZ payment initialized", {
      orderId: order._id,
      redirectURL: sslSession.GatewayPageURL,
    });
  } catch (error: any) {
    await session.abortTransaction();
    console.error("initSslPayment error:", error);
    return response(res, 500, `Failed to initialize payment: ${error.message}`, { error: error.message });
  } finally {
    session.endSession();
  }








};

async function handleSuccessfulPayment(orderId: string, validation: any) {
  const order = await Order.findById(orderId);
  if (!order || order.paymentStatus === "complete") return;

  order.paymentStatus = "complete";

  const payment = await Payment.findOne({ order: orderId });
  if (payment) {
    payment.status = "successful";
    payment.providerDetails = {
      ...(payment.providerDetails as any),
      validation,
      bank_tran_id: validation.bank_tran_id,
      card_type: validation.card_type,
    };
    await payment.save();
  }

  await order.save();

  await CartItems.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
}

export const sslSuccess = async (req: Request, res: Response) => {
  try {
    console.log("sslSuccess hit. Method:", req.method);
    console.log("Query:", req.query);
    console.log("Body:", req.body);
    const { orderId, val_id } = { ...req.body, ...req.query } as any;
    if (!orderId || !val_id) {
      return response(res, 400, "Missing orderId or val_id.");
    }

    const validation = await sslcommerzService.validateByValId(String(val_id));
    if (validation.status !== "VALID" && validation.status !== "VALIDATED") {
      return response(res, 400, "Payment validation failed", validation);
    }
    await handleSuccessfulPayment(orderId, validation);
    res.redirect(`${process.env.FRONTEND_URL}/checkout/payment-success?orderId=${orderId}`);
  } catch (error: any) {
    console.error("sslSuccess error:", error?.message || error);
    res.redirect(`${process.env.FRONTEND_URL}/checkout/payment-fail?error=${encodeURIComponent(error.message)}`);
  }

};

async function handleFailedPayment(orderId: string, payload: any, status: "failed" | "cancelled") {
  const order = await Order.findById(orderId);
  if (!order || order.paymentStatus === "complete") return;

  order.paymentStatus = "failed";

  const payment = await Payment.findOne({ order: orderId });
  if (payment) {
    payment.status = status;
    payment.providerDetails = {
      ...(payment.providerDetails as any),
      [`${status}Payload`]: payload,
    };
    await payment.save();
  }

  await order.save();
}

export const sslFail = async (req: Request, res: Response) => {
  const payload = { ...req.body, ...req.query };
  await handleFailedPayment(payload.orderId, payload, "failed");
  res.redirect(`${process.env.FRONTEND_URL}/checkout/payment-fail?orderId=${payload.orderId}`);
};

export const sslCancel = async (req: Request, res: Response) => {
  const payload = { ...req.body, ...req.query };
  await handleFailedPayment(payload.orderId, payload, "cancelled");
  res.redirect(`${process.env.FRONTEND_URL}/checkout/payment-cancel?orderId=${payload.orderId}`);
};

export const sslIpn = async (req: Request, res: Response) => {
  try {
    const { val_id, tran_id } = req.body as any;
    if (!val_id || !tran_id) {
      return response(res, 400, "IPN missing val_id or tran_id.");
    }

    const validation = await sslcommerzService.validateByValId(String(val_id));
    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      await handleSuccessfulPayment(tran_id, validation); // tran_id is orderId
    }

    return response(res, 200, "IPN processed.");
  } catch (error: any) {
    console.error("sslIpn error:", error?.message || error);
    return response(res, 500, "Failed to process IPN.", { error: error.message });
  }
};

export const getTransactionStatusByTranId = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.params;
    const apiResult = await sslcommerzService.queryByTransactionId(tran_id);

    if (apiResult.no_of_trans_found === 0) {
      return response(res, 404, "Transaction not found via SSLCommerz API.", apiResult);
    }

    const localOrder = await Order.findById(tran_id);

    return response(res, 200, "Transaction status fetched.", {
      gatewayStatus: apiResult.element[0],
      localStatus: localOrder,
    });
  } catch (error: any) {
    return response(res, 500, "Failed to get transaction status.", { error: error.message });
  }
};

export const getTransactionStatusBySessionId = async (req: Request, res: Response) => {
  try {
    const { sessionkey } = req.params;
    const apiResult = await sslcommerzService.queryBySessionId(sessionkey);

    if (apiResult.no_of_trans_found === 0) {
      return response(res, 404, "Transaction not found via SSLCommerz API.", apiResult);
    }

    return response(res, 200, "Transaction status fetched.", { gatewayStatus: apiResult.element[0], sessionId: sessionkey });
  } catch (error: any) {
    return response(res, 500, "Failed to get transaction status.", { error: error.message });
  }
};

export const initiateRefund = async (req: Request, res: Response) => {
  try {
    const { bank_tran_id, refund_amount, refund_remarks } = req.body;
    if (!bank_tran_id || !refund_amount || !refund_remarks) {
      return response(res, 400, "bank_tran_id, refund_amount, and refund_remarks are required.");
    }

    const result = await sslcommerzService.initiateRefund({ bank_tran_id, refund_amount, refund_remarks });

    const payment = await Payment.findOne({ "providerDetails.bank_tran_id": bank_tran_id });
    if (payment) {
      payment.status = "refunded";
      payment.providerDetails = {
        ...(payment.providerDetails as any),
        refund_ref_id: result.refund_ref_id,
        refundResponse: result
      };
      await payment.save();

      const order = await Order.findById(payment.order);
      if(order) {
        order.paymentStatus = "failed"; // Or some other status like 'refunded'
        await order.save();
      }
    }

    return response(res, 200, "Refund initiated successfully.", result);
  } catch (error: any) {
    return response(res, 500, "Failed to initiate refund.", { error: error.message });
  }
};

export const getRefundStatus = async (req: Request, res: Response) => {
  try {
    const { refund_ref_id } = req.params;
    const result = await sslcommerzService.queryRefundStatus(refund_ref_id);
    return response(res, 200, "Refund status fetched successfully.", result);
  } catch (error: any) {
    return response(res, 500, "Failed to get refund status.", { error: error.message });
  }
};
