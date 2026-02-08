import { Router } from "express";
import { authenticatedUser } from "../middleWare/authMiddleware";
import {
  initSslPayment,
  sslSuccess,
  sslFail,
  sslCancel,
  sslIpn,
  getTransactionStatusByTranId,
  getTransactionStatusBySessionId,
  initiateRefund,
  getRefundStatus,
} from "../controllers/sslcommerzController";


const router = Router();

// SSLCommerz Routes
router.post("/ssl/payment", authenticatedUser, initSslPayment);
router.post("/ssl/success", sslSuccess);
router.get("/ssl/success", sslSuccess); // Handle browser redirect
router.post("/ssl/fail", sslFail);
router.get("/ssl/fail", sslFail); // Handle browser redirect
router.post("/ssl/cancel", sslCancel);
router.get("/ssl/cancel", sslCancel); // Handle browser redirect
router.post("/ssl/ipn", sslIpn);

// SSLCommerz Query and Refund Routes (should be protected)
router.get("/ssl/status/by-tran-id/:tran_id", authenticatedUser, getTransactionStatusByTranId);
router.get("/ssl/status/by-session-id/:sessionkey",authenticatedUser, getTransactionStatusBySessionId);
router.post("/ssl/refund", authenticatedUser, initiateRefund);
router.get("/ssl/refund/status/:refund_ref_id", authenticatedUser, getRefundStatus);



export default router;
