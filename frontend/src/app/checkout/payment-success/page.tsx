"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetOrderByIdQuery } from "@/store/api";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);







  return (
    <div className="min-h-screen bg-gradient-to-t from-indigo-600 via-blue-500 to-sky-400 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements for Glass Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="w-full relative gap-1 overflow-hidden bg-white/40 backdrop-blur-lg border-2 border-white/50 text-center mx-auto rounded-3xl shadow-2xl flex flex-col md:flex-row min-h-[500px]">
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center space-y-4 p-12">
              <Loader2 className="animate-spin text-indigo-600 size-12" />
              <p className="text-indigo-800 font-semibold animate-pulse">Loading order details...</p>
            </div>
          ) : (
            <>
              {/* LEFT SIDE: Hero Section */}
              <div className="w-full md:w-4/12 p-6 md:p-8 flex flex-col items-center justify-center relative border-0 group">
                {/* Decorative background for left side */}
                <div className="absolute inset-0 pointer-events-none" />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-28 h-28 bg-gradient-to-tl from-blue-600 to-indigo-400 rounded-full flex items-center justify-center mb-6 border-0 relative z-10"
                >
                  <CheckCircle2 className="size-15 text-white drop-shadow-md" />
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tighter relative z-10">
                  Order <br /> Successful
                </h1>
                <p className="bg-white/70 rounded-xl border-none py-4 px-2 font-bold text-base text-zinc-800 relative inline-block z-10">
                  Thank you for your purchasing from <span className="text-indigo-600">Book</span><span className="text-gray-900">Shop</span>
                </p>
              </div>

              {/* RIGHT SIDE: Details Section */}
              <div className="w-full md:w-8/12 p-6 md:p-8 flex flex-col justify-center text-left">
                {/* Order Details Grid */}
                <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-5 mb-6 border-2 hover:border-white/50 transition-all hover:bg-white/30">

                  {/* Product Details Grid */}
                  {orderData?.data?.items && orderData.data.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {orderData.data.items.slice(0, 4).map((item: any, index: number) => (
                        <div key={index} className="flex flex-row items-center gap-3 bg-white/40 p-2 rounded-lg border border-white/50 shadow-sm transition-all hover:bg-white/60 hover:shadow-md cursor-default group">
                          <div className="relative w-12 h-16 rounded border border-white/80 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={item.product?.images?.[0] || '/placeholder-book.jpg'}
                              alt={item.product?.title || 'Book'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-[11px] font-black text-gray-800 line-clamp-2 leading-tight" title={item.product?.title}>
                              {item.product?.title}
                            </p>
                            <span className="text-[9px] font-bold text-indigo-600 mt-1 uppercase tracking-tighter opacity-70">
                              Qty: {item.quantity || 1}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orderData.data.items.length > 4 && (
                        <div className="flex items-center justify-center bg-indigo-50/50 rounded-lg border border-indigo-100 p-2">
                          <span className="text-xs font-black text-indigo-600">+{orderData.data.items.length - 4} More Items</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex flex-col pb-2">
                      <span className="text-[10px] uppercase tracking-widest text-indigo-800 font-extrabold opacity-70 mb-0.5">Order ID</span>
                      <span className="text-sm font-mono font-bold text-gray-800 truncate" title={orderData?.data?._id || orderId}>{orderId || "N/A"}</span>
                    </div>
                    <div className="flex flex-col pb-2 text-right">
                      <span className="text-[10px] uppercase tracking-widest text-indigo-800 font-extrabold opacity-70 mb-0.5">Date</span>
                      <span className="text-sm font-bold text-gray-800">
                        {orderData?.data?.createdAt ? new Date(orderData.data.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className="text-[10px] uppercase tracking-widest text-indigo-800 font-extrabold opacity-70 mb-0.5">Total Amount</span>
                      <span className="text-base font-black text-indigo-600">
                        <i className="fa-solid fa-bangladeshi-taka-sign"></i>{orderData?.data?.totalAmount?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                    <div className="flex flex-col pt-1 items-end">
                      <span className="text-[10px] uppercase tracking-widest text-indigo-800 font-extrabold opacity-70 mb-0.5">Quantity</span>
                      <span className="text-sm font-bold text-gray-800">
                        {orderData?.data?.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0} Items
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className={`p-4 rounded-xl border mb-6 shadow-sm flex items-center justify-between
                    ${orderData?.data?.status === 'delivered' ? 'bg-green-100/60 border-green-200 text-green-900' :
                    orderData?.data?.status === 'cancelled' || orderData?.data?.status === 'failed' ? 'bg-red-100/60 border-red-200 text-red-900' :
                      'bg-white/60 border-white text-zinc-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${orderData?.data?.status === 'delivered' ? 'bg-green-200' : orderData?.data?.status === 'cancelled' ? 'bg-red-200' : 'bg-orange-300'} shadow-sm`}>
                      <Package className="size-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Status</span>
                      <span className="text-sm font-black tracking-wide uppercase">
                        {orderData?.data?.status || "PROCESSING"}
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <div className={`w-3 h-3 rounded-full ${orderData?.data?.status === 'delivered' ? 'bg-green-500' : orderData?.data?.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-500'} animate-ping absolute opacity-75 ml-0`}></div>
                    <div className={`w-3 h-3 rounded-full ${orderData?.data?.status === 'delivered' ? 'bg-green-500' : orderData?.data?.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-500'} relative shadow-sm`}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                  <Button
                    variant="ghost"
                    className="w-full h-11 rounded-xl font-bold text-gray-700 bg-white/60 hover:bg-white/40 border-2 border-white hover:border-white transition-all shadow-sm"
                    onClick={() => router.push("/books")}
                  >
                    <ShoppingBag className="mr-2 size-4" />
                    Continue Shopping
                  </Button>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-500/50"
                    onClick={() => router.push("/account/orders")}
                  >
                    View Order
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;