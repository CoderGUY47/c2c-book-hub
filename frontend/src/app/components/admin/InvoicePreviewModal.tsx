import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, Printer, FileText } from 'lucide-react';
import { generateInvoice } from '@/lib/generateInvoice';

interface InvoicePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: any;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({ isOpen, onClose, payment }) => {
    if (!payment) return null;

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 bg-zinc-100/50 backdrop-blur-xl border-white/10 shadow-2xl">
                <DialogTitle className="sr-only">Invoice Preview - #{payment._id}</DialogTitle>
                <DialogDescription className="sr-only">
                    This is a preview of your official receipt. You can download or print it below.
                </DialogDescription>
                <div className="flex flex-col h-[90vh]">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 z-10">
                        <div className="flex items-center gap-2">
                            <FileText className="text-gray-500 size-5" />
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Invoice Preview</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => window.print()}
                                className="hidden md:flex items-center gap-2 text-xs font-bold border-gray-200"
                            >
                                <Printer size={14} /> Print
                            </Button>
                            <Button 
                                onClick={() => generateInvoice(payment)}
                                className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-6 items-center gap-2"
                            >
                                <Download size={14} /> Download PDF
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={onClose}
                                className="text-gray-400 hover:text-black"
                            >
                                <X size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Paper Preview Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-zinc-200/50 modern-scrollbar">
                        {/* A4 Paper */}
                        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-[0_0_50px_rgba(0,0,0,0.1)] p-[20mm] flex flex-col text-black font-serif print:shadow-none print:m-0">
                            
                            {/* Paper Header */}
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter mb-1">BOOK-HUB.</h1>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-sans">Official Marketplace Receipt</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-1">Invoice</h2>
                                    <p className="text-xs font-mono text-gray-400">#{payment._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Billing Grid */}
                            <div className="grid grid-cols-2 gap-12 mb-16 font-sans">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 border-b pb-1">Merchant Details</h3>
                                    <p className="text-sm font-bold">{payment.seller?.name || "Independent Seller"}</p>
                                    <p className="text-xs text-gray-600 mt-1">{payment.seller?.email}</p>
                                    <p className="text-xs text-gray-600">{payment.seller?.phoneNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 border-b pb-1">Client Details</h3>
                                    <p className="text-sm font-bold">{payment.order?.user?.name || "Verified Buyer"}</p>
                                    <p className="text-xs text-gray-600 mt-1">{payment.order?.user?.email}</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {payment.order?.shippingAddress?.addressLine1}<br/>
                                        {payment.order?.shippingAddress?.city}, {payment.order?.shippingAddress?.state} {payment.order?.shippingAddress?.postalCode}
                                    </p>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="grid grid-cols-3 gap-6 mb-12 font-sans py-4 border-y border-gray-100">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
                                    <p className="text-xs font-bold">{formatDate(payment.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Settlement</p>
                                    <p className="text-xs font-bold uppercase">{payment.paymentMethod || "Electronic"}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Hash</p>
                                    <p className="text-xs font-bold uppercase tabular-nums">#{payment.order?._id?.slice(-12).toUpperCase() || "N/A"}</p>
                                </div>
                            </div>

                            {/* Invoice Table */}
                            <table className="w-full mb-12 font-sans">
                                <thead>
                                    <tr className="border-b-2 border-black text-left">
                                        <th className="py-3 text-[10px] font-black uppercase tracking-widest">Item Description</th>
                                        <th className="py-3 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
                                        <th className="py-3 text-[10px] font-black uppercase tracking-widest text-right">Unit Price</th>
                                        <th className="py-3 text-[10px] font-black uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-6">
                                            <p className="text-sm font-bold">{payment.product?.title || "Classified Publication"}</p>
                                            <p className="text-[10px] text-gray-400 italic mt-1">{payment.product?.author || "Curated Edition"}</p>
                                        </td>
                                        <td className="py-6 text-sm text-center">01</td>
                                        <td className="py-6 text-sm text-right tabular-nums">BDT {payment.product?.finalPrice || payment.amount}</td>
                                        <td className="py-6 text-sm text-right font-bold tabular-nums">BDT {payment.amount}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end font-sans">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="tabular-nums">BDT {payment.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Shipping & Handling</span>
                                        <span className="tabular-nums">BDT 0.00</span>
                                    </div>
                                    <div className="flex justify-between border-t-2 border-black pt-3 mt-4">
                                        <span className="text-sm font-black uppercase tracking-widest">Total Paid</span>
                                        <span className="text-lg font-black tabular-nums">BDT {payment.amount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-24 text-center font-sans">
                                <div className="w-full h-px bg-gray-100 mb-6" />
                                <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-1">Certified Digital Record</p>
                                <p className="text-[8px] text-gray-300">This receipt validates the peer-to-peer exchange of assets via Book-Hub. No signature required.</p>
                            </div>

                        </div>
                    </div>

                    {/* Modal Bottom Actions */}
                    <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3 px-8">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="text-xs font-bold border-gray-200 px-8"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => generateInvoice(payment)}
                            className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-10"
                        >
                            Download Receipt
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoicePreviewModal;
