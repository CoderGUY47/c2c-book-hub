"use client";
import NoData from "@/app/components/NoData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BookLoader from "@/lib/BookLoader";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookdetails } from "@/lib/types/type";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useGetProductByIdQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Contact,
  Contact2,
  ContactIcon,
  Heart,
  Loader2,
  MapPin,
  Phone,
  Smartphone,
  ShoppingCart,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TbShare2 } from "react-icons/tb";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ShareButton } from "@/app/components/Share";

const page = () => {
  const params = useParams();
  const id = params.id;
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    data: apiResponse = {},
    isLoading,
    isError,
  } = useGetProductByIdQuery(id);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [book, setBook] = useState<Bookdetails | null>(null);
  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    if (apiResponse?.success) {
      setBook(apiResponse?.data);
    }
  }, [apiResponse]);

  const handleAddToCart = async () => {
    if (book) {
      setIsAddToCart(true);
      try {
        const result = await addToCartMutation({
          productId: book?._id,
          quantity: 1,
        }).unwrap();
        if (result.success && result.data) {
          dispatch(addToCart(result.data));
          toast.success(result.message || "Book added to cart successfully");
        } else {
          throw new Error(result.message || "Failed to add book to cart");
        }
      } catch (error: any) {
        const errorMessage = error?.data?.message;
        toast.error(errorMessage);
      } finally {
        setIsAddToCart(false);
      }
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId)
      );
      if (isWishlist) {
        const result = await removeFromWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishlistAction(productId));
          toast.success(
            result.message || "Item removed from wishlist successfully"
          );
        } else {
          throw new Error(
            result.message || "Failed to remove book from wishlist"
          );
        }
      } else {
        const result = await addToWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(addToWishlistAction(result.data));
          toast.success(
            result.message || "Item added to wishlist successfully"
          );
        } else {
          throw new Error(result.message || "Failed to add book to wishlist");
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message;
      toast.error(errorMessage || "Failed to add book to wishlist");
    }
  };

  const bookImage = book?.images || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-9 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex gap-2 mb-8">
            <Skeleton className="h-4 w-12 bg-gray-200" />
            <Skeleton className="h-4 w-4 bg-gray-200" />
            <Skeleton className="h-4 w-16 bg-gray-200" />
            <Skeleton className="h-4 w-4 bg-gray-200" />
            <Skeleton className="h-4 w-24 bg-gray-200" />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-lg bg-gray-200" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-16 rounded-lg bg-gray-200" />
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-8 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/4 bg-gray-200" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md bg-gray-200" />
                  <Skeleton className="h-8 w-20 rounded-md bg-gray-200" />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-32 bg-gray-200" />
                  <Skeleton className="h-6 w-24 bg-gray-200" />
                  <Skeleton className="h-6 w-32 bg-gray-200" />
                </div>
                <Skeleton className="h-14 w-60 rounded-md bg-gray-200" />

                <div className="rounded-lg border bg-white p-6 space-y-4">
                  <Skeleton className="h-6 w-32 bg-gray-200" />
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <React.Fragment key={i}>
                        <Skeleton className="h-4 w-20 bg-gray-200" />
                        <Skeleton className="h-4 w-24 bg-gray-200" />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg p-6 space-y-4 shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-32 bg-gray-200" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-2/3 bg-gray-200" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 space-y-6 shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-24 bg-gray-200" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-gray-200" />
                  <Skeleton className="h-4 w-48 bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book || isError) {
    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="Loading...."
          description="Wait, we are fetching book details"
          onClick={() => router.push("/book-sell")}
          buttonText="Sell Your First Book"
        />
      </div>
    );
  }

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price) {
      const discount = ((price - finalPrice) / price) * 100;
      return Math.round(discount);
    }
    return 0;
  };
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-9 py-8">
        <nav className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline font-bold text-primary">
            {""} {/*for gap*/}
            Home{""}
          </Link>
          <span>/</span>
          <Link
            href="/books"
            className="hover:underline font-medium text-primary"
          >
            Books
          </Link>
          <span>/</span>
          <span className="text-gray-600">{book.category}</span>
          <span>/</span>
          <span className="text-gray-600">{book.title}</span>
        </nav>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative h-[400px] overflow-hidden rounded-lg border bg-white shadow-md">
              <Image
                src={bookImage[selectedImage]}
                alt={book.title}
                fill
                className="object-contain"
              />
              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                <span
                  className="
                      absolute left-3 top-4             
                      transform -rotate-12
                      bg-gradient-to-r from-amber-500 to-orange-500
                      shadow-2xl
                      px-4 py-2
                      text-xs font-bold font-hanken-grotesk text-white
                      rounded-md
                      transition-transform duration-200 hover:scale-110
                      cursor-pointer"
                >
                  {calculateDiscount(book.price, book.finalPrice)}%Off
                </span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {bookImage.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border 
                    transition-all duration-300 ${selectedImage === index
                      ? "ring-2 ring-blue-500 scale-105"
                      : "hover:scale-105"
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${book.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/** Book Details Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Posted {formatDate(book.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <ShareButton
                  url={`${window.location.origin}/books/${book._id}`}
                  title={`Check out this book on Book Shop: ${book.title}`}
                  text={`I just found this book on Book Shop and I think you will love it!: ${book.title}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToWishlist(book._id)}
                >
                  <Heart
                    className={`size-5 mr-1 ${wishlist.some((w) => w.products.includes(book._id))
                      ? "fill-red-500"
                      : ""
                      }`}
                  />
                  <span className="hidden md:inline cursor-pointer">
                    {wishlist.some((w) => w.products.includes(book._id))
                      ? "Removed"
                      : "Add"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.finalPrice}
                </span>
                {book.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.price}
                  </span>
                )}
                <Badge variant="secondary" className="text-green-500 text-sm">
                  Delivery Available
                </Badge>
              </div>
              <Button
                className="w-60 py-6 font-hanken-grotesk font-bold text-base group bg-gradient-to-r from-indigo-400 to-indigo-700 hover:from-indigo-700 hover:to-indigo-400"
                onClick={handleAddToCart}
                disabled={isAddToCart}
              >
                {isAddToCart ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </>
                )}
              </Button>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    Book Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="font-medium text-muted-foreground">
                      Subtitle
                    </div>
                    <div>{book.subtitle || "N/A"}</div>
                    <div className="font-medium text-muted-foreground">
                      For class
                    </div>
                    <div>{book.classType}</div>
                    <div className="font-medium text-muted-foreground">
                      Book Type
                    </div>
                    <div>{book.category}</div>
                    <div className="font-medium text-muted-foreground">
                      Genre
                    </div>
                    <div>{book.genre}</div>
                    <div className="font-medium text-muted-foreground">
                      Writer
                    </div>
                    <div>{book.author}</div>
                    <div className="font-medium text-muted-foreground">
                      Book Condition
                    </div>
                    <div>{book.condition}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {book.aboutAuthor && (
                <div className="text-sm font-semibold text-gray-800">
                  {book.aboutAuthor}
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground whitespace-pre-wrap">
                {book.description}
              </p>
              <div className="border-t-2 pt-4">
                <h3 className="font-bold mb-2 text-md">Our Community</h3>
                <p className="text-muted-foreground text-sm">
                  Join our community of book lovers and share your thoughts on
                  this book!
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div>Ad Id: {book._id}</div>
                <div>Posted: {formatDate(book.createdAt)}</div>
              </div>
            </CardContent>
          </Card>

          {/* book seller details */}
          <Card className="border-none shadow-md h-[300px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Sold By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {book.seller ? (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                        {book.seller.profilePicture ? (
                          <Image
                            src={book.seller.profilePicture}
                            alt={book.seller.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User2 className="h-6 w-6 text-indigo-500" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {book.seller.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-green-500 p-3 py-1 border-dashed rounded-full border-green-600 bg-green-100 whitespace-nowrap text-[10px]"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {book.seller?.addresses?.[0].city
                            ? ` ${book.seller?.addresses?.[0].addressLine1}, 
                              ${book.seller?.addresses?.[0].state}, 
                              ${book.seller?.addresses?.[0].postalCode}
                            `
                            : "Location is Bangladesh, but not specified"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {book.seller.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Smartphone className="h-4 w-4 mr-1 text-indigo-600" />
                      <p className="text-sm">{book.seller.phoneNumber}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Seller information unavailable
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Working Proccess */}
        <section className="mt-16 mb-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block">
              How It Works
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Simple steps to buy or sell books
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3 pt-6">
            {[
              {
                step: "1",
                title: "Seller posts an Ad",
                description:
                  "Seller posts an ad on book kart to sell their used books.",
                image: { src: "/icons/ads.png", alt: "Post Ad" },
                color: "from-blue-500 to-indigo-600",
              },
              {
                step: "2",
                title: "Buyer Pays Online",
                description:
                  "Buyer makes an online payment to book kart to buy those books.",
                image: { src: "/icons/pay_online.png", alt: "Payment" },
                color: "from-indigo-500 to-purple-600",
              },
              {
                step: "3",
                title: "Seller ships the books",
                description: "Seller then ships the books to the buyer",
                image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
                color: "from-purple-500 to-pink-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white/20 backdrop-blur-sm rounded-2xl p-6 pt-12 shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.step}
                  </div>
                </div>
                <div className="space-y-4 text-center">
                  <div className="h-24 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed px-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
