"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/lib/types/type";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiTrash } from "react-icons/fi";

interface CartItemProp {
  items: CartItem[];
  onRemoveItem: (productId: string) => Promise<void>;
  onToggleWishlist: (productId: string) => Promise<void>;
  wishlist: { products: string[] }[];
}

const CartItems: React.FC<CartItemProp> = ({
  items,
  onRemoveItem,
  onToggleWishlist,
  wishlist,
}) => {
  return (
    <ScrollArea className="h-[400PX] pr-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex flex-col items-center md:flex-row gap-4 py-4 border-b last:border-b-0"
        >
          <Link href={`/books/${item.product._id}`}>
            <Image
              src={item?.product?.images?.[0] || "/images/placeholder.jpg"}
              alt={item?.product?.title || "Product image"}
              width={80}
              height={100}
              className="object-contain w-60 md:48 rounded-xl"
            />
          </Link>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{item.product.title}</h3>
            <div className="mt-1 text-sm font-medium text-gray-500">
              Quantity: {item.quantity}
            </div>
            <div className="mt-1 font-medium">
              <span className="text-gray-400 line-through mr-2">
                <i className="fa-solid fa-bangladeshi-taka-sign"></i>{" "}
                {item.product.price}
              </span>
              <i className="fa-solid fa-bangladeshi-taka-sign"></i>{" "}
              {item.product.finalPrice}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {item.product.shippingCharge === "free" ? (
                "Free Shipping"
              ) : (
                <>
                  Shipping Charge:{" "}
                  <i className="fa-solid fa-bangladeshi-taka-sign"></i>{" "}
                  {item.product.shippingCharge}
                </>
              )}
            </div>
            <div className="flex mt-2 gap-2">
              <Button
                className="w-[100px] md:w-[200px]"
                variant="outline"
                size="sm"
                onClick={() => onRemoveItem(item.product._id)}
              >
                <FiTrash className="size-4 mr-1" />
                <span className="hidden md:inline">Delete</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleWishlist(item.product._id)}
              >
                <Heart
                  className={`size-5 mr-1 ${
                    wishlist.some((w) => w.products.includes(item.product._id))
                      ? "fill-red-500"
                      : ""
                  }`}
                />
                <span className="hidden md:inline cursor-pointer">
                  {wishlist.some((w) => w.products.includes(item.product._id))
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

export default CartItems;
