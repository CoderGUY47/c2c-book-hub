"use client"
import OrderDetailsDialog from '@/app/account/orders/OrderDetailsDialog';
import AdminLayout from '@/app/components/admin/AdminLayout';
import OrderEditForm from '@/app/components/admin/OrderEditForm';
import OrderPaymentDialog from '@/app/components/admin/OrderPaymentDialog';
import Pagination from '@/app/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BookLoader from '@/lib/BookLoader';
import { cn } from '@/lib/utils';
import { useGetPaymentTransactionsQuery, useGetSellerPaymentsQuery } from '@/store/adminApi';
import { Calendar, CreditCard, DollarSign, FileText, Filter, Lightbulb, Package, Pencil, Search, ShoppingBag, User2, Smartphone, BookOpen, Edit3, X } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react'
import { generateInvoice } from '@/lib/generateInvoice';
import InvoicePreviewModal from '@/app/components/admin/InvoicePreviewModal';

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
    const [receiptPayment, setReceiptPayment] = useState<any>(null);

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

                                <div className="space-y-1.5 w-full flex-[1] min-w-[200px]">
                                    <label className="text-white font-bold text-sm ml-1 select-none">Search</label>
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="search "
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
                                                                className="font-poppins font-bold bg-white text-indigo-500 hover:text-white hover:bg-indigo-500/95"
                                                                onClick={() => setSelectedPayment(payment)}
                                                                >
                                                                <Lightbulb className="size-4 mr-1" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="font-poppins font-bold bg-white text-red-500 hover:text-white hover:bg-red-500/95"
                                                                onClick={() => setReceiptPayment(payment)}
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
                        <DialogContent className="sm:max-w-3xl bg-[#030303]/95 backdrop-blur-2xl border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] rounded-[2.5rem] overflow-hidden p-0 gap-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                            
                            <DialogHeader className="p-8 pb-4 relative z-10 flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Detailed Transaction Archive</span>
                                    </div>
                                    <DialogTitle className="text-4xl font-black font-langar text-white tracking-tight">
                                        Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Insight.</span>
                                    </DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Detailed breakdown of transaction history, merchant profiles, and acquisition metadata.
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            <div className="p-8 pt-2 space-y-6 relative z-10 max-h-[75vh] overflow-y-auto modern-scrollbar">
                                {/* Primary Status Card */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 flex flex-col justify-center">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Settlement Amount</span>
                                        <div className="text-3xl font-black text-white flex items-center gap-2 tracking-tighter">
                                            <i className="fa-solid fa-bangladeshi-taka-sign text-indigo-500 text-xl" />
                                            {selectedPayment.amount}
                                        </div>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 flex flex-col justify-center">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Payment Method</span>
                                        <div className="text-lg font-bold text-white tracking-tight uppercase">
                                            {selectedPayment.paymentMethod || "Electronic Transfer"}
                                        </div>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 flex flex-col justify-center">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Current State</span>
                                        <div>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                selectedPayment.status === "complete" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                            }`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${selectedPayment.status === "complete" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                {selectedPayment.status || "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Two Column Details Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Seller Identity */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full" />
                                        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                           <User2 size={12} /> Merchant Profile
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                                    <User2 className="text-indigo-400 h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Account Name</p>
                                                    <p className="text-sm font-bold text-white">{selectedPayment.seller?.name || "Independent Seller"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                                    <Smartphone className="text-purple-400 h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Connect</p>
                                                    <p className="text-sm font-bold text-white">{selectedPayment.seller?.phoneNumber || selectedPayment.seller?.email || "Encrypted"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Meta */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full" />
                                        <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                           <Package size={12} /> Acquisition Meta
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                                    <ShoppingBag className="text-orange-400 h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Order Hash</p>
                                                    <p className="text-sm font-bold text-white tabular-nums tracking-widest">#{selectedPayment?.order?._id?.slice(-8).toUpperCase() || "INTERNAL"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                    <Calendar className="text-emerald-400 h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Processed On</p>
                                                    <p className="text-sm font-bold text-white">{formatDate(selectedPayment.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Manifest Card */}
                                <div className="bg-gradient-to-br from-indigo-500/[0.05] to-purple-500/[0.05] border border-white/5 rounded-[2rem] p-1 shadow-inner group">
                                    <div className="bg-[#080808] rounded-[1.9rem] p-6">
                                        <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
                                           <span className="flex items-center gap-2"><BookOpen size={12} /> Product Manifest</span>
                                           <span className="text-[10px] text-indigo-500/40">Verified Collection Item</span>
                                        </h3>
                                        
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            {selectedPayment.product?.images?.[0] && (
                                                <div className="relative h-24 w-16 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                    <Image 
                                                        src={selectedPayment.product.images[0]} 
                                                        alt="cover" 
                                                        fill 
                                                        className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 text-center md:text-left">
                                                <h4 className="text-xl font-bold text-white mb-1 leading-tight">{selectedPayment?.product?.title || "Classified Publication"}</h4>
                                                <p className="text-xs font-medium text-white/30 uppercase tracking-widest italic">{selectedPayment?.product?.author || "Curated Edition"}</p>
                                            </div>
                                            <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Catalog Value</p>
                                                <p className="text-lg font-black text-white tracking-tighter">
                                                    <i className="fa-solid fa-bangladeshi-taka-sign mr-1 text-indigo-400" />
                                                    {selectedPayment?.product?.finalPrice || "0"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section if exists */}
                                {selectedPayment?.notes && (
                                    <div className="p-6 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Edit3 size={10} /> Administrative Annotations
                                        </p>
                                        <p className="text-sm text-white/60 leading-relaxed font-medium italic">
                                            "{selectedPayment.notes}"
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                    <Button 
                                        onClick={() => setSelectedPayment(null)}
                                        className="bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-6 rounded-2xl border border-white/10 transition-all active:scale-95"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                <InvoicePreviewModal 
                    isOpen={!!receiptPayment} 
                    onClose={() => setReceiptPayment(null)} 
                    payment={receiptPayment} 
                />
            </AdminLayout>
        </div>
    )
}

export default page 