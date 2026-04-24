import { SslCommerzPayment } from "../utils/SslCommerzPayment";

export type CreateSessionRequest = {
  total_amount: string;
  currency?: "BDT";
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url?: string;

  // Customer/product fields
  product_category?: string;
  product_name?: string;
  cus_name?: string;
  cus_email?: string;
  cus_add1?: string;
  cus_city?: string;
  cus_postcode?: string;
  cus_country?: string;
  cus_phone?: string;
  sessionId?: string; 
};

export type CreateSessionResponse = {
  status: "SUCCESS" | "FAILED";
  sessionkey?: string;
  GatewayPageURL?: string;
  failedreason?: string;
  storeLogo?: string;
  tran_id?: string;
  redirectGatewayURL?: string;
  redirectGatewayURLFailed?: string;
  directPaymentURLBank?: string;
  directPaymentURLCard?: string;
  directPaymentURL?: string;
  desc?: string;
  errorReason?: string;
  [key: string]: any;
};

export type ValidationResponse = {
  status: "VALID" | "VALIDATED" | string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  bank_tran_id?: string;
  card_type?: string;
  card_no?: string;
  currency?: string;
  risk_title?: string;
  risk_level?: string;
  sessionId?: string;
  [k: string]: any;
};

export type TransactionQueryResponse = {
  APIConnect: "DONE" | "FAILED";
  status: "VALID" | "VALIDATED" | "INVALID_TRANSACTION" | string;
  no_of_trans_found: number;
  element: any[];
  [k: string]: any;
};

export type InitiateRefundRequest = {
  bank_tran_id: string;
  refund_amount: string;
  refund_remarks: string;
};

export type InitiateRefundResponse = {
  APIConnect: "DONE" | "FAILED";
  status: "success" | "failed";
  refund_ref_id?: string;
  errorReason?: string;
};

export type RefundStatusResponse = {
  APIConnect: "DONE" | "FAILED";
  status: string;
  [k: string]: any;
};

class SSLCOMMERZService {
  private payment: SslCommerzPayment;

  constructor() {
    const store_id = String(process.env.SSLCOMMERZ_STORE_ID || "");
    const store_passwd = String(process.env.SSLCOMMERZ_STORE_PASSWORD || "");
    const isSandbox = String(process.env.SSLCOMMERZ_IS_SANDBOX ?? "true").toLowerCase() === "true";
    
    if (!store_id || !store_passwd) {
      throw new Error("Missing SSLCOMMERZ_STORE_ID or SSLCOMMERZ_STORE_PASSWORD in .env");
    }

    this.payment = new SslCommerzPayment(store_id, store_passwd, !isSandbox);
  }

  async createSession(req: CreateSessionRequest): Promise<CreateSessionResponse> {
    const data = {
      total_amount: req.total_amount,
      currency: req.currency ?? "BDT",
      tran_id: req.tran_id,
      success_url: req.success_url,
      fail_url: req.fail_url,
      cancel_url: req.cancel_url,
      ipn_url: req.ipn_url,
      
      // Fixed parameters as per previous implementation or defaults
      emi_option: "0",
      product_category: req.product_category ?? "eCommerce",
      product_name: req.product_name ?? "Order",
      product_profile: "general", // Required field in new utility

      cus_name: req.cus_name ?? "Customer",
      cus_email: req.cus_email ?? "customer@example.com",
      cus_add1: req.cus_add1 ?? "N/A",
      cus_city: req.cus_city ?? "N/A",
      cus_postcode: req.cus_postcode ?? "0000",
      cus_country: req.cus_country ?? "Bangladesh",
      cus_phone: req.cus_phone ?? "00000000000",

      // Shipping (required in new utility)
      shipping_method: "NO",
      num_of_item: "1",
    };

    const response = await this.payment.init(data);
    
    // Check for success status as per the API behavior
    if (response?.status !== "SUCCESS") {
       throw new Error(response?.failedreason || response?.desc || "SSLCommerz init failed");
    }
    return response;
  }

  async validateByValId(val_id: string): Promise<ValidationResponse> {
    return this.payment.validate({ val_id });
  }

  async queryByTransactionId(tran_id: string): Promise<TransactionQueryResponse> {
    return this.payment.transactionQueryByTransactionId({ tran_id });
  }

  async queryBySessionId(sessionkey: string): Promise<TransactionQueryResponse> {
    return this.payment.transactionQueryBySessionId({ sessionkey });
  }

  async initiateRefund(req: InitiateRefundRequest): Promise<InitiateRefundResponse> {
    return this.payment.initiateRefund({ 
      bank_tran_id: req.bank_tran_id, 
      refund_amount: req.refund_amount, 
      refund_remarks: req.refund_remarks 
    });
  }

  async queryRefundStatus(refund_ref_id: string): Promise<RefundStatusResponse> {
     return this.payment.refundQuery({ refund_ref_id });
  }
}

const sslcommerzService = new SSLCOMMERZService();
export default sslcommerzService;
