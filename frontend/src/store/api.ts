//maually api template created
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { register } from 'module'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const API_URLS={
    REGISTER:`/api/auth/register`,
    LOGIN:`/api/auth/login`,
    VERIFY_EMAIL: (token:string) => `/api/auth/verify-email/${token}`,
    FORGOT_PASSWORD:`/api/auth/forgot-password`, //when no reset password, no need token
    RESET_PASSWORD:(token:string)=>`/api/auth/reset-password/${token}`, //when do reset password, need token
    VERIFY_AUTH:`/api/auth/verify-auth`,
    LOGOUT:`/api/auth/logout`,
    UPADATE_USER_PROFILE:(userId:string)=> `/api/user/profile/update/${userId}`,

/*\\\\ ** product related urls **////////*/
    PRODUCTS:`/api/products`,
    PRODUCT_BY_ID: (id:string) => `/api/products/${id}`,
    GET_PRODUCT_BY_SELLER_ID: (sellerId:string) => `/api/products/seller/${sellerId}`,
    DELETE_PRODUCT_BY_PRODUCT_ID: (productId:string) => `/api/products/seller/${productId}`,

/*\\\\ ** cart related urls **////////*/
    CART:(userId:string)=> `/api/cart/${userId}`,
    ADD_TO_CART: `/api/cart/add`,
    REMOVE_FROM_CART:(productId:string)=> `/api/cart/remove/${productId}`,

/*\\\\ ** wishlist related urls **////////*/
    WISHLIST:(userId:string)=> `/api/wishlist/${userId}`,
    ADD_TO_WISHLIST: `/api/wishlist/add`,
    REMOVE_FROM_WISHLIST:(productId:string)=> `/api/wishlist/remove/${productId}`,

/*\\\\ ** order related urls **////////*/
    ORDER: `/api/order`,
    ORDER_BY_ID: (orderId:string) => `/api/order/${orderId}`,
    CREATE_SSL_PAYMENT: `/api/payments/ssl/payment`,

/*\\ ** address related urls **////////*/
    GET_ADDRESS:`/api/user/address`,
    ADD_OR_UPDATE_ADDRESS: `/api/user/address/create-or-update`,

/*\\\\ ** payment related urls **////////*/
    INIT_SSL_PAYMENT: `/api/payments/ssl/payment`,
    GET_SSL_STATUS_BY_TRAN_ID: (tranId: string) => `/api/payments/ssl/status/by-tran-id/${tranId}`,
    GET_SSL_STATUS_BY_SESSION_ID: (sessionkey: string) => `/api/payments/ssl/status/by-session-id/${sessionkey}`,
    INITIATE_SSL_REFUND: `/api/payments/ssl/refund`,
    GET_SSL_REFUND_STATUS: (refundRefId: string) => `/api/payments/ssl/refund/status/${refundRefId}`,
}




