"use client"
import React, { useState } from 'react'
import { useGetUserOrderQuery } from '@/store/api'
import { useRouter } from 'next/navigation';
import BookLoader from '@/lib/BookLoader';
import { Order } from '@/lib/types/type';
import NoData from '@/app/components/NoData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, ShoppingBag, Package } from 'lucide-react';
import OrderDetailsDialog from './OrderDetailsDialog';
import { Button } from '@/components/ui/button';


const page = () => {
    const { data: orderData, isLoading } = useGetUserOrderQuery({});
    const [showAllOrders, setShowAllOrders] = useState(false);
    const router = useRouter();

    if (isLoading) {
        return <BookLoader />
    }

    const orders: Order[] = orderData?.data || [];
    const displayOrders = showAllOrders ? orders : orders.slice(0, 10);

    if (orders.length === 0) {
        return (
            <div className="my-10 max-w-3xl justify-center mx-auto bg-gray-800/50 backdrop-blur-xl text-white">
                <NoData
                    imageUrl="/images/no-book.png"
                    message="You haven't order any books yet."
                    description="A great opportunity to buy & sell books, and gain a trustful reputation."
                    onClick={() => router.push("/books")}
                    buttonText="Order Your First Book"
                />
            </div>
        ); 
    }


    return (
        <div className='space-y-6 p-4 -mt-[34px] sm:p-6 lg:p-8'>
            <div className="bg-gradient-to-tl from-gray-600/20 via-white/10 to-gray-600/20 border-0 p-8 rounded-xl text-white shadow-lg">
                <h1 className='text-3xl sm:text-4xl font-bold font-poppins mb-2'>My Orders</h1>
                <p className='text-base font-medium'>View & manage your recent orders</p>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-2 gap-6'> 
                {
                    displayOrders.map((order) => (
                        <Card key={order?._id} className='flex flex-col bg-gradient-to-tl from-black/30 via-white/10 to-black/20 shadow-md backdrop-blur-lg border-0 rounded-lg'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2 text-lg sm:text-xl text-indigo-500 font-extrabold font-poppins'>
                                    <ShoppingBag className='size-6 text-white' />
                                    Order ID: #{order?._id.slice(-5)}
                                    {/* show only 5 number of the order id */}
                                </CardTitle>
                                <CardDescription className='flex items-center gap-2 text-sm font-semibold text-indigo-400'>
                                    <Calendar className='text-white size-6'/>
                                    {new Date(order?.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='flex-grow'>
                                <div className="space-y-2">
                                    <p className='font-semibold text-gray-50'>
                                        {order.items.map((item) => item.product?.title || "Deleted Product").join(", ")}
                                    </p>
                                    <div className="flex flex-col font-medium text-sm gap-2 text-gray-400">
                                        <span>Genre: {order.items.map((item) => item.product?.genre || "N/A").join(", ")}</span>
                                        <span>Author: {order.items.map((item) => item.product?.author || "N/A").join(", ")}</span>
                                    </div>
                                    <p className='flex items-center text-sm font-semibold text-white'>
                                        <CreditCard className='size-6 mr-2 text-white' /> Total: <i className='fa fa-bangladeshi-taka-sign text-white' />{order.totalAmount}
                                    </p>
                                    <div className={`p-2 rounded-lg bg-transparent shadow-sm mt-4 flex items-center justify-between`}>
                                        <span className='text-sm font-bold text-amber-500'>Status</span>
                                        <span className={`px-2.5 py-1.5 rounded-full text-sm font-bold border-0 shadow-lg backdrop-blur-lg
                                        ${(
                                                order.status === "delivered") ? "bg-white/10 text-green-500" :
                                                order.status === "processing" ? "bg-white/10 text-blue-500" : 
                                                order.status === "shipped" ? "bg-white/10 text-yellow-500" : "bg-white/10 text-amber-300"
                                            }
                                        `}
                                        >
                                            {(order.status || 'processing').charAt(0).toUpperCase() + (order.status || 'processing').slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <OrderDetailsDialog order={order}/>
                            </CardFooter>
                        </Card>
                    ))
                }
            </div>
            <div className="flex justify-center">
                <Button onClick={() => setShowAllOrders(!showAllOrders)}
                    className='bg-gradient-to-tl from-purple-700 to-purple-600 text-white font-poppins font-bold hover:bg-purple-600 transition-colors transform hover:scale-101 duration-300 cursor-pointer'>
                    {showAllOrders ? 'Show Less' : 'View All Orders'}
                </Button>
            </div>
        </div>
    )
}

export default page