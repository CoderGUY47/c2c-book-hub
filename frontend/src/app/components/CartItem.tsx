"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/lib/types/type";
import { Heart, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiTrash } from "react-icons/fi";

interface CartItemProp {
  items: CartItem[];
  onRemoveItem: (productId: string) => Promise<void>;
  onUpdateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  onToggleWishlist: (productId: string) => Promise<void>;
  wishlist: { products: string[] }[];
  isUpdating?: boolean;
}

const CartItems: React.FC<CartItemProp> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onToggleWishlist,
  wishlist,
  isUpdating = false,
}) => {
  return (
    <ScrollArea className="h-[520px]">
      <div className="min-w-[700px] w-full">
        {/* Table Container */}
        <div className="border-2 border-white/10">
          {/* Header Row */}
          <div
            className="grid border-b-2 border-white/10"
            style={{ gridTemplateColumns: "1fr 100px 150px 100px 120px" }}
          >
            <div className="text-center border-r-2 border-white/10 py-4 px-6 text-[14px] font-bold uppercase tracking-wider text-white">
              Product
            </div>
            <div className="text-center border-r-2 border-white/10 py-4 px-4 text-[14px] font-bold uppercase tracking-wider text-white">
              Price
            </div>
            <div className="text-center border-r-2 border-white/10 py-4 px-4 text-[14px] font-bold uppercase tracking-wider text-white">
              Quantity
            </div>
            <div className="text-center border-r-2 border-white/10 py-4 px-4 text-[14px] font-bold uppercase tracking-wider text-white">
              Delivery
            </div>
            <div className="text-right py-4 px-6 text-[14px] font-bold uppercase tracking-wider text-white">
              Actions
            </div>
          </div>

          {/* Body Rows */}
          {items.map((item) => (
            <div
              key={item._id}
              className="grid border-b border-white/10 hover:bg-white/5 transition-colors"
              style={{ gridTemplateColumns: "1fr 100px 150px 100px 120px" }}
            >
              {/* Product Column */}
              <div className="border-r-2 border-white/10 py-4 px-4 overflow-hidden flex items-center">
                <div className="flex items-center space-x-6 max-w-full">
                  <Link
                    href={`/books/${item.product.title
                        ? item.product.title
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, "")
                          .replace(/[\s_-]+/g, "-")
                        : item.product._id
                      }`}
                    className="relative shrink-0 p-1 bg-white/5 rounded-lg shadow-sm border border-white/10"
                  >
                    <Image
                      src={
                        item?.product?.images?.[0] || "/images/placeholder.jpg"
                      }
                      alt={item?.product?.title || "Product image"}
                      width={50}
                      height={64}
                      className="object-contain h-28 w-20"
                    />
                  </Link>
                  <Link
                    href={`/books/${item.product.title
                        ? item.product.title
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, "")
                          .replace(/[\s_-]+/g, "-")
                        : item.product._id
                      }`}
                    className="hover:text-indigo-600 transition-colors flex-1 min-w-0"
                  >
                    <h3 className="text-[14px] font-semibold text-white leading-snug line-clamp-2">
                      {item.product.title}
                    </h3>
                  </Link>
                </div>
              </div>

              {/* Price Column */}
              <div className="border-r-2 border-white/10 py-6 px-4 flex items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center">
                  <span className="text-[12px] font-semibold text-gray-400 line-through tabular-nums leading-none mb-1">
                    <i className="fa-solid fa-bangladeshi-taka-sign mr-0.5"></i>
                    {item.product.price}
                  </span>
                  <span className="text-[12px] font-semibold text-white tabular-nums leading-none">
                    <i className="fa-solid fa-bangladeshi-taka-sign mr-0.5"></i>
                    {item.product.finalPrice}
                  </span>
                </div>
              </div>

              {/* Quantity Column */}
              <div className="border-r-2 border-white/10 py-6 px-4 flex items-center justify-center">
                <div className="w-[120px] flex items-center justify-center border border-white/10 rounded-full p-1.5 bg-white/5 shadow-inner">
                  {/* Decrement Button */}
                  <button
                    onClick={() => {
                      onUpdateQuantity(item.product._id, item.quantity - 1);
                    }}
                    disabled={item.quantity <= 1}
                    className="h-7 w-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all duration-200 active:scale-75 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-gray-300 disabled:active:scale-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>

                  {/* Quantity Display */}
                  <span className="w-[36px] text-[14px] font-bold text-white text-center tabular-nums selection:bg-transparent">
                    {item.quantity}
                  </span>

                  {/* Increment Button */}
                  <button
                    onClick={() => {
                      onUpdateQuantity(item.product._id, item.quantity + 1);
                    }}
                    className="h-7 w-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-indigo-500/20 text-gray-300 hover:text-indigo-400 transition-all duration-200 active:scale-75"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Shipping Column */}
              <div className="border-r-2 border-white/10 py-6 px-4 flex items-center justify-center">
                <span
                  className={`text-[12px] font-semibold uppercase ${item.product.shippingCharge === "free"
                      ? "text-green-600"
                      : "text-gray-400"
                    }`}
                >
                  {item.product.shippingCharge === "free" ? (
                    "Free"
                  ) : (
                    <>
                      <i className="fa-solid fa-bangladeshi-taka-sign mr-0.5"></i>
                      {item.product.shippingCharge}
                    </>
                  )}
                </span>
              </div>

              {/* Actions Column */}
              <div className="py-6 px-6 flex items-center justify-end">
                <div className="flex items-center justify-end space-x-4">
                  <button
                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                    onClick={() => onRemoveItem(item.product._id)}
                    title="Delete"
                  >
                    <FiTrash className="size-4" />
                  </button>
                  <button
                    className={`transition-all p-1 ${wishlist.some((w) =>
                      w.products.includes(item.product._id)
                    )
                        ? "text-indigo-600"
                        : "text-gray-400 hover:text-indigo-500"
                      }`}
                    onClick={() => onToggleWishlist(item.product._id)}
                    title={
                      wishlist.some((w) =>
                        w.products.includes(item.product._id)
                      )
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      className={`size-4 ${wishlist.some((w) =>
                        w.products.includes(item.product._id)
                      )
                          ? "fill-indigo-600"
                          : ""
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CartItems;