export const api = createApi({
    baseQuery:fetchBaseQuery({
        baseUrl:BASE_URL,
        credentials:'include'
    }),
    tagTypes:['User', 'Product', 'Cart', 'Order', 'Address', 'Payment', 'Wishlist'],
    endpoints:(builder)=>({
        //USER endpoints
        register:builder.mutation({   //go to server, modify the data
            query:(userData) =>({
                url:API_URLS.REGISTER,
                method:'POST',
                body:userData
            })
        }),

        login:builder.mutation({   //go to server, modify the data
            query:(userData) =>({
                url:API_URLS.LOGIN,
                method:'POST',
                body:userData
            })
        }),

        verifyEmail:builder.mutation({   //go to server, modify the data
            query:(token) =>({
                url:API_URLS.VERIFY_EMAIL(token),
                method:'GET',
            })
        }),

        forgotPassword:builder.mutation({   //go to server, modify the data
            query:(email) =>({
                url:API_URLS.FORGOT_PASSWORD,
                method:'POST',
                body: {email}
            })
        }),

        resetPassword:builder.mutation({   //go to server, modify the data
            query:({token,newPassword})=>({
                url:API_URLS.RESET_PASSWORD(token),
                method:'POST',
                body: {newPassword}
            })
        }),

        verifyAuth:builder.mutation({   //go to server, modify the data
            query:() =>({
                url:API_URLS.VERIFY_AUTH,
                method:'GET',
            })
        }),

        logout:builder.mutation({   //go to server, modify the data, cz mutation is used to update or modify the state and Query means get something not modifying things.
            query:() =>({
                url:API_URLS.LOGOUT,
                method:'GET',
            })
        }),

        updateUser:builder.mutation({   //go to server, modify the data
            query:({userId,userData}) =>({
                url:API_URLS.UPADATE_USER_PROFILE(userId),
                method:'PUT', //PUT is used to update the data
                body: userData
            })
        }),

        //products endpoint
        addProducts:builder.mutation({   //go to server, modify the data
            query:(productData) =>({
                url:API_URLS.PRODUCTS,
                method:'POST',
                body: productData,
            }),
            invalidatesTags:['Product']
        }),

        getProducts:builder.query<any, void>({ 
            query:() => API_URLS.PRODUCTS,
            providesTags:['Product']
        }),

        getProductById:builder.query({   //go to server, modify the data
            query:(id) =>
                API_URLS.PRODUCT_BY_ID(id),
                providesTags:['Product']
        }),

        getProductBySellerId:builder.query({   //go to server, modify the data
            query:(sellerId) => API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
                providesTags:['Product']
        }),

        deleteProductById:builder.mutation({   //go to server, modify the data
            query:({productId}) =>({
                url:API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productId),
                method:'DELETE',
            }),
            invalidatesTags:['Product']
        }),


        //cart endpoints
        addToCart:builder.mutation({   //go to server, modify the data
            query:(productData) =>({
                url:API_URLS.ADD_TO_CART,
                method:'POST',
                body: productData,
            }),
            invalidatesTags:['Cart']
        }),

        removeFromCart:builder.mutation({   //go to server, modify the data
            query:({productId}) =>({
                url:API_URLS.REMOVE_FROM_CART(productId),
                method:'DELETE',
            }),
            invalidatesTags:['Cart']
        }),

        getCart:builder.query({   //go to server, modify the data
            query:(userId) =>
                API_URLS.CART(userId),
                providesTags:['Cart']
        }),


        //Wishlist endpoints
        addToWishlist:builder.mutation({   //go to server, modify the data
            query:(productId) =>({
                url:API_URLS.ADD_TO_WISHLIST,
                method:'POST',
                body: {productId},
            }),
            invalidatesTags:['Wishlist']
        }),

        removeFromWishlist:builder.mutation({   //go to server, modify the data
            query:({productId}) =>({
                url:API_URLS.REMOVE_FROM_WISHLIST(productId),
                method:'DELETE',
            }),
            invalidatesTags:['Wishlist']
        }),

        getWishlist:builder.query({   //go to server, modify the data
            query:(userId) =>
                API_URLS.WISHLIST(userId),
                providesTags:['Wishlist']
        }),

        //order endpoints
        getUserOrder:builder.query({   //go to server, modify the data
            query:() =>
                API_URLS.ORDER,
                providesTags:['Order']
        }),

        getOrderById:builder.query({   //go to server, modify the data
            query:(orderId) =>
                API_URLS.ORDER_BY_ID(orderId),
                providesTags:['Order']
        }),

        createOrUpdateOrder: builder.mutation({
            query: ({ orderId, updates, data }) => ({
                url: API_URLS.ORDER,
                method: 'POST',
                body: { ...data, ...updates, orderId },
            }),
            invalidatesTags: ['Order', 'Cart']
        }),


        createSslPayment: builder.mutation({
            query: (data) => ({
                url: API_URLS.CREATE_SSL_PAYMENT,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Cart']
        }),


        //address endpoints
        getAddress:builder.query<any[],void>({   //go to server, modify the data
            query:() =>
                API_URLS.GET_ADDRESS,
                providesTags:['Address']
        }),
        addOrUpdateAddress: builder.mutation<any, any>({
            query:(address) =>({
                url:API_URLS.ADD_OR_UPDATE_ADDRESS,
                method: 'POST',
                body: address,
            }),
            invalidatesTags:['Address']
        }),
    })
})

export const {
  // Auth hooks
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutMutation,

  // User hooks
  useUpdateUserMutation,
  useGetAddressQuery,
  useAddOrUpdateAddressMutation,

  // Product hooks
  useAddProductsMutation, 
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySellerIdQuery,
  useDeleteProductByIdMutation,

  // Cart hooks
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetCartQuery,

  // Wishlist hooks
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,

  // Order hooks
  useGetUserOrderQuery,
  useGetOrderByIdQuery,
  useCreateOrUpdateOrderMutation,

  // Payment hooks
  useCreateSslPaymentMutation,

} = api;