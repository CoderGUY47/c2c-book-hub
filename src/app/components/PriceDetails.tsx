import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Price Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between font-semibold">
          <span>Price ({itemCount} items)</span>
          <span>
            <i className="fa-solid fa-bangladeshi-taka-sign"></i>{" "}
            {totalOriginalAmount}
          </span>
        </div>
        <div className="flex justify-between text-green-500">
          <span>Discount</span> 
          <span>-
            <i className="fa-solid fa-bangladeshi-taka-sign"></i>{" "}
            {totalDiscount}
          </span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Delivery Charge</span> 
          <span className={`${shippingCharge === 0 ? 'text-green-500' : 'text-black font-semibold'}`}>  
            <i className="fa-solid fa-bangladeshi-taka-sign"></i>{" "}
            {shippingCharge === 0 ? 'Free' : `${shippingCharge}`}  
          </span>
        </div>
        <div className="flex justify-between border-t-2 text-indigo-500 border-gray-300 pt-4 font-bold">
          <span>Total Amount</span>  
          <span className="font-bold"> 
            <i className="fa-solid fa-bangladeshi-taka-sign"></i>{" "}
            {totalAmount}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
            size='lg'
            disabled={isProcessing}
            onClick={onProceed}
        >
            {isProcessing ? ( "processing..."): step==="payment" ? (  //when processing is going on, sohow processing in each step
                <>
                <CreditCard className="size-4 mr-2"/> Continue to Pay
                </>
            ):(
                <>
                    <ChevronRight className="size-4 mr-2"/>
                    {step ==="cart" ? "Proceed to checkout" : "Proceed to payment"}
                </>
            )}
        </Button>
        {step !== "cart" && (
            <Button
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                variant='outline'
                onClick={onBack}
            >
                <ChevronLeft className="size-4 mr-2"/>
                Back to Cart
            </Button>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <GiSlashedShield className="size-5 text-indigo-600"/>
            <span>Safe & Secure Payment</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceDetails;
