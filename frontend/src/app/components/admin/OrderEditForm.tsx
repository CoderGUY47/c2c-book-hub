import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateOrderMutation } from '@/store/adminApi';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface OrderEditFormProps{
    order:any;
    onClose:()=>void;
}
const OrderEditForm:React.FC<OrderEditFormProps> = ({order,onClose}) => {
    const [status, setStatus] = useState(order.status);
    const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
    const [notes, setNotes] = useState("");
    const [updateOrder, {isLoading}] = useUpdateOrderMutation();
const router = useRouter();
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try {
            await updateOrder({
                orderId:order._id,
                update:{
                    status,
                    paymentStatus,
                    notes
                }
            }).unwrap();
            toast.success("Order updated successfully");
            onClose();
            router.refresh();
        } catch (error:any) {
            toast.error(error?.data?.message || "Failed to update order");
        }
    }


  return (
    <>
    <form onSubmit={handleSubmit} className='space-y-6'>
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus} required> 
                    <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
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
                    {isLoading ? "Updating..." : "Update Order"}
                </Button>
            </div>
        </div>
    </form>
    </>    
  )
}

export default OrderEditForm
