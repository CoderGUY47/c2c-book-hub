"use client";
import React, { useState } from "react";
import { 
  useGetSellerOrdersQuery, 
  useMarkOrderAsReadyMutation, 
  useVerifyHandoverMutation 
} from "@/store/api";
import { 
  Package, 
  Scan, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode,
  ArrowRight,
  User,
  Calendar,
  X,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import BookLoader from "@/lib/BookLoader";
import NoData from "@/app/components/NoData";
import { Html5QrcodeScanner } from "html5-qrcode";

const SalesPage = () => {
  const { data: ordersData, isLoading, refetch } = useGetSellerOrdersQuery();
  const [markAsReady, { isLoading: isMarkingReady }] = useMarkOrderAsReadyMutation();
  const [verifyHandover, { isLoading: isVerifying }] = useVerifyHandoverMutation();
  
  const [activeScanner, setActiveScanner] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleMarkAsReady = async (orderId: string) => {
    try {
      await markAsReady(orderId).unwrap();
      toast.success("Order is now ready for handover! Show this to the buyer.");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to mark order as ready");
    }
  };

  const startScanner = (orderId: string) => {
    setActiveScanner(orderId);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        async (decodedText) => {
          try {
            // The buyer's QR contains a JSON string with { orderId, code }
            const data = JSON.parse(decodedText);
            if (data.orderId !== orderId) {
              toast.error("This QR code is for a different order!");
              return;
            }

            await verifyHandover({ orderId, scannedCode: data.code }).unwrap();
            scanner.clear();
            setScanSuccess(true);
            refetch();
          } catch (err) {
            console.error(err);
            toast.error("Invalid QR code or verification failed.");
          }
        },
        (error) => {
          // ignore scan errors
        }
      );
    }, 100);
  };

  if (isLoading) return <BookLoader fullScreen={false} />;

  const orders = ordersData?.data || [];

  if (orders.length === 0) {
    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
        <NoData
          imageUrl="/images/no-data.png"
          message="No sales yet."
          description="Your products haven't been ordered yet. Once someone buys your book, it will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-2">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600/20 via-white/5 to-purple-600/20 border border-white/10 p-8 rounded-2xl text-white shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold font-poppins tracking-tight uppercase">My Sales</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-md">
          Track your book sales and complete campus handovers securely using QR verification.
        </p>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order: any) => (
          <Card key={order._id} className="overflow-hidden bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300 shadow-xl group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Book Info - LEFT COLUMN */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4">
                   {/* Order ID and Status - stacked vertically */}
                   <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20 w-fit">
                        ORDER ID: {order._id.substring(0, 8)}...
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border w-fit
                        ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          order.status === 'ready_for_handover' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                        STATUS: {order.status.replace(/_/g, ' ')}
                      </span>
                   </div>

                   {order.items.map((item: any, i: number) => (
                     <div key={i} className="flex gap-4">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-white/10 shadow-lg shrink-0">
                           <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                           <h3 className="text-white font-bold text-sm line-clamp-1">{item.product.title}</h3>
                           <p className="text-gray-400 text-xs font-medium mt-0.5">QTY: {item.quantity}</p>
                           <p className="text-indigo-400 font-bold text-sm mt-1">৳{item.product.finalPrice}</p>
                        </div>
                     </div>
                   ))}
                </div>

                {/* Buyer & Action Info */}
                <div className="p-6 md:w-2/3 flex flex-col justify-between gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <h4 className="text-[10px] uppercase font-bold text-white/40 tracking-widest flex items-center gap-2">
                            <User className="size-3" /> Buyer Details
                          </h4>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
                                {order.user.name[0]}
                             </div>
                             <div className="flex flex-col">
                                <p className="text-white font-bold text-sm">{order.user.name}</p>
                                <p className="text-gray-400 text-xs font-normal">{order.user.email}</p>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-[10px] uppercase font-bold text-white/40 tracking-widest flex items-center gap-2">
                            <Calendar className="size-3" /> Ordered On
                          </h4>
                          <p className="text-white font-bold text-sm">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                       </div>
                    </div>

                    {/* Handover Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                       {order.status === 'processing' && (
                         <Button 
                           className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs h-11 rounded-xl px-6 shadow-lg shadow-indigo-600/20"
                           onClick={() => handleMarkAsReady(order._id)}
                           disabled={isMarkingReady}
                         >
                           <Package className="mr-2 size-4" /> Prepare for Handover
                         </Button>
                       )}

                      {order.status === 'ready_for_handover' && (
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider text-xs h-11 rounded-xl px-6 shadow-lg shadow-blue-600/30 animate-pulse"
                          onClick={() => startScanner(order._id)}
                        >
                          <Scan className="mr-2 size-4" /> Scan Buyer's QR
                        </Button>
                      )}

                      {order.status === 'delivered' && (
                        <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-widest text-[10px] bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                          <CheckCircle2 className="size-4" /> Transaction Completed
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scanner Modal */}
      {activeScanner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
              <button 
                onClick={() => { setActiveScanner(null); setScanSuccess(false); }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="size-6" />
              </button>
              
              {scanSuccess ? (
                /* ✅ Thank You Screen */
                <div className="flex flex-col items-center gap-6 py-4 text-center">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40">
                      <CheckCircle2 className="size-16 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                      Handover Complete!
                    </h2>
                    <p className="text-green-400 font-bold text-lg">
                      ✅ Book successfully delivered
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-4">
                      <p className="text-gray-300 text-sm font-medium leading-relaxed">
                        Thank you for using{" "}
                        <span className="text-indigo-400 font-bold">OxPecker BookHub</span>
                        !<br />
                        The transaction has been marked as complete.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setActiveScanner(null); setScanSuccess(false); }}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold uppercase tracking-wider text-sm px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* 📷 Scanner Screen */
                <>
                  <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <QrCode className="size-8 text-white" />
                     </div>
                     <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Scan Handover QR</h2>
                     <p className="text-gray-400 font-medium text-sm mt-2">
                       Scan the QR code shown on the buyer's screen to confirm the book handover.
                     </p>
                  </div>

                  <div id="reader" className="overflow-hidden rounded-2xl border-4 border-indigo-600/30 bg-black"></div>
                  
                  <p className="text-[10px] text-gray-600 text-center mt-6 font-bold uppercase tracking-widest">
                    Scanning for order: {activeScanner.substring(0, 8)}...
                  </p>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
