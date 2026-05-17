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
      <div className="w-full">
        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block border-2 border-white/10 overflow-hidden">
          {/* Header Row */}
          <div
            className="grid border-b-2 border-white/10 bg-white/5"
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
                          .replace(/[#?&/\\=+~`$^*()\[\]{}|:;"'<>,.!?]/g, "")
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
                          .replace(/[#?&/\\=+~`$^*()\[\]{}|:;"'<>,.!?]/g, "")
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
                  <button
                    onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                    className="h-7 w-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all duration-200 active:scale-75 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="w-[36px] text-[14px] font-bold text-white text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                    disabled={isUpdating}
                    className="h-7 w-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-indigo-500/20 text-gray-300 hover:text-indigo-400 transition-all duration-200 active:scale-75 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Shipping Column */}
              <div className="border-r-2 border-white/10 py-6 px-4 flex items-center justify-center">
                <span className={`text-[12px] font-semibold uppercase ${item.product.shippingCharge === "free" ? "text-green-500" : "text-gray-400"}`}>
                  {item.product.shippingCharge === "free" ? "Free" : `৳${item.product.shippingCharge}`}
                </span>
              </div>

              {/* Actions Column */}
              <div className="py-6 px-6 flex items-center justify-end">
                <div className="flex items-center space-x-4">
                  <button onClick={() => onRemoveItem(item.product._id)} className="text-red-500 hover:text-red-600 transition-colors p-1">
                    <FiTrash className="size-4" />
                  </button>
                  <button
                    onClick={() => onToggleWishlist(item.product._id)}
                    className={`transition-all p-1 ${wishlist.some(w => w.products.includes(item.product._id)) ? "text-indigo-600" : "text-gray-400 hover:text-indigo-50"}`}
                  >
                    <Heart className={`size-4 ${wishlist.some(w => w.products.includes(item.product._id)) ? "fill-indigo-600" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Card Layout - Hidden on Desktop */}
        <div className="md:hidden space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex gap-4">
                {/* Image */}
                <Link href={`/books/${item.product.title ? item.product.title.toLowerCase().trim().replace(/[#?&/\\=+~`$^*()\[\]{}|:;"'<>,.!?]/g, "").replace(/[\s_-]+/g, "-") : item.product._id}`} className="shrink-0">
                  <Image
                    src={item?.product?.images?.[0] || "/images/placeholder.jpg"}
                    alt={item.product.title}
                    width={80}
                    height={100}
                    className="object-contain h-24 w-20 rounded-lg bg-white/5 p-1"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 leading-tight">
                    {item.product.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 line-through">৳{item.product.price}</span>
                      <span className="text-sm font-black text-indigo-400">৳{item.product.finalPrice}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <span className={`text-[10px] font-bold uppercase ${item.product.shippingCharge === "free" ? "text-green-500" : "text-gray-400"}`}>
                      {item.product.shippingCharge === "free" ? "Free Delivery" : `৳${item.product.shippingCharge} Delivery`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Selector Mobile */}
                    <div className="flex items-center border border-white/10 rounded-full p-1 bg-black/20">
                      <button
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="h-6 w-6 flex items-center justify-center rounded-full text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-xs font-bold text-white text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="h-6 w-6 flex items-center justify-center rounded-full text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleWishlist(item.product._id)}
                        className={`p-2 rounded-full border border-white/10 ${wishlist.some(w => w.products.includes(item.product._id)) ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-gray-400"}`}
                      >
                        <Heart size={14} className={wishlist.some(w => w.products.includes(item.product._id)) ? "fill-current" : ""} />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.product._id)}
                        className="p-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        <FiTrash size={14} />
                      </button>
                    </div>
                  </div>
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
