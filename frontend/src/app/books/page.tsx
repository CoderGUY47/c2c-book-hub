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
import { Ghost, Heart, ShoppingCart, Share2, ChevronDown } from "lucide-react";
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
import { toast } from 'react-toastify';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const bookPerPage = 9;

  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || null;
  const searchTerms = searchParams?.get("search") || "";
  const { data: apiResponse, isLoading } = useGetProductsQuery();
  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [books, setBooks] = useState<Bookdetails[]>([]);

  const user = useSelector((state: RootState) => state.user.user);


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

  const fuseOptions = {
    keys: [
      { name: "title", weight: 0.6 },
      { name: "author", weight: 0.4 },
    ],
    threshold: 0.3,
    includeScore: true,
  };

  let searchedBooks = books;
  if (searchTerms) {
    const fuse = new Fuse(books, fuseOptions);
    const result = fuse.search(searchTerms);
    searchedBooks = result.map((res) => res.item);
  }

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
        .some((g) => {
          if (!book.genre) return false;
          const bookGenres = book.genre.toLowerCase().split(",").map(item => item.trim());
          return bookGenres.includes(g);
        });

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

  const sortedBooks = [...filteredBooks].sort((a, b) => {
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
    <div className="min-h-screen bg-gray-950 text-slate-200 relative overflow-hidden">
      <div className="container w-[80%] mx-auto px-4 py-8 relative z-10">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-white font-medium font-poppins">Books</span>
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
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl md:text-6xl font-bold font-langar text-white tracking-tight"
                >
                  Premium <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-purple-400 drop-shadow-sm">Used Book</span>
                </motion.h1>
                <p className="text-slate-400 font-medium text-lg flex items-center gap-2">
                  <span className="w-8 h-[1.75px] bg-indigo-500/50" />
                  Collection of over {books.length * 100}+ old titles
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Sort By</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[220px] h-12 bg-slate-900/40 backdrop-blur-md border border-white/5 text-white rounded-xl font-poppins font-bold focus:ring-2 focus:ring-indigo-500/20 hover:bg-slate-800 transition-all shadow-xl">
                    <SelectValue placeholder="Latest Arrival" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 backdrop-blur-xl border-white/10 text-white font-poppins">
                    <SelectItem value="newest">Latest Arrival</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Premium Horizontal Filter Bar */}
            <div className="sticky top-4 z-40 py-4 -mx-4 px-4">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar p-2 bg-white/10 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-2xl">
                <div className="p-2.5 bg-white rounded-lg shrink-0 shadow-lg shadow-indigo-500/10">
                  <Ghost className="size-6 text-indigo-600" />
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
                      <SelectTrigger className={`h-11 px-6 min-w-max rounded-xl border-white/5 font-bold text-xs uppercase tracking-widest transition-all
                        ${activeCount > 0
                          ? "bg-indigo-600/30 border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.3)] text-indigo-400"
                          : "bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border-transparent"}
                      `}>
                        <div className="flex items-center gap-3">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          <div className="flex items-center gap-1.5 ml-auto">
                            {activeCount > 0 && (
                              <Badge className="bg-indigo-500 text-white border-0 text-[10px] h-5 min-w-[20px] flex items-center justify-center px-1 font-bold rounded-full">
                                {activeCount}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 opacity-50" />
                          </div>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900/98 backdrop-blur-2xl border-white/10 text-white font-poppins min-w-[240px] shadow-2xl rounded-2xl">
                        <div className="p-3 space-y-2">
                          {values.map((value) => (
                            <div key={value} className="flex items-center gap-3 p-3 hover:bg-indigo-500/10 rounded-xl cursor-pointer transition-all group/item" onClick={() => toggleFilter(key, value)}>
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
                                className="border-slate-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 transition-colors"
                                onCheckedChange={() => { }}
                              />
                              <Label htmlFor={`${key}-${value}`} className="text-sm font-bold cursor-pointer flex-1 tracking-wide group-hover/item:text-indigo-400 transition-colors">{value}</Label>
                            </div>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  );
                })}
                {(selectedCondition.length > 0 || selectedType.length > 0 || selectedCategory.length > 0 || selectedGenre.length > 0 || selectedAuthor.length > 0 || selectedYear.length > 0) && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedCondition([]); setSelectedType([]); setSelectedCategory([]);
                      setSelectedGenre([]); setSelectedAuthor([]); setSelectedYear([]);
                    }}
                    className="text-rose-400 hover:text-white hover:bg-rose-500/20 font-bold text-xs uppercase tracking-widest transition-all rounded-xl border border-rose-500/20 px-6 h-11"
                  >
                    Reset All
                  </Button>
                )}
              </div>
            </div>

            <div className="w-full">
              {paginatedBooks.length ? (
                <div className="space-y-12">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {paginatedBooks.map((book) => (
                      <motion.div
                        key={book._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Card className="group relative h-[520px] py-0 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30 transition-all duration-700">
                          {/* Inner Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                          {/* Book Cover Container */}
                          <div className="relative h-[380px] w-full bg-slate-950/20 flex items-center justify-center overflow-hidden">
                            <Link className="relative z-10 block h-full w-full p-8" href={`/books/${book.title ? book.title.toLowerCase().trim().replace(/[#?&/\\=+~`$^*()\[\]{}|:;"'<>,.!?]/g, "").replace(/[\s_-]+/g, "-") : book._id}`}>
                              <div className="relative h-full w-full transform group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                                <Image
                                  src={book.images[0]}
                                  alt={book.title}
                                  fill
                                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                />
                              </div>
                            </Link>

                            {/* Decorative Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-tl from-slate-900/80 to-transparent pointer-events-none" />

                            {/* Status Badges */}
                            <div className="absolute top-8 left-8 z-30">
                              <Badge className="bg-slate-900/60 backdrop-blur-md rounded-full text-indigo-400 border border-indigo-500/50 font-bold text-[10px] uppercase tracking-widest py-1.5 px-4 shadow-xl">
                                {book.condition}
                              </Badge>
                            </div>

                            {/* Discount Badge */}
                            <div className="absolute top-8 right-8 z-30">
                              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                <div className="bg-gradient-to-tl from-orange-500 to-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase shadow-xl border-0 animate-bounce-slow">
                                  {calculateDiscount(book.price, book.finalPrice)}% OFF
                                </div>
                              )}
                            </div>

                            {/* Premium Quick Actions */}
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 z-40 px-6">
                              <motion.div whileHover={{ y: -0 }} className="flex gap-4">
                                <Button
                                  size="icon"
                                  onClick={(e) => handleAddToCart(e, book)}
                                  className="h-12 w-12 rounded-xl bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30 hover:text-indigo-600 border-0 hover:border-0 transition-all"
                                >
                                  <ShoppingCart className="size-6" />
                                </Button>
                                <Button
                                  size="icon"
                                  onClick={(e) => handleAddToWishlist(e, book._id)}
                                  className={`h-12 w-12 rounded-xl bg-red-500/20 backdrop-blur-md text-red-500 hover:bg-red-500 border-0 hover:border-0  hover:text-red-600 transition-all
                                    ${wishlist.some((w) => w.products.includes(book._id)) ? "text-rose-500 bg-rose-500/10 border-0" : "hover:bg-rose-500/20 hover:text-rose-400 hover:border-0"}
                                  `}
                                >
                                  <Heart className={`size-6 ${wishlist.some((w) => w.products.includes(book._id)) ? "fill-rose-500" : ""}`} />
                                </Button>
                                {isMounted ? (
                                  <RWebShare
                                    data={{
                                      text: `Check out this amazing book I patterns found on Book-Hub!`,
                                      title: book.title,
                                      url: `${window.location.origin}/books/${book.title ? book.title.toLowerCase().trim().replace(/[#?&/\\=+~`$^*()\[\]{}|:;"'<>,.!?]/g, "").replace(/[\s_-]+/g, "-") : book._id}`,
                                    }}
                                  >
                                    <Button
                                      size="icon"
                                      className="h-12 w-12 rounded-xl bg-amber-500/20 backdrop-blur-md text-amber-600 border-0 shadow-xl hover:bg-amber-500/20 hover:border-0 hover:text-amber-500 transition-all"
                                    >
                                      <Share2 className="size-6" />
                                    </Button>
                                  </RWebShare>
                                ) : (
                                  <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-xl bg-amber-500/20 backdrop-blur-md text-amber-600 border-0 shadow-xl"
                                  >
                                    <Share2 className="size-6" />
                                  </Button>
                                )}
                              </motion.div>
                            </div>
                          </div>

                          <CardContent className="p-6 space-y-4 relative bg-transparent">
                            <div className="space-y-2">
                              <Link href={`/books/${book.title ? book.title.toLowerCase().trim().replace(/[#?&/\\=+~`$^*()\[\]{}|:;"'<>,.!?]/g, "").replace(/[\s_-]+/g, "-") : book._id}`}>
                                <h3 className="h-12 -mt-8 mb-1.5 text-lg font-bold text-indigo-500 font-poppins line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                                  {book.title}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{book.author}</span>
                                <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                <Badge variant="outline" className="text-[10px] border-indigo-500/20 text-indigo-400 bg-indigo-500/5 font-bold uppercase py-0.5 px-2">
                                  {book.genre || "No Genre"}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t-1 border-white/5">
                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Price</span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-bold text-white tracking-tight">
                                    <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.finalPrice}
                                  </span>
                                  {book.price && book.price > book.finalPrice && (
                                    <span className="text-sm text-slate-400 line-through font-bold opacity-80">
                                      <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Edition</span>
                                <span className="text-xs font-bold text-slate-200 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                  {book.year || "2024"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center pb-12 pt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-32 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-50" />
                  <div className="relative z-10">
                    <div className="h-28 w-28 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-indigo-500/10">
                      <Ghost className="size-14 text-indigo-400 animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 font-langar">No Treasures Found</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-10 font-medium text-lg leading-relaxed">
                      Your filters are a bit too specific! Try expanding your horizons or resetting everything to see the full collection.
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedCondition([]); setSelectedType([]); setSelectedCategory([]);
                        setSelectedGenre([]); setSelectedAuthor([]); setSelectedYear([]);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-12 h-16 rounded-[1.2rem] shadow-2xl shadow-indigo-500/30 transition-all uppercase tracking-widest text-sm"
                    >
                      Browse All Books
                    </Button>
                  </div>
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
