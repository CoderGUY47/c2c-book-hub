import React from "react";
import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  discount: number;
  className?: string;
}

const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  discount,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-tl from-red-500 to-orange-400 shadow-2xl border-0 rounded-lg px-3 py-1.5 text-[10px] font-black font-poppins text-white rounded-lg cursor-pointer flex items-center justify-center whitespace-nowrap",
        className
      )}
    >
      {discount}% OFF
    </div>
  );
};

export default DiscountBadge;
