"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const PaymentFailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements for Glass Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full relative overflow-hidden bg-white/40 backdrop-blur-lg border-2 border-white/50 text-center mx-1 mb-4 p-8 rounded-2xl shadow-2xl">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-24 h-24 bg-gradient-to-tr from-red-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 border-0 shadow-lg"
          >
            <XCircle className="size-12 text-white drop-shadow-md" />
          </motion.div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">
              Payment Failed
            </h1>
            <p className="bg-white/30 backdrop-blur-md rounded-full border-2 border-white/40 py-1 px-4 mb-6 font-bold text-sm text-gray-800 inline-block shadow-sm">
              We couldn't process your payment
            </p>

            {error && (
              <div className="bg-red-50/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-red-100/50 text-left shadow-inner">
                <p className="text-xs uppercase tracking-widest text-[#DC143C] font-extrabold mb-1">
                  Error Details
                </p>
                <p className="text-sm font-semibold text-[#DC143C] break-words">
                  {decodeURIComponent(error)}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                className="w-full bg-gradient-to-tr from-red-600 to-amber-500 hover:from-red-500 hover:to-red-600 transition-colors duration-300 text-white font-bold h-12 rounded-xl shadow-lg border-0 cursor-pointer"
                onClick={() => router.push("/checkout/cart")}
              >
                <RefreshCw className="ml-2 size-4" />
                Try Again
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl font-bold text-gray-800 bg-white/60 hover:bg-white/90 border-2 border-white/50 hover:border-white transition-all shadow-sm"
                onClick={() => router.push("/books")}
              >
                <ShoppingBag className="ml-2 size-4" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentFailPage;
