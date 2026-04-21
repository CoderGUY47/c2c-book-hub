//maually api template created
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { register } from 'module'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

//mainly using tag means, if anything changed in the api, the get api will called out quickly

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),
    tagTypes:['AdminStats', "AdminOrders", "SellerPayments", "PaymentTransactions"],
    endpoints: (builder) => ({ 
        getDashboardStats: builder.query({
            query: () => '/api/admin/dashboard-stats',
            providesTags:['AdminStats']
        }),

        getAdminOrders: builder.query({
            query: (params) => {
                const queryParams= new URLSearchParams();
                if(params){
                    Object.entries(params).forEach(([key, value]) => {
                        if(value){
                            queryParams.append(key, value.toString());
                        }
                    });
                }
                return `/api/admin/orders?${queryParams}`;
            },
            providesTags:['AdminOrders']
        }),

        updateOrder: builder.mutation({
            query: ({ orderId, update }) => ({
                url: `/api/admin/orders/${orderId}`,
                method: 'PUT',
                body: update,
            }),
            invalidatesTags:(result, error, {orderId})=>[
                {type:'AdminOrders', id:orderId},
                "AdminOrders",
                "AdminStats",
            ]
        }),

        getSellerPayments: builder.query({
            query: (params) => {
                const queryParams= new URLSearchParams();
                if(params){
                    Object.entries(params).forEach(([key, value]) => {
                        if(value){
                            queryParams.append(key, value.toString());
                        }
                    });
                }
                return `/api/admin/seller-payments?${queryParams}`;
            },
            providesTags:['SellerPayments']
        }),

        processSellerPayment: builder.mutation({
            query: ({ orderId, paymentData }) => ({
                url: `/api/admin/process-seller-payment/${orderId}`,
                method: 'POST',
                body: paymentData,
            }),
            invalidatesTags: (result, error, { orderId }) => [
                { type: 'AdminOrders', id: orderId },
                'AdminOrders',
                'AdminStats',
                'SellerPayments'
            ]
        }),

        getPaymentTransactions: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        if (value) queryParams.append(key, value.toString());
                    });
                }
                return `/api/admin/payment-transactions?${queryParams}`;
            },
            providesTags: ['PaymentTransactions']
        }),
    })
})


export const{
    useGetDashboardStatsQuery,
    useGetAdminOrdersQuery,
    useUpdateOrderMutation,
    useGetSellerPaymentsQuery,
    useProcessSellerPaymentMutation,
    useGetPaymentTransactionsQuery,
} = adminApi