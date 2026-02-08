"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const PaymentCancelPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-tl from-gray-300 via-slate-400 to-gray-300 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements for Glass Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full relative overflow-hidden bg-white/40 backdrop-blur-lg border-2 border-white/50 text-center mx-1 mb-4 p-8 rounded-2xl shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/50 shadow-lg"
          >
            <AlertCircle className="size-12 text-white drop-shadow-md" />
          </motion.div>

          <div className="relative z-10">
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight drop-shadow-sm">
              Payment Cancelled
            </h1>
            <p className="bg-white/30 backdrop-blur-md rounded-full border border-white/40 py-1 px-4 mb-8 font-bold text-sm text-gray-800 inline-block shadow-sm">
              No charges were made
            </p>

            <div className="space-y-4">
              <Button
                className="w-full bg-gray-900 hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg shadow-gray-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] border border-gray-700/50"
                onClick={() => router.push("/checkout/cart")}
              >
                <ArrowLeft className="mr-2 size-4" />
                Return to Cart
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

export default PaymentCancelPage;
