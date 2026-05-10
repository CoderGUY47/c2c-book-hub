import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Order } from "@/lib/types/type";
import { Cross, Eye, Package, Truck } from "lucide-react";
import { TbShoppingCartCancel } from "react-icons/tb";
import { GrCompliance } from "react-icons/gr";
import { FaTruckFast } from "react-icons/fa6";
import { LuPackageCheck } from "react-icons/lu";
import React from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { HiTemplate } from "react-icons/hi";
import { TbListDetails } from "react-icons/tb";
import { LuClipboardList } from "react-icons/lu";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
interface OrderDetailsDialogProps {
    order: Order;
}

const StatusStep = ({
    title,
    icon,
    isCompleted,
    isActive,
}: {
    title: string;
    icon: React.ReactNode;
    isCompleted: boolean;
    isActive: boolean;
}) => {
    return (
        <div className={`flex flex-col items-center ${isCompleted ? "text-amber-500" : isActive ? "text-indigo-100" : "text-gray-100"}`}>
            <div className={`rounded-full p-2 ${isCompleted ? "bg-amber-50" : isActive ? "bg-violet-500/70 shadow-md backdrop-blur-xl" : "bg-white/10 shadow-md backdrop-blur-xl"}`}>
                {icon}
            </div>
            <span className="font-medium text-xs mt-1">{title}</span>
        </div>
    );
};
const OrderDetailsDialog = ({ order }: OrderDetailsDialogProps) => {
    const getStatusIndex = (Status: string) => {
        const statuses = ["processing", "ready_for_handover", "delivered", "cancelled"];
        return statuses.indexOf(Status);
    };

    const statusIndex = getStatusIndex(order?.status || "processing");

    console.log("OrderDetailsDialog Render:", {
        id: order?._id,
        shippingAddress: order?.shippingAddress,
        typeOfAddress: typeof order?.shippingAddress,
        isAddressArray: Array.isArray(order?.shippingAddress)
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    className="font-poppins font-black bg-white text-indigo-500 hover:text-white hover:bg-indigo-500/95"
                >
                    <HiOutlineLightBulb className="size-4 mr-1" />
                    show more
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto modern-scrollbar bg-gradient-to-bl from-gray-900 to-gray-950 border-0 shadow-[0_8px_30px_10px_rgba(255,255,255,0.05)]">
                <DialogHeader className="p-2 px-4 mx-auto bg-gray-600/30 shadow-md backdrop-blur-xl rounded-lg font-poppins font-black">
                    <DialogTitle className="flex items-center gap-2 text-xl font-black text-transparent bg-gradient-to-tl from-indigo-600 to-purple-600 bg-clip-text tracking-tight shadow-xl uppercase">
                        Order Details
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gradient-to-l from-white/10 to-white/5 shadow-md p-4 rounded-lg">
                        <h3 className="flex items-center gap-2 font-semibold text-lg text-purple-50 mb-6 font-poppins">
                            <LuClipboardList className="size-9 mr-1 bg-white/10 text-purple-600 p-2 rounded-lg" /> Order Status
                        </h3>
                        <div className="flex justify-between items-center gap-2">
                            <StatusStep
                                title="Processing"
                                icon={<Package className="size-6" />}
                                isCompleted={statusIndex > 0}
                                isActive={statusIndex === 0}
                            />
                            <div
                                className={`h-0.5 flex-1 ${statusIndex > 0 ? "bg-yellow-300" : "bg-gray-300"}`}
                            />
                            <StatusStep
                                title="Ready"
                                icon={<FaTruckFast className="size-6" />}
                                isCompleted={statusIndex > 1}
                                isActive={statusIndex === 1}
                            />
                            <div
                                className={`h-0.5 flex-1 ${statusIndex > 1 ? "bg-yellow-300" : "bg-gray-300"}`}
                            />
                            <StatusStep
                                title="Delivered"
                                icon={<LuPackageCheck className="size-6" />}
                                isCompleted={statusIndex > 2}
                                isActive={statusIndex === 2}
                            />

                            {order?.status === "cancelled" && (
                                <>
                                    <div className="h-1 flex-1 bg-red-500" />
                                    <StatusStep
                                        title="Cancelled"
                                        icon={<TbShoppingCartCancel className="size-6" />}
                                        isCompleted={true}
                                        isActive={true}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {order.status === 'ready_for_handover' && (
                        <div className="bg-indigo-600 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                            <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                                <Package className="size-5" /> Campus Handover Ready
                            </h3>
                            <div className="bg-white p-3 rounded-2xl shadow-inner">
                                <QRCodeCanvas 
                                    value={JSON.stringify({ orderId: order._id, code: order.handoverCode || order._id.slice(-7) })}
                                    size={180}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-indigo-100 text-[10px] uppercase font-black tracking-[0.2em] opacity-80">Handover Code</p>
                                <p className="text-3xl font-mono font-black text-white tracking-[0.3em]">
                                    #{order.handoverCode || order._id.slice(-7).toUpperCase()}
                                </p>
                            </div>
                            <p className="text-indigo-100 text-xs text-center font-bold leading-relaxed max-w-[280px]">
                                Show this QR to the seller when you meet on campus to verify your book handover.
                            </p>
                        </div>
                    )}

                    <div className="bg-gradient-to-tl from-white/20 to-white/10 p-4 rounded-lg">
                        <h3 className="flex items-center gap-2 font-bold text-lg text-white mb-2 font-poppins"><HiTemplate />Ordered Items:</h3>
                        <div className="space-y-4">
                            {order?.items?.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 bg-black/20 p-3 shadow-md rounded-lg border-0">
                                    <div className="relative w-22 h-28 flex-shrink-0">
                                        <Image
                                            src={item?.product?.images?.[0] || "/placeholder-book.png"}
                                            alt={item?.product?.title || "Product Image"}
                                            fill
                                            className="object-cover rounded-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-xs line-clamp-1 mb-1 tracking-wider">Product: {item?.product?.title}</h4>
                                        <p className="text-white text-xs font-bold tracking-wider mb-1">Quantity: {item?.quantity}</p>
                                        <p className="text-white font-bold text-xs tracking-wider">Price: ৳{item?.product?.finalPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-tl from-white/20 to-white/10 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-green-500 mb-1">
                            Shipping Address
                        </h3>
                        <p>{order?.shippingAddress?.addressLine1}</p>
                        <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.postalCode}</p>
                    </div>
                    


                    <div className="bg-gradient-to-tl from-white/20 to-white/10 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-amber-500 mb-1">
                            Payment Details
                        </h3>
                        <p><span className="font-bold text-white">Order ID:</span> #{order?._id}</p>

                        {order?.paymentMethod === "SSLCommerz" ? (
                            <p><span className="font-bold text-white">Payment ID:</span> {order?.paymentDetails?.ssl_payment_id || 'N/A'}</p>
                        ) : (
                            <p><span className="font-bold text-white">Payment ID:</span> {order?.paymentDetails?.transactionId || order?.paymentDetails?.ssl_payment_id || Math.floor(100000000 + Math.random() * 900000000)}</p>
                        )}

                        <p><span className="font-bold text-white">Amount:</span> <i className="fa-solid fa-bangladeshi-taka-sign"></i>{order?.totalAmount}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsDialog;
