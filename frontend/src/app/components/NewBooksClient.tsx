"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
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
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { useAddToCartMutation } from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { BiCollection } from "react-icons/bi";

interface NewBooksClientProps {
  books: Bookdetails[];
}

const NewBooksClient = ({ books }: NewBooksClientProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addToCartMutation] = useAddToCartMutation();
  const [currentBookSlide, setCurrentBookSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Touch swipe refs
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Responsive: 1 card per slide on mobile, 3 on desktop
  const booksPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(Math.min(books.length, 9) / booksPerSlide);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCurrentBookSlide(0); // reset on resize
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-advance slide
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentBookSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  const nextSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1) % totalSlides);
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
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
    <section className="py-14 bg-white relative overflow-hidden">
      <div className="w-full md:w-[80%] mx-auto px-4 md:px-4 pt-6 relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[1px] bg-indigo-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">
              Fresh Additions
            </span>
            <span className="w-8 h-[1px] bg-indigo-500"></span>
          </div>
          <h2 className="text-5xl md:text-6xl font-langar font-bold text-black text-center tracking-tight">
            Newly Arrived
          </h2>
        </div>
        <div className="relative group">
          {books && books.length > 0 ? (
            <>
              {/* Slider track — touch events attached here */}
              <div
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentBookSlide * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-none py-7">
                      <div className="flex flex-row gap-4 md:gap-6">
                        {books
                          .slice(
                            slideIndex * booksPerSlide,
                            slideIndex * booksPerSlide + booksPerSlide
                          )
                          .map((book) => (
                            <Card
                              key={book._id}
                              className="group relative h-[420px] md:h-[450px] flex-1 min-w-0 border-0 shadow-none bg-transparent transition-all duration-700 active:scale-[0.98]"
                            >
                              <CardContent className="p-0 h-full relative flex flex-col justify-end">
                                <Link
                                  href={`/books/${
                                    book.title
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

                                {/* Image Canvas */}
                                <div className="absolute top-0 inset-x-0 h-[300px] md:h-[320px] rounded-2xl bg-black/40 border border-white/5 overflow-hidden pointer-events-none group-hover:bg-black/40 transition-all duration-700">
                                  <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
                                  <Image
                                    src={book.images[0]}
                                    alt={book.title}
                                    width={300}
                                    height={400}
                                    className="absolute inset-0 m-auto h-[82%] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:scale-105 group-hover:-rotate-2"
                                    loading="lazy"
                                  />
                                </div>

                                {/* Wishlist Icon */}
                                <button className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/40 hover:text-rose-500 hover:bg-white transition-all duration-300 transform translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 border border-white/5">
                                  <Heart className="h-4 w-4 fill-current" />
                                </button>

                                {/* Content Box */}
                                <div className="relative z-10 mx-2 md:mx-3 mb-3 p-4 md:p-6 rounded-2xl bg-zinc-950/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,1)] transition-all duration-500 group-hover:bg-black group-hover:-translate-y-2 pointer-events-none ring-1 ring-white/5">
                                  <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black tracking-[0.3em] text-indigo-400 uppercase">
                                      {book.condition}
                                    </span>
                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice
                                    ) > 0 && (
                                      <span className="text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                                        -
                                        {calculateDiscount(
                                          book.price,
                                          book.finalPrice
                                        )}
                                        %
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="font-langar text-white text-base md:text-lg leading-tight line-clamp-1 mb-1 tracking-tight">
                                    {book.title}
                                  </h3>
                                  <p className="text-[11px] text-white/30 mb-3 md:mb-4 line-clamp-1 font-normal uppercase tracking-widest">
                                    {book.subtitle || "Literary Collection"}
                                  </p>

                                  <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-normal text-white/50 line-through">
                                        <i className="fa-solid fa-bangladeshi-taka-sign mr-1"></i>
                                        {book.price}
                                      </span>
                                      <span className="text-xl font-normal text-white tracking-tighter">
                                        <i className="fa-solid fa-bangladeshi-taka-sign mr-1"></i>
                                        {book.finalPrice}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 relative z-30 pointer-events-auto">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 px-3 md:px-4 rounded-full border border-white/10 bg-transparent text-white/60 hover:bg-white hover:text-black hover:border-white flex items-center gap-2 text-[10px] font-black uppercase tracking-wider transition-all duration-500"
                                        onClick={(e) =>
                                          handleGoToDetails(e, book)
                                        }
                                      >
                                        Details
                                        <ArrowRight className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        className="w-9 h-9 p-0 rounded-full bg-indigo-600 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all duration-500 shadow-xl active:scale-95 border-0"
                                        onClick={(e) =>
                                          handleAddToCart(e, book)
                                        }
                                      >
                                        <ShoppingCart className="h-3.5 w-3.5" />
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

              {/* Arrows — hidden on mobile, visible on md+ */}
              <button
                className="hidden md:flex items-center justify-center absolute left-0 top-[50%] -translate-y-[calc(50%+20px)] -translate-x-5 z-20 w-10 h-24 bg-black/10 backdrop-blur-2xl border border-black/10 rounded-2xl shadow-xl group/nav hover:bg-black/20 hover:border-black/20 transition-all duration-500"
                onClick={prevSlide}
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-6 w-6 text-black/40 group-hover/nav:text-black group-hover/nav:scale-110 transition-all" />
              </button>
              <button
                className="hidden md:flex items-center justify-center absolute right-0 top-[50%] -translate-y-[calc(50%+20px)] translate-x-5 z-20 w-10 h-24 bg-black/10 backdrop-blur-2xl border border-black/10 rounded-2xl shadow-xl group/nav hover:bg-black/20 hover:border-black/20 transition-all duration-500"
                onClick={nextSlide}
                aria-label="Next Slide"
              >
                <ChevronRight className="h-6 w-6 text-black/40 group-hover/nav:text-black group-hover/nav:scale-110 transition-all" />
              </button>

              {/* Dot indicators */}
              <div className="flex mt-2 justify-center space-x-3">
                {Array.from({ length: totalSlides }).map((_, dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentBookSlide(dot)}
                    className={`transition-all duration-500 border border-white/10 ${
                      currentBookSlide === dot
                        ? "h-2 w-8 bg-indigo-500 rounded-full"
                        : "h-2 w-2 bg-white/10 rounded-full hover:bg-white/20"
                    }`}
                    aria-label={`Slide ${dot + 1}`}
                  ></button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No Books to show.</p>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-7 mb-20 relative z-10">
        <Link href="/books">
          <Button className="ripple-button inline-flex items-center justify-between bg-purple-600 text-md font-bold p-6 text-white border-0 rounded-full tracking-wider overflow-hidden transition-all cursor-pointer">
            <i className="animation"></i>
            Go to Books Collection <BiCollection className="ml-2 size-5" />
            <i className="animation"></i>
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default NewBooksClient;
