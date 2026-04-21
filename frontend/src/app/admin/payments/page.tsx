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
import { useGetPaymentTransactionsQuery, useGetSellerPaymentsQuery } from '@/store/adminApi';
import { Calendar, CreditCard, DollarSign, FileText, Filter, Lightbulb, Package, Pencil, Search, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react'

const page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); //how many order will show in one page
    const [filters, setFilters] = useState({  //it will change while user input values
        sellerId: "",  //for filtering the orders by seller
        status: "",  //for filtering the orders by status
        paymentMethod: "",  //for filtering the orders by payment status
        endDate: "",  //for filtering the orders by end date
        startDate: "",  //for filtering the orders by start date
        search: "",  //for filtering the orders by search
    })

    //for editing the orders
    const [selectedPayment, setSelectedPayment] = useState<any>(null);

    // Fetch seller payments (processed)
    const { data: PaymentsData, isLoading: isPaymentsLoading } = useGetSellerPaymentsQuery(filters);
    const allPayments = PaymentsData?.data?.payments || [];
    const seller = PaymentsData?.data?.users || [];

    // Fetch buyer payment transactions from Payment model (sslcommerz etc.)
    const { data: TxData, isLoading: isTxLoading } = useGetPaymentTransactionsQuery(filters);
    const allTransactions = TxData?.data?.payments || [];

    // Flatten Payment transactions into display rows
    const transactionsAsRows = allTransactions.flatMap((tx: any) => {
        const items = tx.order?.items || [];
        if (items.length === 0) {
            return [{
                _id: tx._id,
                seller: null,
                product: null,
                amount: tx.amount,
                paymentMethod: tx.provider || "No Payment Method Found",
                status: tx.status === "successful" ? "complete" : tx.status,
                createdAt: tx.createdAt,
                order: tx.order,
                notes: tx.order?.notes || "No notes provided",
            }];
        }
        return items.map((item: any) => ({
            _id: `${tx._id}-${item._id}`,
            seller: item.product?.seller,
            product: item.product,
            amount: tx.amount,
            paymentMethod: tx.provider || "No Payment Method Found",
            status: tx.status === "successful" ? "complete" : tx.status,
            createdAt: tx.createdAt,
            order: tx.order,
            notes: tx.order?.notes || "No notes provided",
        }));
    });

    // Priority: processed seller payments → payment transactions → empty
    const displayPayments = allPayments.length > 0 ? allPayments
        : transactionsAsRows.length > 0 ? transactionsAsRows
        : [];

    const isLoading = isPaymentsLoading || isTxLoading;


    // Filter + search
    const filteredOrders = useMemo(() => {
        if (!filters.search) return displayPayments;
        const searchTerm = filters.search.toLowerCase();
        return displayPayments.filter((payment: any) => {
            return (
                payment._id.toLowerCase().includes(searchTerm) ||
                (payment.seller?.name && payment.seller.name.toLowerCase().includes(searchTerm)) ||
                (payment?.notes && payment.notes.toLowerCase().includes(searchTerm)) ||
                (payment.product?.title && payment.product.title.toLowerCase().includes(searchTerm))
            );
        });
    }, [displayPayments, filters.search])


    //calculate pagination
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    //get current page payments
    const currentPayments = useMemo(() => {
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
            sellerId: "",
            status: "",
            paymentMethod: "",
            endDate: "",
            startDate: "",
            search: "",
        });
        setCurrentPage(1);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit' 
        });
    }


    // //handle update order
    // const handleClosedDialog = () => {
    //     setEditingOrder(null);
    // }

    // //handle close dialog
    // const handleClosePaymentDialog = () => {
    //     setPaymentOrder(null);
    // }
    
    return (
        <div>
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Seller Payments</h1>
                    </div>

                    {/* Filters */}
                    <Card className='border-white/10 glass'>
                        <CardHeader>
                            <CardTitle className='flex items-center text-xl font-semibold'>
                                <Filter className='mr-2 h-5 w-5' />Filters
                            </CardTitle>
                            <CardDescription className='text-white/60 text-lg'>Filter orders by status, payment status, date range, and search</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col lg:flex-row items-end gap-3 w-full'>
                                <div className="space-y-1.5 w-full flex-1 min-w-[140px]">
                                    <label htmlFor="status" className="text-white font-bold text-sm ml-1 select-none">Seller</label>
                                    <Select value={filters.sellerId} onValueChange={(value) => handleFilterChange("sellerId", value)}>
                                        <SelectTrigger className='w-full bg-white/5 border border-white/[0.07] text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 hover:bg-white/8 transition-colors'>
                                            <SelectValue placeholder="All Sellers" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 text-white overflow-hidden p-1'>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="all">All Sellers</SelectItem>
                                            {seller.map((seller: any) => (
                                                <SelectItem key={seller._id} value={seller._id}>
                                                    {seller.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5 w-full flex-1 min-w-[140px]">
                                    <label htmlFor="status" className="text-white font-bold text-sm ml-1 select-none">Status</label>
                                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                                        <SelectTrigger className='w-full bg-white/5 border border-white/[0.07] text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 hover:bg-white/8 transition-colors'>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 text-white overflow-hidden p-1'>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="all">All Status</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="pending">Pending</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="completed">Completed</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 w-full flex-1 min-w-[140px]">
                                    <label htmlFor="paymentMethod" className="text-white font-bold text-sm ml-1 select-none">Payment Method</label>
                                    <Select value={filters.paymentMethod} onValueChange={(value) => handleFilterChange("paymentMethod", value)}>
                                        <SelectTrigger className='w-full bg-white/5 border border-white/[0.07] text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 hover:bg-white/8 transition-colors'>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 text-white overflow-hidden p-1'>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="SSLCommerz">SSLCommerz</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="Bank Account">Bank Account</SelectItem>
                                            <SelectItem className='text-gray-300 text-sm font-medium rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:text-white focus:bg-purple-500/10 focus:text-purple-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-white data-[highlighted]:outline-none' value="Other">Other</SelectItem>
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


                    {/* Payments table */}
                    <Card className='border-white/10 glass'>
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Seller Payments
                            </CardTitle>
                            <CardDescription>
                                Showing {currentPayments.length} of {totalItems} payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className='flex items-center justify-center h-96'>
                                    <BookLoader/>
                                </div>
                            ) : (
                                currentPayments.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center py-10'>
                                        <ShoppingBag className='h-12 w-12 text-gray-400'/>
                                        <h3 className='text-gray-300 text-xl mt-3 font-bold font-poppins'>No payments found</h3>
                                        <p className='mt-1 text-sm text-gray-400 font-hanken-grotesk'>Try adjusting your search or filters</p>
                                    </div>
                                ) : (
                                 <>
                                 <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Seller</TableHead>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className='text-right'>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentPayments.map((payment:any) => (
                                                <TableRow key={payment?._id}>
                                                    <TableCell className='font-poppins text-white'>
                                                      {payment.seller?.name || "Unknown Seller"}
                                                    </TableCell>
                                                    <TableCell className='max-w-[200px] truncate font-poppins text-white'>
                                                     <div className="flex items-center gap-2">
                                                            {payment.product?.images && payment.product?.images[0] && (
                                                                <Image 
                                                                src={payment.product?.images[0]} 
                                                                alt={payment.product?.title} 
                                                                width={30} 
                                                                height={30} 
                                                                className='rounded-md'
                                                                />
                                                            )}
                                                          <span className='truncate'>{payment.product?.title}</span>
                                                     </div>
                                                    </TableCell>
                                                    <TableCell className='font-poppins text-white'>
                                                      ৳{payment.amount}
                                                    </TableCell>
                                                    <TableCell className='font-poppins text-white'>
                                                      {payment.paymentMethod || "N/A"}
                                                    </TableCell>
                                                    <TableCell className='font-poppins text-white'>
                                                      {formatDate(payment.createdAt)}
                                                    </TableCell>
                                                    <TableCell className=''>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                                            ${payment.status === "complete" ? "bg-green-500/20 text-green-400" 
                                                              : payment.status === "failed" ? "bg-red-500/20 text-red-400" 
                                                              : "bg-yellow-500/20 text-yellow-400"}
                                                              `}
                                                            >
                                                              {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : "Pending"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button 
                                                                variant="default" 
                                                                size="sm" 
                                                                className="font-poppins font-black bg-white text-indigo-500 hover:text-white hover:bg-indigo-500/95"
                                                                onClick={() => setSelectedPayment(payment)}
                                                                >
                                                                <Lightbulb className="size-4 mr-1" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="font-poppins font-black bg-white text-red-500 hover:text-white hover:bg-red-500/95"
                                                                >
                                                                <FileText className="size-4 mr-1" />
                                                                Receipt
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
                            {!isLoading && currentPayments.length > 0 && (
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


               {selectedPayment && (
                <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
                    <DialogContent className="sm:max-w-4xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-poppins font-black text-purple-100">Payment Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="bg-gradeint-to-tl from-gray-900/50 to-gray-800/50 p-6 rounded-2xl border-0">
                            <h3 className='text-xl font-poppins font-bold text-violet-500 mb-4'>Transaction Information</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='text-sm font-semibold text-white/60'>
                                Amount: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                ৳{selectedPayment.amount}
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                Payment Method: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment.paymentMethod}
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                Status: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                    ${selectedPayment.status === "complete" ? "bg-green-500/20 text-green-400" 
                                      : selectedPayment.status === "failed" ? "bg-red-500/20 text-red-400" 
                                      : "bg-yellow-500/20 text-yellow-400"}
                                    `}
                                >{selectedPayment.status}</span>
                              </div>  
                              <div className='text-sm font-semibold text-white/60'>
                                Date: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {formatDate(selectedPayment.createdAt)}
                              </div>

                              <div className='text-sm font-semibold text-white/60'>
                                Processed By: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment.seller?.name || "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradeint-to-tl from-blue-900/50 to-blue-800/50 p-6 rounded-2xl border-0">
                            <h3 className='text-xl font-poppins font-bold text-orange-500 mb-4'>Seller Information</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='text-sm font-semibold text-white/60'>
                                Amount
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment.amount}
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                Email: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment.seller?.email}
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                Phone: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment.seller?.phoneNumber || "Not Provided"}
                              </div>  
                              <div className='text-sm font-semibold text-white/60'>
                                Payment Method: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment.product?.paymentMode || "Not Specified"}
                              </div>

                              <div className='text-sm font-semibold text-white/60'>
                                Processed By: 
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment.seller?.name || "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradeint-to-tl from-white to-red-500 p-6 rounded-2xl border-0">
                            <h3 className='text-xl font-poppins font-bold text-green-500 mb-4'>Product & Order Information</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='text-sm font-semibold text-white/60'>
                                Product
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                {selectedPayment?.product?.title || "No Product Found"}
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                Price
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                ৳{selectedPayment?.product?.finalPrice || "No Price Found"}
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                Order ID
                              </div>
                              <div className='text-sm font-semibold text-white/60'>
                                #{selectedPayment?.order?._id?.slice(-6) || "N/A"}
                              </div>  
                            </div>
                          </div>
                          
                            {selectedPayment?.notes && (
                              <div className='mt-6'>
                                <h3 className='text-xl font-poppins font-bold text-green-500 mb-4'>Notes</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                  <div className='text-xl font-bold text-white'>
                                    Notes
                                  </div>
                                  <div className='text-sm font-semibold text-white/60'>
                                    {selectedPayment?.notes || "No notes provided"}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                        

                    </DialogContent>
                </Dialog>
               )}


            </AdminLayout>
        </div>
    )
}

export default page 