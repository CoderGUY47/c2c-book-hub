import axios from "axios";

// Helper to match the reference code's httpCall
const httpCall = async ({ url, method = "POST", data }: { url: string; method?: string; data?: any }) => {
  try {
    const options: any = {
      method: method,
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios(options);
    return response.data;
  } catch (error: any) {
    console.error("SSLCommerz httpCall error:", error?.message);
    throw error;
  }
};

// Ported from payment-init-data-process.js
const paymentInitDataProcess = (data: any) => {
  const postData: any = {};
  
  /*  Integration Required Parameters */
  //required//
  postData['store_id'] = data.store_id;
  postData['store_passwd'] = data.store_passwd;
  postData['productcategory'] = data.productcategory; // Note: reference uses 'productcategory' (no underscore) here but 'product_category' later? Let's check. 
  // Reference line 9: postData['productcategory'] = data.productcategory;
  // Reference line 59: postData['product_category'] = data.product_category; 
  // It seems it adds both or one is optional/legacy. I will keep EXACTLY as reference.
  
  postData['tran_id'] = data.tran_id;
  postData['total_amount'] = data.total_amount;
  postData['currency'] = data.currency;
  postData['success_url'] = data.success_url;
  postData['fail_url'] = data.fail_url;
  postData['cancel_url'] = data.cancel_url;
  
  //optional//
  postData['ipn_url'] = data.ipn_url;
  postData['multi_card_name'] = data.multi_card_name;
  postData['allowed_bin'] = data.allowed_bin;

  /* Parameters to Handle EMI Transaction */
  // required//
  postData['emi_option'] = data.emi_option;
  //optional//
  postData['emi_max_inst_option'] = data.emi_max_inst_option;
  postData['emi_selected_inst'] = data.emi_selected_inst;

  /* Customer Information */
  //required
  postData['cus_name'] = data.cus_name;
  postData['cus_email'] = data.cus_email;
  postData['cus_add1'] = data.cus_add1;
  postData['cus_add2'] = data.cus_add2;
  postData['cus_city'] = data.cus_city;
  postData['cus_state'] = data.cus_state;
  postData['cus_postcode'] = data.cus_postcode;
  postData['cus_country'] = data.cus_country;
  postData['cus_phone'] = data.cus_phone;
  //optional
  postData['cus_fax'] = data.cus_fax;

  /* Shipment Information */
  //required
  postData['shipping_method'] = data.shipping_method;
  postData['num_of_item'] = data.num_of_item;
  //optional
  postData['ship_name'] = data.ship_name;
  postData['shipcity'] = data.shipcity; // Reference uses shipcity
  postData['ship_add1'] = data.ship_add1;
  postData['ship_add2'] = data.ship_add2;
  postData['ship_city'] = data.ship_city; // Reference also uses ship_city?
  postData['ship_state'] = data.ship_state;
  postData['ship_postcode'] = data.ship_postcode;
  postData['ship_country'] = data.ship_country;

  /* Product Information */
  //required
  postData['product_name'] = data.product_name;
  postData['product_category'] = data.product_category; // Here it is with underscore
  postData['product_profile'] = data.product_profile;
  //optional
  postData['hours_till_departure'] = data.hours_till_departure;
  postData['flight_type'] = data.flight_type;
  postData['pnr'] = data.pnr;
  postData['journey_from_to'] = data.journey_from_to;
  postData['third_party_booking'] = data.third_party_booking;
  postData['hotel_name'] = data.hotel_name;
  postData['length_of_stay'] = data.length_of_stay;
  postData['check_in_time'] = data.check_in_time;
  postData['hotel_city'] = data.hotel_city;
  postData['product_type'] = data.product_type;
  postData['topup_number'] = data.topup_number;
  postData['country_topup'] = data.country_topup;
  postData['cart'] = data.cart;
  postData['product_amount'] = data.product_amount;
  postData['discount_amount'] = data.discount_amount;
  postData['convenience_fee'] = data.convenience_fee;

  /* Customized or Additional Parameters */
  //optional
  postData['value_a'] = data.value_a;
  postData['value_b'] = data.value_b;
  postData['value_c'] = data.value_c;
  postData['value_d'] = data.value_d;

  // Use URLSearchParams instead of FormData for axios compatibility without extra deps
  const params = new URLSearchParams();
  for (const key in postData) {
    // Only append if not undefined/null/empty strings if we want to mimic strict form data?
    // Reference: fdata.append(a, postData[a] ? postData[a] : '');
    params.append(key, postData[key] ? String(postData[key]) : '');
  }
  return params;
};

// Ported from payment-controller.js
export class SslCommerzPayment {
  private baseURL: string;
  private initURL: string;
  private validationURL: string;
  private refundURL: string;
  private refundQueryURL: string;
  private transactionQueryBySessionIdURL: string;
  private transactionQueryByTransactionIdURL: string;
  private store_id: string;
  private store_passwd: string;

  constructor(store_id: string, store_passwd: string, live = false) {
    this.baseURL = `https://${live ? 'securepay' : 'sandbox'}.sslcommerz.com`;
    this.initURL = this.baseURL + '/gwprocess/v4/api.php';
    this.validationURL = this.baseURL + '/validator/api/validationserverAPI.php?';
    this.refundURL = this.baseURL + '/validator/api/merchantTransIDvalidationAPI.php?';
    this.refundQueryURL = this.baseURL + '/validator/api/merchantTransIDvalidationAPI.php?';
    this.transactionQueryBySessionIdURL = this.baseURL + '/validator/api/merchantTransIDvalidationAPI.php?';
    this.transactionQueryByTransactionIdURL = this.baseURL + '/validator/api/merchantTransIDvalidationAPI.php?';
    this.store_id = store_id;
    this.store_passwd = store_passwd;
  }

  init(data: any, url: any = false, method = "POST") {
    data.store_id = this.store_id;
    data.store_passwd = this.store_passwd;
    return httpCall({
      url: url || this.initURL, 
      method: method || "POST", 
      data: paymentInitDataProcess(data)
    });
  }

  validate(data: { val_id: string }, url: any = false, method = "GET") {
    return httpCall({
      url: url || this.validationURL + `val_id=${data.val_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET"
    });
  }

  initiateRefund(data: { refund_amount: string; refund_remarks: string; bank_tran_id: string; refe_id?: string }, url: any = false, method = "GET") {
    // Reference: refund_amount=${data.refund_amount}&refund_remarks=${data.refund_remarks}&bank_tran_id=${data.bank_tran_id}&refe_id=${data.refe_id}...
    return httpCall({
      url: url || this.refundURL + `refund_amount=${data.refund_amount}&refund_remarks=${data.refund_remarks}&bank_tran_id=${data.bank_tran_id}&refe_id=${data.refe_id || ''}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET"
    });
  }

  refundQuery(data: { refund_ref_id: string }, url: any = false, method = "GET") {
    return httpCall({
      url: url || this.refundQueryURL + `refund_ref_id=${data.refund_ref_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET"
    });
  }

  transactionQueryBySessionId(data: { sessionkey: string }, url: any = false, method = "GET") {
    return httpCall({
      url: url || this.transactionQueryBySessionIdURL + `sessionkey=${data.sessionkey}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET"
    });
  }

  transactionQueryByTransactionId(data: { tran_id: string }, url: any = false, method = "GET") {
    return httpCall({
      url: url || this.transactionQueryByTransactionIdURL + `tran_id=${data.tran_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET"
    });
  }
}
