export interface Bookdetails{
    _id: string;
    title: string;
    images: string[];
    subject: string;
    category: string;
    condition: string;
    classType: string;
    price: number;
    author: string;
    edition?: string;
    description?: string;
    finalPrice: number;
    shippingCharge: string;
    seller: UserData; // Reference to User model
    paymentMode: "Bank Account" | "SSLCommerz";
    paymentDetails:{
        sessionId?: string;
        bankDetails?: {
            accountNumber: string;
            bicCode: string;
            bankName: string;
        };
        SslcommerzDetails?: {};
    }
    createdAt: Date;
}

export interface UserData{
    name: string;
    email: string;
    profilePicture: string;
    phoneNumber: string;
    addresses: Address[];
}

export interface Address{
    _id: string;
    addressLine1: string;
    addressLine2?: string;
    phoneNumber: string;
    city: string;
    state: string;
    postalCode: string;
}


export  interface Product{
    _id: string;
    images: string[];
    title: string;
    price: number;
    finalPrice: number;
    shippingCharge: string;
}


export interface CartItem{
    _id: string;
    product: Product;
    quantity: number;
}

export interface OrderItem{
    _id: string;
    product: Bookdetails;
    quantity: number;
}


export interface PaymentDetails{
    ssl_order_id?: string;
    ssl_payment_id?: string;
    ssl_signature?: string;
}


export interface Order{
    _id: string;
    user: UserData;
    items: OrderItem[];
    totalAmount: number;
    createdAt: Date;
    shippingAddress: Address;
    paymentStatus: string;
    paymentMethod: string;
    paymentDetails: PaymentDetails;
    status: string;
}