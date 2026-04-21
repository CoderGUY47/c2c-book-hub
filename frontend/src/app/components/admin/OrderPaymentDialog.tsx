import React, { useState } from 'react' 
import { useProcessSellerPaymentMutation } from '@/store/adminApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OrderPaymentDialogProps{
    order:any;
    onClose:()=>void;
}

const OrderPaymentDialog:React.FC<OrderPaymentDialogProps> = ({order,onClose}) => {
    const [seleectedProduct, setSeleectedProduct] = useState("");
        const [paymentMethod, setPaymentMethod] = useState("");
        const [notes, setNotes] = useState("");

        const [processPayment, {isLoading}] = useProcessSellerPaymentMutation();

    const router = useRouter();
        const handleSubmit = async(e:React.FormEvent)=>{
            e.preventDefault();
            try {
                await processPayment({
                    orderId:order._id,
                    paymentData:{
                        productId:seleectedProduct,
                        paymentMethod,
                        amount:order.totalAmount,
                        notes
                    }
                }).unwrap();
                
                toast.success("Payment processed successfully");
                onClose();
                router.refresh();
            } catch (error:any) {
                toast.error(error?.data?.message || "Failed to process payment");
            }
        }

        const getSelectedProduct = () =>{
            if(!seleectedProduct) return null;
            return order.items.find((item:any) => item.product._id === seleectedProduct)?.product;
        }

        const product = getSelectedProduct();



    return (
    <>
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Select Product</Label>
                    <Select value={seleectedProduct} onValueChange={setSeleectedProduct} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                            {order.items.map((item:any)=>(  
                                <SelectItem key={item?.product?._id} value={item?.product?._id}>
                                    {item?.product?.title} (৳{item?.product?.finalPrice})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {product &&(
                    <Card className='bg-gradient-to-tl from-purple-500 to-indigo-700 hover:from-purple-600 hover:to-indigo-800 text-white'>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-lg font-semibold flex items-center justify-between'>
                                <User className='mr-2 h-5 w-5 text-puprle-500'/> Seller Information
                            </CardTitle>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className='text-gray-300'>Name:</span>
                                        <span className='font-semibold'>{product.seller?.name || "Unknown Seller"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className='text-gray-300'>Email:</span>
                                        <span className='font-semibold'>{product.seller?.email || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className='text-gray-300'>Phone:</span>
                                        <span className='font-semibold'>{product.seller?.phone || "Not Provided"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className='text-gray-300'>Payment Method:</span>
                                        <span className='font-semibold'>{product.paymentMode || "Not Specified"}</span>
                                    </div>

                                    {product.paymentMode === "SSLCommerz" && product.paymentDetails?.sessionId && (
                                        <div className="flex items-center justify-between">
                                            <span className='text-gray-300'>Session ID:</span>
                                            <span className='font-semibold'>{product.paymentDetails?.sessionId}</span>
                                        </div>
                                    )}
                                    {product.paymentMode === "Bank Account" && product.paymentDetails?.bankDetails && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className='text-gray-300'>Account Number:</span>
                                                <span className='font-semibold'>{product.paymentDetails.bankDetails.accountNumber}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className='text-gray-300'>Bank Name:</span>
                                                <span className='font-semibold'>{product.paymentDetails.bankDetails.bankName}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className='text-gray-300'>BIC Code:</span>
                                                <span className='font-semibold'>{product.paymentDetails.bankDetails.bicCode}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </CardHeader>
                    </Card>
                )}
    
                <div className="space-y-2">
                    <Label htmlFor="status">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SSLcommerz">SSLcommerz</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                        <i className='fa-solid fa-bangladeshi-taka-sign absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 text-sm'></i>
                        <Input
                        id="amount"
                        type='number'
                        value={order?.totalAmount}
                        onChange={()=>{}}
                        placeholder="0.00"
                        className='pl-8'
                        required
                        />
                    </div>
                </div>  

                <div className="space-y-2">
                    <Label htmlFor="notes">Notes(Optional)</Label>
                    <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e)=>setNotes(e.target.value)}
                    placeholder="Add any notes about the order"
                    rows={3}
                    />
                </div>  
    
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} 
                        className='bg-gradient-to-tl from-purple-500 to-indigo-700 hover:from-purple-600 hover:to-indigo-800 text-white'>
                        {isLoading ? "Processing..." : "Process Payment"}
                    </Button>
                </div>
            </div>
        </form>
    </>
  )
}

export default OrderPaymentDialog