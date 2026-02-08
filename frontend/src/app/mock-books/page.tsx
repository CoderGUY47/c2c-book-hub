"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Sparkles, Home } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { books } from "@/lib/Constant";

const MockBooksPage = () => {
    // Show all 10 mock books in a premium grid
    const featuredBooks = books.slice(0, 10);

    return (
        <div className="min-h-screen bg-white">
            {/* Premium Header */}
            <div className="relative py-24 bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                <div className="container w-[80%] mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                            <Home className="w-5 h-5" />
                        </Link>
                        <span className="text-zinc-600 text-sm">/</span>
                        <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Collection</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black font-poppins text-white leading-tight mb-6">
                            CURATED <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">CLASSICS.</span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                            Discover our hand-picked collection of premium community-shared books. Each title is selected for its exceptional quality and cultural impact.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Books Grid */}
            <section className="py-20 bg-white relative z-20 -mt-10 rounded-t-[3rem]">
                <div className="container w-[80%] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredBooks.map((book, index) => (
                            <motion.div
                                key={book._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                            >
                                <Card className="group relative bg-white border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden h-[480px] flex flex-col p-0 gap-0">
                                    {/* Top: Image Area */}
                                    <div className="relative h-[290px] w-full bg-zinc-50 p-10 flex items-center justify-center overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center backdrop-blur-[2px]">
                                            <Link
                                                href={`/mock-books/${book.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}`}
                                                className="bg-white text-zinc-900 px-8 py-3 rounded-full font-black text-xs hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 shadow-xl"
                                            >
                                                EXPLORE DETAILS
                                            </Link>
                                        </div>

                                        <div className="relative w-full h-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700">
                                            <Image
                                                src={book.images[0] || "/images/book-placeholder.jpg"}
                                                alt={book.title}
                                                fill
                                                className="object-contain p-2 bg-white"
                                            />
                                        </div>

                                        <div className="absolute top-6 right-6 z-20 flex flex-col gap-3 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-500 shadow-xl hover:scale-110 active:scale-95 transition-all outline-none">
                                                <Heart className="w-5 h-5 fill-current" />
                                            </button>
                                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-400 hover:text-indigo-600 shadow-xl hover:scale-110 active:scale-95 transition-all outline-none">
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-6 left-6 z-20">
                                            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase shadow-md tracking-tighter">
                                                {book.genre}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom: Content Area */}
                                    <CardHeader className="px-6 pt-2 pb-2 space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-6 h-[1px] bg-indigo-200" />
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                                                {book.author}
                                            </p>
                                        </div>
                                        <CardTitle className="text-2xl font-black text-zinc-900 leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                            {book.title}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-medium -pt-4 ">
                                            {book.description || "A masterfully curated selection for our community."}
                                        </CardDescription>
                                    </CardHeader>

                                    {/* <CardContent className="px-8 pb-0 flex-grow" /> */}

                                    <CardFooter className="px-6 pb-2 -pt-2 mt-3 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-400 line-through leading-none mb-1">৳{book.price}</span>
                                            <span className="text-xl font-black text-zinc-900 tracking-tighter leading-none">৳{book.finalPrice}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 rounded-xl text-yellow-700">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-xs font-black italic">4.9</span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <div className="py-20 bg-zinc-50">
                <div className="container w-[80%] mx-auto px-4 text-center">
                    <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-8 opacity-20" />
                    <h2 className="text-3xl font-black text-zinc-800 mb-6">More coming soon...</h2>
                    <p className="text-zinc-500 max-w-xl mx-auto font-medium">
                        Our curators are constantly searching for new premium additions to this collection. Stay tuned for more hidden gems.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MockBooksPage;