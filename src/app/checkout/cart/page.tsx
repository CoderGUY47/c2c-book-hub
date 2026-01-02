"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  useGetCartQuery,
  useGetOrderByIdQuery,
  useRemoveFromCartMutation,
  useCreateOrUpdateOrderMutation,
  useCreateSslcommerzPaymentMutation,
} from "@/store/api";
import toast from "react-hot-toast";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/store/slice/wishlistSlice";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { setCart } from "@/store/slice/cartSlice";
import NoData from "@/app/components/NoData";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import {
  ChevronRight,
  CreditCardIcon,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PriceDetails from "@/app/components/PriceDetails";
import CartItem from "@/app/components/CartItem";
import { Address } from "@/lib/types/type";
import { setCheckoutStep, setOrderId } from "@/store/slice/checkoutSlice";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { orderId, step } = useSelector((state: RootState) => state.checkout);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(
    user?.id
  );
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(
    orderId || ""
  );
  const [createSslPayment] = useCreateSslcommerzPaymentMutation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  //for the address dialog popup, show the given addresses from before if available
  useEffect(() => {
    if (orderData && orderData.shippingAddress) {
      setSelectedAddress(orderData.shippingAddress);
    }
  }, [orderData]);

  useEffect(() => {
    if (step === "address" && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step, selectedAddress]);

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData?.data));
    }
  }, [cartData, dispatch]);

  //this section is for remove item from cart
  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeCartMutation({ productId }).unwrap();
      console.log(result);
      if (result.success) {
        dispatch(setCart(result.data));
        toast.success(result.message || "Item removed from cart");
      } else {
        throw new Error(result.message || "Failed to remove item from cart");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item from cart, try again");
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId)
      );
      if (isWishlist) {
        const result = await removeWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishlistAction(productId));
          toast.success(result.message || "Item removed from wishlist");
        } else {
          throw new Error(
            result.message || "Failed to remove book from wishlist"
          );
        }
      } else {
        const result = await addWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(addToWishlistAction(result.data));
          toast.success(result.message || "Item added to wishlist");
        } else {
          throw new Error(result.message || "Failed to add book to wishlist");
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message;
      toast.error(errorMessage || "Failed to add book to wishlist");
    }
  };

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your cart is empty."
        description="Looks like you haven't added any items yet. 
                Explore our collection and find something you love!"
        buttonText="Browse Books"
        imageUrl="/images/cart.webp"
        onClick={() => router.push("/books")}
      />
    );
  }

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.finalPrice * item.quantity,
    0
  );
  const totalOriginalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalDiscount = totalOriginalAmount - totalAmount;
  const shippingCharge = cart.items.map((item) =>
    item.product.shippingCharge?.toLowerCase() === "free"
      ? 0
      : parseFloat(item.product.shippingCharge || "0") || 0
  );
  const maximumShippingCharge = Math.max(...shippingCharge, 0); // this will return the maximum shipping charge
  const finalAmount = totalAmount + maximumShippingCharge;

  const handleProceedToCheckout = async () => {
    if (step === "cart") {
      try {
        const result = await createOrUpdateOrder({
          data: { items: cart.items, totalAmount: totalAmount },
        }).unwrap(); //unwrap is used to get the data from the result
        if (result.success) {
          toast.success("Order created successfully");
          dispatch(setOrderId(result.data._id));
          dispatch(setCheckoutStep("address"));
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to create order");
      }
    } else if (step === "address") {
      if (selectedAddress) {
        dispatch(setCheckoutStep("payment"));
      } else {
        setShowAddressDialog(true);
      }
    } else if (step === "payment") {
      handlePayment();
    }
  };

  const handleSeletecdAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false); //false means close the dialog
    if (orderId) {
      try {
        await createOrUpdateOrder({
          updates: { orderId, shippingAddress: address },
        }).unwrap();
        toast.success("Address updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update address");
      }
    }
  };

  const handlePayment = async () => {};















  
  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="bg-purple-100 pl-8 pr-0 py-4 mb-8">
          <div className="container mx-auto flex items-center">
            <ShoppingCart className="size-6 mr-2 text-gray-600" />
            <span className="text-md font-semibold text-gray-800">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
              in your cart
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "cart"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <ShoppingCart className="size-5" />
                </div>
                <span className="font-medium text-gray-800 hidden md:inline">
                  Cart
                </span>
              </div>
              <ChevronRight className="size-5 text-gray-400" />

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "address"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <MapPin className="size-5" />
                </div>
                <span className="font-medium text-gray-800 hidden md:inline">
                  Address
                </span>
              </div>
              <ChevronRight className="size-5 text-gray-400" />

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "payment"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <CreditCardIcon className="size-5" />
                </div>
                <span className="font-medium text-gray-800 hidden md:inline">
                  Payment
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">My Orders History</CardTitle>
                  <CardDescription>Review your order</CardDescription>
                </CardHeader>
                <CardContent>
                  <CartItem
                    items={cart.items}
                    onRemoveItem={handleRemoveItem}
                    onToggleWishlist={handleAddToWishlist}
                    wishlist={wishlist}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <PriceDetails
                totalOriginalAmount={totalOriginalAmount}
                totalAmount={finalAmount}
                shippingCharge={maximumShippingCharge}
                totalDiscount={totalDiscount}
                itemCount={cart.items.length}
                isProcessing={isProcessing}
                step={step}
                onProceed={handleProceedToCheckout}
                onBack={() =>
                  dispatch(
                    setCheckoutStep(step === "address" ? "cart" : "address")
                  )
                } //if step is address then go to cart else go to address, payment is not use here because there is no next step forward, same as the cart, there is no back
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
