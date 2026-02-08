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
    // Show top 3 mock books in a premium grid
    const featuredBooks = books.slice(0, 3);

    return (
        <section className="py-24 bg-gray-950 relative overflow-hidden border-t border-white/5">
            {/* Background Accents - Dark Theme */}
            <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-0 -translate-x-1/2 translate-y-1/2" />

            <div className="container w-[80%] mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-indigo-400 fill-current" />
                            <span className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Curated Picks</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black font-poppins text-white leading-tight uppercase tracking-tighter">
                            BEST OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">BOOK-SHOP.</span>
                        </h2>
                        <p className="mt-4 text-gray-400 font-medium max-w-lg">
                            Hand-picked selections from our premium community collections. Quality inspected and ready for a new home.
                        </p>
                    </div>

                    <Link href="/mock-books">
                        <Button variant="ghost" className="group rounded-full px-8 py-6 font-bold text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all">
                            VIEW FULL COLLECTION <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featuredBooks.map((book, index) => (
                        <motion.div
                            key={book._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Card className="group relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-indigo-500/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden h-[500px] flex flex-col p-0 gap-0">
                                {/* Top: Image Area */}
                                <div className="relative h-[300px] w-full bg-white/5 p-10 flex items-center justify-center overflow-hidden shrink-0">
                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 flex items-center justify-center backdrop-blur-[4px]">
                                        <Link
                                            href={`/mock-books/${book.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}`}
                                            className="bg-white text-gray-950 px-8 py-3 rounded-full font-black text-xs hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl tracking-widest uppercase"
                                        >
                                            QUICK VIEW
                                        </Link>
                                    </div>

                                    {/* Cover Image */}
                                    <div className="relative w-full h-full shadow-[0_25px_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700 z-20">
                                        <Image
                                            src={book.images[0] || "/images/book-placeholder.jpg"}
                                            alt={book.title}
                                            fill
                                            className="object-contain p-4 bg-white"
                                        />
                                    </div>

                                    {/* Decorative Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Action Badges */}
                                    <div className="absolute top-6 right-6 z-40 flex flex-col gap-3 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-white border border-white/10 shadow-xl hover:scale-110 active:scale-95 transition-all outline-none">
                                            <Heart className="w-5 h-5 fill-current" />
                                        </button>
                                        <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:text-indigo-400 hover:bg-white border border-white/10 shadow-xl hover:scale-110 active:scale-95 transition-all outline-none">
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-6 left-6 z-40">
                                        <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase shadow-lg tracking-widest">
                                            {book.genre}
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom: Content Area */}
                                <CardHeader className="px-8 pt-6 pb-2 space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-[1px] bg-indigo-500/50" />
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none">
                                            {book.author}
                                        </p>
                                    </div>
                                    <CardTitle className="text-xl font-black text-white leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors tracking-tight">
                                        {book.title}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 text-sm line-clamp-2 leading-relaxed pt-1">
                                        {book.description || "A premium selection from our community of book enthusiasts."}
                                    </CardDescription>
                                </CardHeader>

                                <CardFooter className="px-8 pb-8 pt-2 mt-auto flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-gray-500 line-through leading-none">৳{book.price}</span>
                                        <span className="text-2xl font-black text-white tracking-tighter leading-none">
                                            <i className="fa-solid fa-bangladeshi-taka-sign mr-1"></i>{book.finalPrice}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-xs font-black">4.9</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MockBooksSection;
