import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CreditCard, Shield } from "lucide-react";
import { GiSlashedShield } from "react-icons/gi";
import React from "react";

interface PriceDetailsProps {
  totalOriginalAmount: number;
  totalAmount: number;
  totalDiscount: number;
  itemCount: number;
  shippingCharge: number;
  isProcessing: boolean;
  step: "cart" | "address" | "payment";
  onProceed: () => void; //use void because it doesn't return anything
  onBack: () => void;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  totalOriginalAmount,
  totalAmount,
  totalDiscount,
  itemCount,
  shippingCharge,
  isProcessing,
  step,
  onProceed,
  onBack,
}) => {
  return (
    <Card className="bg-white/[0.08] backdrop-blur-[12px] rounded-[24px] border border-white/[0.08] shadow-[0_5px_25px_5px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-500 hover:shadow-[0_5px_25px_5px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-4 pt-3 px-3 border-b-2 border-white/10 w-4/5 mx-auto flex justify-center">
        <CardTitle className="text-xl font-black text-white uppercase tracking-[0.2em]">
          Price Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-8 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-bold text-[14px] uppercase tracking-widest">
            Price ({itemCount} {itemCount > 1 ? "items" : "item"})
          </span>
          <span className="inline-block text-gray-400 font-bold tabular-nums min-w-[100px] text-right">
            <i className="fa-solid fa-bangladeshi-taka-sign mr-1"></i>
            {totalOriginalAmount}
          </span>
        </div>
        <div className="flex justify-between items-center text-green-500">
          <span className="font-bold text-[14px] uppercase tracking-widest opacity-80">
            Discount
          </span>
          <span className="inline-block font-bold tabular-nums min-w-[100px] text-right">
            -<i className="fa-solid fa-bangladeshi-taka-sign mr-1"></i>
            {totalDiscount}
          </span>
        </div>
        <div className="flex justify-between items-center pb-5 border-b-2 border-white/10">
          <span className="text-gray-400 font-bold text-[14px] uppercase tracking-widest">
            Delivery Charge
          </span>
          <span
            className={`inline-block font-bold tabular-nums min-w-[100px] text-right ${shippingCharge === 0 ? "text-green-500" : "text-gray-400"
              }`}
          >
            {shippingCharge === 0 ? (
              "Free"
            ) : (
              <>
                <i className="fa-solid fa-bangladeshi-taka-sign mr-1"></i>
                {shippingCharge}
              </>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-400 font-black text-[16px] tracking-wider uppercase">
            Total Amount
          </span>
          <span className="inline-block text-[18px] font-black text-indigo-500 tracking-wider tabular-nums min-w-[120px] text-right">
            <i className="fa-solid fa-bangladeshi-taka-sign mr-1"></i>
            {totalAmount}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-8 pb-8">
        <Button
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white border-2 border-indigo-400/20 rounded-full h-12 font-bold shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] transition-all duration-300 active:scale-[0.98]"
          size="lg"
          disabled={isProcessing}
          onClick={onProceed}
        >
          {isProcessing ? (
            "processing..."
          ) : step === "payment" ? ( //when processing is going on, sohow processing in each step
            <>
              <CreditCard className="size-4 mr-2" /> Continue to Pay
            </>
          ) : (
            <>
              <ChevronRight className="size-4 mr-2" />
              {step === "cart" ? "Proceed to checkout" : "Proceed to payment"}
            </>
          )}
        </Button>
        {step !== "cart" && (
          <Button
            className="w-full bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-full h-12 font-bold transition-all backdrop-blur-md active:scale-95"
            variant="outline"
            onClick={onBack}
          >
            <ChevronLeft className="size-4 mr-2" />
            Back to Cart
          </Button>
        )}
        <div className="flex items-center justify-center gap-2 pt-2 text-[12px] text-white/50 font-bold uppercase tracking-widest">
          <GiSlashedShield className="size-5 text-white/50" />
          <span>Safe & Secure Payment</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceDetails;
