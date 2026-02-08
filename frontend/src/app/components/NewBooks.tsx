"use client";
import { Card, CardContent } from "@/components/ui/card";
import { books as mockBooks } from "@/lib/Constant";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DiscountBadge from "./DiscountBadge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { Bookdetails } from "@/lib/types/type";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  useAddToCartMutation,
  useGetProductsQuery,
} from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { BiCollection } from "react-icons/bi";

const NewBooks = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addToCartMutation] = useAddToCartMutation();
  const [currentBookSlide, setCurrentBookSlide] = useState(0);
  const { data: apiResponse, isLoading } = useGetProductsQuery();
  const [books, setBooks] = useState<Bookdetails[]>([]);

  useEffect(() => {
    if (apiResponse?.success) {
      setBooks(apiResponse.data);
    }
  }, [apiResponse]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % 3);
    }, 7000); // Change image every 7 seconds
    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  const prevSlide = () => {
    setCurrentBookSlide((prev) => (prev - 1 + 3) % 3); // Loop back to last slide
  };
  const nextSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1) % 3); // Loop back to first slide
  };

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price) {
      const discount = ((price - finalPrice) / price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const handleAddToCart = async (e: React.MouseEvent, book: Bookdetails) => {
    e.preventDefault();
    e.stopPropagation();
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
      const errorMessage = error?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const handleGoToDetails = (e: React.MouseEvent, book: Bookdetails) => {
    e.preventDefault();
    e.stopPropagation();
    const bookSlug = book.title
      ? book.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
      : book._id;
    router.push(`/books/${bookSlug}`);
  };

  return (
    <section className="py-20 pb-10 bg-gray-950 relative overflow-hidden">
      <div className="w-[80%] mx-auto px-4 pt-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-poppins font-black text-white text-center mb-12 tracking-tighter">
          Newly<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">ARRIVED.</span>
        </h2>
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-7">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-[1.5rem] bg-white p-6 shadow-md">
                  <Skeleton className="h-[320px] w-full rounded-[2rem] bg-gray-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-200" />
                    <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentBookSlide * 100}%)`,
                  }}
                >
                  {Array.from({ length: 3 }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-none py-7">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {books
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((book, idx) => (
                            <Card
                              key={book._id}
                              className="group relative h-[450px] w-full border-0 shadow-none bg-transparent transition-all duration-700 "
                            >
                              <CardContent className="p-0 h-full relative flex flex-col justify-end">
                                <Link
                                  href={`/books/${book.title
                                    ? book.title
                                      .toLowerCase()
                                      .trim()
                                      .replace(/[^\w\s-]/g, "")
                                      .replace(/[\s_-]+/g, "-")
                                    : book._id
                                    }`}
                                  className="absolute inset-0 z-0"
                                >
                                  <span className="sr-only">
                                    View {book.title} Details
                                  </span>
                                </Link>

                                {/* 1. The Image Canvas: Uses a soft glow and larger scale */}
                                <div className="absolute top-0 inset-x-0 h-[320px] rounded-[2rem] bg-gradient-to-b from-slate-50 to-slate-200 overflow-hidden pointer-events-none">
                                  {/* Background Decorative Element */}
                                  <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-200/30 blur-3xl rounded-full group-hover:bg-indigo-300/50 transition-colors duration-700" />

                                  <Image
                                    src={book.images[0]}
                                    alt={book.title}
                                    width={300}
                                    height={400}
                                    className="absolute inset-0 m-auto h-[85%] w-auto object-contain drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3"
                                  />
                                </div>

                                {/* Wishlist Icon - Minimalist Style */}
                                <button className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-all duration-300 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                  <Heart className="h-5 w-5 fill-current" />
                                </button>

                                {/* 2. The Content Box: High-end Glassmorphism */}
                                <div className="relative z-10 mx-4 mb-4 p-6 rounded-[1.5rem] bg-white/70 backdrop-blur-2xl border-[1.5px] border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-500 group-hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] group-hover:-translate-y-2 pointer-events-none">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 uppercase">
                                      {book.condition}
                                    </span>
                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice
                                    ) > 0 && (
                                        <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                                          -
                                          {calculateDiscount(
                                            book.price,
                                            book.finalPrice
                                          )}
                                          %
                                        </span>
                                      )}
                                  </div>

                                  <h3 className="font-black font-poppins text-gray-800 text-lg leading-tight line-clamp-1 mb-1">
                                    {book.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 mb-4 line-clamp-1 font-bold font-hanken-grotesk">
                                    {book.subtitle || "Literary Collection"}
                                  </p>

                                  <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-gray-400 line-through decoration-rose-300">
                                        <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.price}
                                      </span>
                                      <span className="text-xl font-hanken-grotesk font-black text-zinc-800 tracking-tight">
                                        <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.finalPrice}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 relative z-30 pointer-events-auto">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-10 px-4 rounded-full border-0 text-zinc-700 hover:bg-gray-200/30 hover:text-zinc-900 flex items-center gap-2 text-xs font-black transition-all duration-300"
                                        onClick={(e) =>
                                          handleGoToDetails(e, book)
                                        }
                                      >
                                        Go here
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        className="w-10 h-10 p-0 rounded-full bg-zinc-900 border border-red-500 text-white hover:bg-zinc-800 flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
                                        onClick={(e) =>
                                          handleAddToCart(e, book)
                                        }
                                      >
                                        <ShoppingCart className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/*scroll button*/}
              <button
                className="absolute -mt-20 w-10 h-24 left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full shadow-md"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute -mt-20 w-10 h-24 right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full shadow-md"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* dot design */}
              <div className="flex mt-2 justify-center space-x-2">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentBookSlide(dot)}
                    className={`h-3 w-3 rounded-full ${currentBookSlide === dot ? "bg-purple-500" : "bg-gray-300"
                      }`}
                  ></button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-gray-500">No Books to show.</p>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-7 mb-20">
        <Link href="/books">
          <Button className="ripple-button inline-flex items-center justify-between bg-purple-600 text-md font-bold p-6 text-white border-0 rounded-full tracking-wider overflow-hidden transition-all cursor-pointer">
            <i className="animation"></i>
            Go to Books Collection <BiCollection className="size-5" />
            <i className="animation"></i>
          </Button>
        </Link>
      </div>

      {/* Background decorative elements - Dark theme */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-40 right-95 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
    </section>
  );
};

export default NewBooks;
