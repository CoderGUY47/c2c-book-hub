"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { books } from "@/lib/Constant";

const MockBooksSection = () => {
    // Show top 4 books to fit the new 4-column grid
    const featuredBooks = books.slice(0, 4);

    return (
        <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
            <div className="container w-[90%] lg:w-[80%] mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-[1px] bg-indigo-500"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">
                                Curated Picks
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-langar text-zinc-950 leading-tight tracking-tight">
                            Best of <span className="text-indigo-600">Book-Hub.</span>
                        </h2>
                        <p className="mt-6 text-zinc-500 font-medium max-w-lg text-lg">
                            Hand-picked selections from our premium community collections.
                        </p>
                    </div>

                    <Link href="/mock-books">
                        <button className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors border-b border-transparent hover:border-zinc-950 pb-1 flex items-center gap-2">
                            SEE ALL <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {featuredBooks.map((book, index) => (
                        <div key={book._id} className="group flex flex-col">
                            {/* Image Canvas */}
                            <Link
                                href={`/mock-books/${book.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}`}
                                className="relative aspect-[3/4] mb-6 overflow-hidden bg-zinc-50 rounded-sm shadow-sm transition-all duration-500 group-hover:shadow-xl"
                            >
                                <Image
                                    src={book.images[0] || "/images/book-placeholder.jpg"}
                                    alt={book.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Link>

                            {/* Content */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-langar text-lg text-zinc-900 leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {book.title}
                                    </h3>
                                    <span className="font-bold text-zinc-950">
                                        ৳{book.finalPrice}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium">
                                    by: {book.author}
                                </p>

                                {/* Ratings */}
                                <div className="flex items-center gap-0.5 pt-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Add Button */}
                                <div className="pt-4 mt-auto">
                                    <button className="flex items-center justify-center gap-2 bg-zinc-950 text-white w-full py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 transform active:scale-95 shadow-lg group/btn">
                                        ADD <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MockBooksSection;
