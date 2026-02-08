import dotenv from 'dotenv';
dotenv.config();

import sslcommerzService from './services/sslcommerzService';

async function testPayment() {
    console.log("Testing SSLCommerz Integration...");
    console.log("Store ID present:", !!process.env.SSLCOMMERZ_STORE_ID);
    console.log("Store Password present:", !!process.env.SSLCOMMERZ_STORE_PASSWORD);

    const mockData = {
        total_amount: "100",
        currency: "BDT" as const,
        tran_id: "TEST_TRAN_" + Date.now(),
        success_url: "http://localhost:3000/success",
        fail_url: "http://localhost:3000/fail",
        cancel_url: "http://localhost:3000/cancel",
        cus_name: "Test User",
        cus_email: "test@example.com",
        cus_add1: "Dhaka",
        cus_phone: "01700000000",
    };

    try {
        const session = await sslcommerzService.createSession(mockData);
        console.log("Session created successfully:", session);
    } catch (error: any) {
        console.error("Error creating session:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
    }
}

testPayment();
