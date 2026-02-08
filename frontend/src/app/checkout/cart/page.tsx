"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  useGetCartQuery,
  useGetOrderByIdQuery,
  useRemoveFromCartMutation,
  useAddToCartMutation,
  useCreateOrUpdateOrderMutation,
  useCreateSslPaymentMutation,
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
import { clearCart, setCart } from "@/store/slice/cartSlice";
import NoData from "@/app/components/NoData";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import {
  ChevronRight,
  CreditCardIcon,
  Loader,
  MapPin,
  Shield,
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
import { resetCheckout, setCheckoutStep, setOrderId } from "@/store/slice/checkoutSlice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import CheckoutAddress from "@/app/components/CheckoutAddress";
import { PiNotePencilLight } from "react-icons/pi";
import BookLoader from "@/lib/BookLoader";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  interface Window {
    SslCommerz: any;
  }
}

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
  const [addToCartMutation, { isLoading: isUpdatingQuantity }] =
    useAddToCartMutation();
  const [addWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(
    orderId || ""
  );
  const [createSslPayment] = useCreateSslPaymentMutation();
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
        dispatch(resetCheckout());
        toast.success(result.message || "Item removed from cart");
      } else {
        throw new Error(result.message || "Failed to remove item from cart");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item from cart, try again");
    }
  };

  // Increment/Decrement quantity
  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    const currentItem = cart.items.find(
      (item) => item.product._id === productId
    );
    if (!currentItem) return;

    const delta = newQuantity - currentItem.quantity;
    if (delta === 0) return;

    try {
      const result = await addToCartMutation({
        productId,
        quantity: delta,
      }).unwrap();
      if (result.success) {
        dispatch(setCart(result.data));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update quantity");
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

  if (isCartLoading || isOrderLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-tl from-gray-950 to-gray-900 pt-10 mb-0 relative overflow-hidden">
        {/* Background decorative elements - Dark theme */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Stepper Skeleton */}
          <div className="mb-12 flex justify-center items-center gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-2xl bg-gray-700" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12 bg-gray-600" />
                  <Skeleton className="h-4 w-16 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 rounded-[24px] border border-white/10 p-8 space-y-8 shadow-sm backdrop-blur-md">
                <div className="space-y-2 flex flex-col items-center">
                  <Skeleton className="h-8 w-64 bg-gray-700" />
                  <Skeleton className="h-4 w-48 bg-gray-600" />
                </div>
                <div className="space-y-6 pt-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="h-24 w-20 rounded-lg bg-gray-700" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/2 bg-gray-700" />
                        <Skeleton className="h-4 w-1/3 bg-gray-600" />
                      </div>
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Details Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/10 rounded-[24px] border border-white/10 p-6 space-y-6 shadow-sm backdrop-blur-md">
                <Skeleton className="h-6 w-1/2 bg-gray-700" />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-gray-600" />
                    <Skeleton className="h-4 w-16 bg-gray-600" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-gray-600" />
                    <Skeleton className="h-4 w-16 bg-gray-600" />
                  </div>
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <Skeleton className="h-6 w-24 bg-gray-700" />
                    <Skeleton className="h-6 w-20 bg-gray-700" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full rounded-xl bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
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
          updates: {
            totalAmount: finalAmount,
          }
        }).unwrap();
        if (result.success) {
          toast.success("Order created successfully");
          dispatch(setOrderId(result.data._id));
          dispatch(setCheckoutStep("address"));
          setShowAddressDialog(true); // Pop up address selection immediately
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

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false); //false means close the dialog
    if (orderId) {
      try {
        await createOrUpdateOrder({ updates: { orderId, shippingAddress: address }, orderId }).unwrap();
        toast.success("Address updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update address");
      }
    }
  };



  const handlePayment = async () => {
    if (!orderId) {
      toast.error("Order not found, please try again");
      return;
    }

    // Open new tab immediately to avoid popup blockers
    const paymentWindow = window.open("", "_blank");
    if (!paymentWindow) {
      toast.error("Please allow popups to proceed with payment");
      return;
    }

    // Show loading state in the new tab with project branding
    paymentWindow.document.write(`
      <html>
        <head>
          <title>Redirecting to Payment...</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              background: #f8fafc; 
              color: #0f172a; 
            }
            .container {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 24px;
              box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
              max-width: 400px;
              width: 90%;
            }
            .logo {
              font-size: 24px;
              font-weight: 900;
              color: #4f46e5; /* Indigo 600 */
              margin-bottom: 32px;
              letter-spacing: -0.025em;
            }
            .loader-ring {
              display: inline-block;
              position: relative;
              width: 64px;
              height: 64px;
              margin-bottom: 24px;
            }
            .loader-ring div {
              box-sizing: border-box;
              display: block;
              position: absolute;
              width: 51px;
              height: 51px;
              margin: 6px;
              border: 4px solid #4f46e5;
              border-radius: 50%;
              animation: loader-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
              border-color: #4f46e5 transparent transparent transparent;
            }
            .loader-ring div:nth-child(1) { animation-delay: -0.45s; }
            .loader-ring div:nth-child(2) { animation-delay: -0.3s; }
            .loader-ring div:nth-child(3) { animation-delay: -0.15s; }
            @keyframes loader-ring {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            h1 { font-size: 18px; font-weight: 600; margin: 0 0 8px 0; }
            p { font-size: 14px; color: #64748b; margin: 0; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">BOOK SHOP</div>
            <div class="loader-ring"><div></div><div></div><div></div><div></div></div>
            <h1>Secure Payment</h1>
            <p>We are redirecting you to SSLCommerz...</p>
            <p style="margin-top: 12px; font-size: 12px; opacity: 0.7;">Please do not close this window.</p>
          </div>
        </body>
      </html>
    `);

    setIsProcessing(true);

    // Periodically check if the new tab/window is closed
    const timer = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(timer);
        setIsProcessing(false);
      }
    }, 500);
    try {
      const result = await createSslPayment({ orderId }).unwrap();
      console.log("SSL Payment init result:", result);

      if (result.success && result.data?.redirectURL) {
        paymentWindow.location.href = result.data.redirectURL;
      } else {
        paymentWindow.close();
        toast.error("Failed to initiate payment redirection");
        setIsProcessing(false);
      }
    } catch (error: any) {
      paymentWindow.close();
      console.error("Payment init error:", error);
      toast.error(error?.data?.message || "Failed to create ssl payment");
      setIsProcessing(false);
    }
  };










  return (
    <>
      <div className="min-h-screen bg-gradient-to-tl from-gray-950 to-gray-900 pt-10 mb-0 relative overflow-hidden">
        {/* Background decorative elements - Dark theme */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Modern Stepper */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-0">
              {/* Step 1: Cart */}
              <div className="flex items-center">
                <div className="flex items-center group cursor-pointer">
                  <div
                    className={`flex items-center justify-center size-10 rounded-2xl transition-all duration-500 shadow-lg ${step === "cart"
                      ? "bg-indigo-500 text-white shadow-indigo-500/20 scale-110"
                      : "bg-white/5 text-gray-500"
                      }`}
                  >
                    <ShoppingCart className="size-5" />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span
                      className={`text-[9px] uppercase tracking-[0.2em] font-black leading-none mb-1 ${step === "cart" ? "text-indigo-500" : "text-gray-500"
                        }`}
                    >
                      Step 01
                    </span>
                    <span
                      className={`text-sm font-black tracking-tight leading-none ${step === "cart" ? "text-white" : "text-gray-500"
                        }`}
                    >
                      Bag
                    </span>
                  </div>
                </div>
                <div className="mx-6 hidden md:block w-12 h-[2px] bg-gray-800 border-none">
                  <div
                    className={`h-full bg-indigo-500 transition-all duration-1000 ${step !== "cart" ? "w-full" : "w-0"
                      }`}
                  ></div>
                </div>
              </div>

              {/* Step 2: Address */}
              <div className="flex items-center">
                <div className="flex items-center group cursor-pointer">
                  <div
                    className={`flex items-center justify-center size-10 rounded-2xl transition-all duration-500 shadow-lg ${step === "address"
                      ? "bg-indigo-500 text-white shadow-indigo-500/20 scale-110"
                      : step === "payment"
                        ? "bg-indigo-500/10 text-indigo-500"
                        : "bg-white/5 text-gray-500"
                      }`}
                  >
                    <MapPin className="size-5" />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span
                      className={`text-[9px] uppercase tracking-[0.2em] font-black leading-none mb-1 ${step === "address" ? "text-indigo-500" : "text-gray-500"
                        }`}
                    >
                      Step 02
                    </span>
                    <span
                      className={`text-sm font-black tracking-tight leading-none ${step === "address" ? "text-white" : "text-gray-500"
                        }`}
                    >
                      Shipping
                    </span>
                  </div>
                </div>
                <div className="mx-6 hidden md:block w-12 h-[2px] bg-gray-800 border-none">
                  <div
                    className={`h-full bg-indigo-500 transition-all duration-1000 ${step === "payment" ? "w-full" : "w-0"
                      }`}
                  ></div>
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="flex items-center">
                <div className="flex items-center group cursor-pointer">
                  <div
                    className={`flex items-center justify-center size-10 rounded-2xl transition-all duration-500 shadow-lg ${step === "payment"
                      ? "bg-indigo-500 text-white shadow-indigo-500/20 scale-110"
                      : "bg-white/5 text-gray-500"
                      }`}
                  >
                    <CreditCardIcon className="size-5" />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span
                      className={`text-[9px] uppercase tracking-[0.2em] font-black leading-none mb-1 ${step === "payment" ? "text-indigo-500" : "text-gray-500"
                        }`}
                    >
                      Step 03
                    </span>
                    <span
                      className={`text-sm font-black tracking-tight leading-none ${step === "payment" ? "text-white" : "text-gray-500"
                        }`}
                    >
                      Payment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-white/[0.08] backdrop-blur-[12px] rounded-[24px] border border-white/[0.08] shadow-[0_5px_25px_5px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-500 hover:shadow-[0_5px_25px_5px_rgba(0,0,0,0.3)] mb-20">
                <CardHeader className="pb-6 pt-8 px-6 border-b-2 border-white/10 w-full md:w-4/5 mx-auto flex flex-col items-center justify-center">
                  <CardTitle className="text-2xl font-black text-white uppercase tracking-widest text-center">
                    My Orders History
                  </CardTitle>
                  <CardDescription className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 text-center">
                    Review your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 md:px-8 py-8">
                  <CartItem
                    items={cart.items}
                    onRemoveItem={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onToggleWishlist={handleAddToWishlist}
                    wishlist={wishlist}
                    isUpdating={isUpdatingQuantity}
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

              {selectedAddress && (
                <Card className="mt-8 mb-6 bg-white/[0.08] backdrop-blur-[12px] rounded-[24px] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
                  <CardHeader className="pb-4 pt-6 px-6 border-b-2 border-white/10 w-4/5 mx-auto flex justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <MapPin className="size-5 text-indigo-400" />
                      </div>
                      <span className="text-sm uppercase tracking-[0.2em] font-bold text-gray-400/60">
                        Delivery Address
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white tracking-tighter leading-none">
                          {selectedAddress?.state}
                        </h3>
                        <div className="text-sm text-gray-400 leading-relaxed font-medium">
                          <p>{selectedAddress?.addressLine1}</p>
                          {selectedAddress?.addressLine2 && (
                            <p>{selectedAddress?.addressLine2}</p>
                          )}
                          <p>
                            {selectedAddress?.city}, {selectedAddress?.state}{" "}
                            {selectedAddress?.postalCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">
                            Contact Phone
                          </span>
                          <span className="text-sm font-bold text-white tabular-nums">
                            {selectedAddress?.phoneNumber}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-full px-4 h-9 text-[11px] font-bold transition-all backdrop-blur-md active:scale-95"
                          variant="outline"
                          onClick={() => setShowAddressDialog(true)}
                        >
                          <PiNotePencilLight className="size-4 mr-2" />
                          Edit Address
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
            <DialogContent className="sm:max-w-[700px] p-6 bg-gray-900/40 backdrop-blur-[15px] border-none shadow-[0_10px_30px_0_rgba(0,0,0,0.3)] rounded-[24px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                  Select Delivery Address
                </DialogTitle>
                <p className="text-white/60 text-sm mb-6 ml-1 font-medium">
                  Choose your delivery location.
                </p>
              </DialogHeader>
              <CheckoutAddress
                onAddressSelect={handleSelectAddress}
                selectedAddressId={selectedAddress?._id}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default page;
