"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { books, filters } from "@/lib/Constant";
import Link from "next/link";
import React, { useEffect, useState, Suspense } from "react";
import { formatDistanceToNow } from "date-fns";
import BookLoader from "@/lib/BookLoader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ghost, Heart, ShoppingCart, Share2 } from "lucide-react";
import Pagination from "../components/Pagination";
import NoData from "../components/NoData";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetProductsQuery,
  useAddToCartMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { Bookdetails } from "@/lib/types/type";
import DiscountBadge from "../components/DiscountBadge";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slice/cartSlice";
import Fuse from "fuse.js";
import { RootState } from "@/store/store";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/store/slice/wishlistSlice";
import { RWebShare } from "react-web-share";

const BooksContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const bookPerPage = 9;
  // const [isLoading, setIsLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const searchTerms = searchParams.get("search") || "";
  const { data: apiResponse, isLoading } = useGetProductsQuery();
  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [books, setBooks] = useState<Bookdetails[]>([]);

  useEffect(() => {
    if (apiResponse?.success) {
      setBooks(apiResponse.data);
    }
  }, [apiResponse]);

  const toggleFilter = (section: string, item: string) => {
    const updateFilter = (prev: string[]) => {
      return prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item];
    };
    switch (section) {
      case "condition":
        setSelectedCondition(updateFilter);
        break;
      case "classType":
        setSelectedType(updateFilter);
        break;
      case "category":
        setSelectedCategory(updateFilter);
        break;
      case "genre":
        setSelectedGenre(updateFilter);
        break;
      case "author":
        setSelectedAuthor(updateFilter);
        break;
      case "year":
        setSelectedYear(updateFilter);
        break;
    }
    setCurrentPage(1);
  };

  // Fuse.js configuration
  const fuseOptions = {
    keys: [
      { name: "title", weight: 0.6 },
      { name: "author", weight: 0.4 },
    ],
    threshold: 0.3, // 0.0 = perfect match, 1.0 = match anything
    includeScore: true,
  };

  // 1. First, Search (if applicable)
  let searchedBooks = books;
  if (searchTerms) {
    const fuse = new Fuse(books, fuseOptions);
    const result = fuse.search(searchTerms);
    searchedBooks = result.map((res) => res.item);
  }

  // 2. Then, Filter
  const filteredBooks = searchedBooks.filter((book) => {
    const conditionMatch =
      selectedCondition.length === 0 ||
      selectedCondition
        .map((cond) => cond.toLowerCase())
        .includes(book.condition.toLowerCase());
    const typeMatch =
      selectedType.length === 0 ||
      selectedType
        .map((cond) => cond.toLowerCase())
        .includes(book.classType.toLowerCase());
    const categoryMatch =
      selectedCategory.length === 0 ||
      selectedCategory
        .map((cond) => cond.toLowerCase())
        .includes(book.category.toLowerCase());
    const genreMatch =
      selectedGenre.length === 0 ||
      selectedGenre
        .map((cond) => cond.toLowerCase())
        .includes(book.genre?.toLowerCase() || "");

    const authorMatch =
      selectedAuthor.length === 0 ||
      selectedAuthor
        .map((cond) => cond.toLowerCase())
        .includes(book.author?.toLowerCase() || "");
    const yearMatch =
      selectedYear.length === 0 ||
      selectedYear
        .map((cond) => cond.toLowerCase())
        .includes(book.year?.toLowerCase() || "");

    return (
      conditionMatch &&
      typeMatch &&
      categoryMatch &&
      genreMatch &&
      authorMatch &&
      yearMatch
    );
  });

  // 3. Finally, Sort
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    // If searching and using default sort ('newest'), keep Fuse's relevance order
    // (Fuse returns most relevant first by default)
    if (searchTerms && sortOption === "newest") {
      return 0;
    }

    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-low":
        return a.finalPrice - b.finalPrice;
      case "price-high":
        return b.finalPrice - a.finalPrice;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedBooks.length / bookPerPage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * bookPerPage,
    currentPage * bookPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const handleAddToWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId)
      );
      if (isWishlist) {
        const result = await removeFromWishlistMutation({ productId }).unwrap();
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <div className="container w-[80%] mx-auto px-4 py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-medium font-poppins">Books</span>
        </nav>

        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-12 w-3/4 bg-slate-800/50 rounded-xl" />
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-32 shrink-0 bg-slate-800/50 rounded-full" />
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[450px] w-full bg-slate-800/50 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black font-poppins text-white tracking-tight">
                  Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Used Book</span>
                </h1>
                <p className="text-slate-400 font-medium text-lg">Collection of over 100+ used books</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white uppercase tracking-widest hidden sm:block">Sort By</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[220px] h-12 bg-slate-800/40 border-0 text-white rounded-xl font-poppins font-bold focus:ring-0 hover:bg-slate-800/0 transition-all">
                    <SelectValue placeholder="Latest Arrival" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800/70 border-slate-700/40 border-0 text-white font-poppins">
                    <SelectItem value="newest">Latest Arrival</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Premium Horizontal Filter Bar */}
            <div className="sticky top-[0px] z-40 py-2 -mx-4 px-4 bg-transparen shadow-2xl">
              <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg shrink-0">
                  <Ghost className="size-6 text-indigo-500" />
                </div>
                {Object.entries(filters).map(([key, values]) => {
                  const activeCount =
                    key === "condition" ? selectedCondition.length :
                      key === "classType" ? selectedType.length :
                        key === "category" ? selectedCategory.length :
                          key === "genre" ? selectedGenre.length :
                            key === "author" ? selectedAuthor.length :
                              key === "year" ? selectedYear.length : 0;

                  return (
                    <Select key={key}>
                      <SelectTrigger className={`h-10 px-5 min-w-max rounded-xl border-white font-bold text-xs uppercase tracking-widest transition-all text-white
                        ${activeCount > 0
                          ? "bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                          : "bg-slate-800/40 hover:bg-slate-700/40 border-transparent"}
                      `}>
                        <div className="flex items-center gap-3">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          {activeCount > 0 && (
                            <Badge className="bg-indigo-500 text-white border-0 text-[10px] h-4.5 min-w-[18px] flex items-center justify-center px-1 font-black">
                              {activeCount}
                            </Badge>
                          )}
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900/95 border-0 text-slate-500 font-poppins min-w-[220px] shadow-2xl">
                        <div className="p-2 space-y-1">
                          {values.map((value) => (
                            <div key={value} className="flex items-center gap-3 p-2.5 hover:bg-white rounded-xl cursor-pointer transition-colors" onClick={() => toggleFilter(key, value)}>
                              <Checkbox
                                id={`${key}-${value}`}
                                checked={
                                  key === "condition" ? selectedCondition.includes(value) :
                                    key === "classType" ? selectedType.includes(value) :
                                      key === "category" ? selectedCategory.includes(value) :
                                        key === "genre" ? selectedGenre.includes(value) :
                                          key === "author" ? selectedAuthor.includes(value) :
                                            key === "year" ? selectedYear.includes(value) : false
                                }
                                className="border-slate-700 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                onCheckedChange={() => { }} // Controlled by div onClick
                              />
                              <Label htmlFor={`${key}-${value}`} className="text-sm font-bold cursor-pointer flex-1 tracking-wide text-white">{value}</Label>
                            </div>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  );
                })}
                {(selectedCondition.length > 0 || selectedType.length > 0 || selectedCategory.length > 0 || selectedGenre.length > 0 || selectedAuthor.length > 0 || selectedYear.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCondition([]); setSelectedType([]); setSelectedCategory([]);
                      setSelectedGenre([]); setSelectedAuthor([]); setSelectedYear([]);
                    }}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold text-xs uppercase tracking-tighter transition-all rounded-xl"
                  >
                    Reset All
                  </Button>
                )}
              </div>
            </div>

            <div className="w-full">
              {paginatedBooks.length ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedBooks.map((book) => (
                      <motion.div
                        key={book._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Card className="group relative h-[500px] py-0 gap-2 bg-gradient-to-tl from-[#1e293b]/80 via-[#0f172a]/90 to-[#1e293b]/80 border-0 rounded-3xl overflow-hidden shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group">
                          {/* Book Cover Container */}
                          <div className="relative -mt-0 p-4 h-[400px] w-full bg-gray-600/60 flex items-center justify-center overflow-hidden">
                            <Link className="relative z-10 block h-full w-full" href={`/books/${book.title?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").concat("-", book._id)}`}>
                              <Image
                                src={book.images[0]}
                                alt={book.title}
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-700 ease-out"
                              />
                            </Link>

                            {/* Interactive Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tl from-[#0f172a] to-transparent opacity-60 pointer-events-none" />

                            {/* Status Badges */}
                            <div className="absolute top-6 left-6 z-30">
                              <Badge className="bg-slate-900/80 backdrop-blur-xl text-indigo-400 border border-indigo-500/20 font-black text-[9px] uppercase tracking-widest py-1 px-3">
                                {book.condition}
                              </Badge>
                            </div>

                            {/* Discount Badge - Right Side */}
                            <div className="absolute top-6 right-6 z-30">
                              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                <DiscountBadge
                                  discount={calculateDiscount(book.price, book.finalPrice)}
                                  className="bg-gradient-to-tl from-orange-600 to-amber-500 text-white font-black text-[10px] px-2 py-1.5 rounded-lg uppercase shadow-xl border border-white/10"
                                />
                              )}
                            </div>

                            {/* Quick Actions Overlay */}
                            <div className="absolute inset-0 bg-[#0f172a]/80 rounded-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-5 z-40">
                              <Button
                                size="icon"
                                onClick={(e) => handleAddToCart(e, book)}
                                className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-amber-500/20 text-white hover:text-amber-400 border border-white/10 shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-75 hover:scale-105"
                              >
                                <ShoppingCart className="size-7" />
                              </Button>
                              <Button
                                size="icon"
                                onClick={(e) => handleAddToWishlist(e, book._id)}
                                className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-75 hover:scale-105"
                              >
                                <Heart className={`size-7 ${wishlist.some((w) => w.products.includes(book._id)) ? "fill-rose-500 text-rose-500" : ""}`} />
                              </Button>
                              <RWebShare
                                data={{
                                  text: `I just found this book on Book Hub and I think you will love it!: ${book.title}`,
                                  title: `Check out this book on Book Hub: ${book.title}`,
                                  url: `${typeof window !== 'undefined' ? window.location.origin : ''}/books/${book.title?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").concat("-", book._id)}`,
                                }}
                                onClick={() => console.log("Shared successfully clicked")}
                              >
                                <Button
                                  size="icon"
                                  className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-indigo-500/20 text-white hover:text-indigo-400 border border-white/10 shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-150 hover:scale-110"
                                >
                                  <Share2 className="size-7" />
                                </Button>
                              </RWebShare>
                            </div>
                          </div>

                          <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                              <Link href={`/books/${book.title?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").concat("-", book._id)}`}>
                                <h3 className="text-[18px] -mt-1 mb-4 font-black text-white font-poppins line-clamp-2 h-[50px] group-hover:text-indigo-400 transition-colors">
                                  {book.title}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-2 ">
                                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5 font-bold uppercase py-0">{book.genre || "Fiction"}</Badge>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{book.author}</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-1 h-4 font-medium leading-relaxed opacity-70">
                              {book.subtitle || "Exploring the depths of literature with this carefully preserved edition."}
                            </p>

                            <div className="flex items-center bg-white/5 p-4 rounded-2xl border border-white/5 mt-auto">
                              <div className="flex-1">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Selling Price</span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-black text-white tracking-tighter">
                                    ৳{book.finalPrice}
                                  </span>
                                  {book.price && book.price > book.finalPrice && (
                                    <span className="text-xs text-slate-500 line-through font-bold opacity-60">
                                      ৳{book.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="h-12 w-px bg-white/10 mx-6" />
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Published</span>
                                <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">{book.year || "2024"}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center pb-12 pt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-32 bg-slate-900/50 rounded-[3rem] border border-white/5 backdrop-blur-2xl flex flex-col items-center justify-center text-center px-6">
                  <div className="h-24 w-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                    <Ghost className="size-12 text-indigo-400 animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-3 font-poppins">No Books Found</h2>
                  <p className="text-slate-400 max-w-md mx-auto mb-10 font-medium font-poppins">We couldn't find any books matching your specific filters. Try expanding your search or resetting all filters.</p>
                  <Button
                    onClick={() => {
                      setSelectedCondition([]); setSelectedType([]); setSelectedCategory([]);
                      setSelectedGenre([]); setSelectedAuthor([]); setSelectedYear([]);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 h-14 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all uppercase tracking-widest"
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const page = () => {
  return (
    <Suspense fallback={<BookLoader />}>
      <BooksContent />
    </Suspense>
  );
};

export default page;
