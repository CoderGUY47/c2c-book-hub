"use client"
import OrderDetailsDialog from '@/app/account/orders/OrderDetailsDialog';
import AdminLayout from '@/app/components/admin/AdminLayout';
import OrderEditForm from '@/app/components/admin/OrderEditForm';
import OrderPaymentDialog from '@/app/components/admin/OrderPaymentDialog';
import Pagination from '@/app/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BookLoader from '@/lib/BookLoader';
import { cn } from '@/lib/utils';
import { useGetAdminOrdersQuery } from '@/store/adminApi';
import { Calendar, CreditCard, Filter, Package, Pencil, Search, ShoppingBag } from 'lucide-react';
import React, { useMemo, useState } from 'react'

const page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({  //it will change while user input values
        status: "",
        paymentStatus: "",
        endDate: "",
        startDate: "",
        search: "",
    })

    //for editing the orders
    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [paymentOrder, setPaymentOrder] = useState<any>(null);

    //order's data fecthing
    const { data: OrdersData, isLoading: isOrdersLoading, isError } = useGetAdminOrdersQuery(filters);
    console.log("OrdersData", OrdersData);
    //set the order in a variable, if not give any order data, then return empty array
    const allOrders = OrdersData?.data?.orders || [];
    console.log("allOrders", allOrders);


    //usememo is used for memoization, it will not repeating calling the api, cz it will remember the changes in api, data, values
    const filteredOrders = useMemo(() => {
        if (!filters.search)
            return allOrders;
        const searchTerm = filters.search.toLowerCase();
        return allOrders.filter((order: any) => {
            return (
                order._id.toLowerCase().includes(searchTerm) ||
                (order.user?.name && order.user.name.toLowerCase().includes(searchTerm))
            )
        })
    }, [allOrders, filters.search])


    //calculate pagination
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    //get current page orders
    const currentOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredOrders.slice(startIndex, startIndex + pageSize);
    }, [filteredOrders, currentPage, pageSize])


    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }

    //supose index 1, then i will take it into this function, and it will set the current page
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const resetFilters = () => {
        setFilters({
            status: "",
            paymentStatus: "",
            endDate: "",
            startDate: "",
            search: "",
        });
        setCurrentPage(1);
    }


    //handle update order
    const handleClosedDialog = () => {
        setEditingOrder(null);
    }

    //handle close dialog
    const handleClosePaymentDialog = () => {
        setPaymentOrder(null);
    }
    
    return (
        <div>
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Orders Management</h1>
                    </div>

                    {/* Filters */}
                    <Card className='border-white/10 glass'>
                        <CardHeader>
                            <CardTitle className='flex items-center text-xl font-semibold'>
                                <Filter className='mr-2 h-5 w-5' />Filters
                            </CardTitle>
                            <CardDescription className='text-gray-400/80 text-lg'>Filter orders by status, payment status, date range, and search</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col lg:flex-row items-end gap-3 w-full'>

                                <div className="space-y-1.5 w-full flex-1 min-w-[140px]">
                                    <label htmlFor="status" className="text-white font-bold text-sm ml-1 select-none">Status</label>
                                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                                        <SelectTrigger className='w-full bg-white/5 border border-white/[0.07] text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 hover:bg-white/8 transition-colors'>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 text-white overflow-hidden p-1'>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="all">All Status</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="processing">Processing</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="shipped">Shipped</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="delivered">Delivered</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 w-full flex-1 min-w-[140px]">
                                    <label htmlFor="paymentStatus" className="text-white font-bold text-sm ml-1 select-none">Payment</label>
                                    <Select value={filters.paymentStatus} onValueChange={(value) => handleFilterChange("paymentStatus", value)}>
                                        <SelectTrigger className='w-full bg-white/5 border border-white/[0.07] text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 hover:bg-white/8 transition-colors'>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 text-white overflow-hidden p-1'>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="pending">Pending</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="completed">Completed</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 w-full flex-[1.5] min-w-[200px]">
                                    <label className="text-white font-bold text-sm ml-1 select-none">Search</label>
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search by ID or name"
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            className="w-full bg-white/5 border border-white/[0.07] text-white text-sm rounded-xl placeholder:text-gray-300 px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:ring-purple-500/50 hover:bg-white/8 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 w-full flex-1 min-w-[140px]">
                                    <label className="text-white font-bold text-sm ml-1 select-none">Start Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                                        <Input
                                            type='date'
                                            value={filters.startDate}
                                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/[0.07] text-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:ring-offset-0 focus-visible:border-purple-500/30 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 w-full flex-1 min-w-[140px]">
                                    <label className="text-white font-bold text-sm ml-1 select-none">End Date</label>
                                    <div className="relative group flex justify-center items-center">
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                                        <Input
                                            type='date'
                                            value={filters.endDate}
                                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/[0.07] text-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:ring-offset-0 focus-visible:border-purple-500/30 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center min-w-max">
                                    <Button
                                        onClick={resetFilters}
                                        className="h-[38px] bg-rose-500/70 hover:bg-white/70 border border-white/10 text-white px-5 rounded-xl transition-colors  duration-500 cursor-pointer font-bold"
                                    >
                                        Reset
                                    </Button>
                                </div>

                            </div>
                        </CardContent>
                    </Card>


                    {/* Orders table */}
                    <Card className='border-white/10 glass'>
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Orders
                            </CardTitle>
                            <CardDescription>
                                Showing {currentOrders.length} of {totalItems} orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isOrdersLoading ? (
                                <div className='flex items-center justify-center h-96'>
                                    <BookLoader/>
                                </div>
                            ) : (
                                currentOrders.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center py-10'>
                                        <ShoppingBag className='h-12 w-12 text-gray-400'/>
                                        <h3 className='text-gray-300 text-xl mt-3 font-bold font-poppins'>No orders found</h3>
                                        <p className='mt-1 text-sm text-gray-400 font-hanken-grotesk'>Try adjusting your search or filters</p>
                                    </div>
                                ) : (
                                 <>
                                 <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Payment</TableHead>
                                                <TableHead className='text-right'>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentOrders.map((order:any) => (
                                                <TableRow key={order?._id}>
                                                    <TableCell className='font-poppins font-medium text-white'>#{order?._id.slice(-6)}</TableCell>
                                                    <TableCell className='font-poppins text-white'>{order.user && order.user.name}</TableCell>
                                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell className='font-poppins text-white'>৳{order.totalAmount.toLocaleString()}</TableCell>
                                                    <TableCell className=''>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-xs font-semibold",
                                                            order.status === "pending" && "bg-yellow-500/20 text-yellow-400",
                                                            order.status === "processing" && "bg-blue-500/20 text-blue-400",
                                                            order.status === "shipped" && "bg-purple-500/20 text-purple-400",
                                                            order.status === "delivered" && "bg-green-500/20 text-green-400",
                                                            order.status === "cancelled" && "bg-red-500/20 text-red-400"
                                                        )}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className=''>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                                            ${order.paymentStatus === "complete" ? "bg-green-500/20 text-green-400" : 
                                                            order.paymentStatus === "failed" ? "bg-red-500/20 text-red-400" : 
                                                            "bg-yellow-500/20 text-yellow-400"}`}>
                                                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <OrderDetailsDialog order={order} />
                                                            <Button 
                                                                variant="default" 
                                                                size="sm" 
                                                                className="font-poppins font-black bg-white text-indigo-500 hover:text-white hover:bg-indigo-500/95"
                                                                onClick={() => setEditingOrder(order)}
                                                                >
                                                                <Pencil className="size-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="font-poppins font-black bg-white text-red-500 hover:text-white hover:bg-red-500/95"
                                                                onClick={() => setPaymentOrder(order)}
                                                                >
                                                                <CreditCard className="size-4 mr-1" />
                                                                Payment Seller
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                 </div>
                                 </>   
                                )
                            )} 

                            {/* custom pagination */}
                            {!isOrdersLoading && currentOrders.length > 0 && (
                                <div className="mt-5">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>



                {/* Editing order dialog */}
                {editingOrder && (
                    <Dialog open={!!editingOrder} onOpenChange={(open)=> !open && handleClosedDialog()}>
                        <DialogContent className='sm:max-w-xl'>
                            <DialogHeader>
                                <DialogTitle className='font-poppins font-black text-transparent bg-gradient-to-tl from-indigo-600 to-purple-600 bg-clip-text tracking-tight shadow-xl uppercase'>
                                    Edit Order
                                </DialogTitle>
                                <OrderEditForm order={editingOrder} onClose={handleClosedDialog} />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                )}


                {/* Editing payment seller dialog */}
                {paymentOrder && (
                    <Dialog open={!!paymentOrder} onOpenChange={(open)=> !open && handleClosePaymentDialog()}>
                        <DialogContent className='sm:max-w-xl'>
                            <DialogHeader>
                                <DialogTitle className='font-poppins font-black text-transparent bg-gradient-to-tl from-indigo-600 to-purple-600 bg-clip-text tracking-tight shadow-xl uppercase'>
                                    Process Seller Payment
                                </DialogTitle>
                                <OrderPaymentDialog order={paymentOrder} onClose={handleClosePaymentDialog} />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                )}
            </AdminLayout>
        </div>
    )
}

export default page 
