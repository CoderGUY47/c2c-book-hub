"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface OpenLibraryBook {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    ratings_average?: number;
    first_publish_year?: number;
    subject?: string[];
}

const TrendingBooksSection = () => {
    const [books, setBooks] = useState<OpenLibraryBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        dragFree: true
    }, [
        AutoScroll({ speed: 0.5, stopOnInteraction: false, playOnInit: true })
    ]);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setIsLoading(true);
                // Fetching most popular fiction books (sorted by edition count = popularity)
                const res = await fetch(
                    "https://openlibrary.org/search.json?subject=thriller&sort=editions&limit=50"
                );
                if (!res.ok) throw new Error("Failed");
                const data = await res.json();
                setBooks(data.docs || []);
            } catch (error) {
                console.error("Failed to fetch trending books", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (isLoading) {
        return (
            <section className="h-[600px] bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-gray-400 font-poppins tracking-wider text-xs font-black italic">FETCHING TRENDS...</p>
                </div>
            </section>
        );
    }

    if (books.length === 0) return null;

    return (
        <section className="relative h-[650px] w-full overflow-hidden bg-gray-950 text-white flex flex-col justify-center">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />
            </div>

            <div className="container w-[80%] mx-auto px-4 relative z-10 py-10 mb-4">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-[2px] w-12 bg-indigo-500" />
                        <span className="text-indigo-400 font-black tracking-[0.3em] text-[10px] uppercase">
                            Global Bestsellers
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-poppins leading-tighter tracking-tight uppercase">
                        Reader's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Choice.</span>
                    </h2>
                </div>
            </div>

            {/* Continuous Ticker */}
            <div className="relative z-10 w-full" ref={emblaRef}>
                <div className="flex items-center">
                    {books.map((book, index) => {
                        const coverUrl = book.cover_i
                            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                            : null;

                        if (!coverUrl) return null;

                        return (
                            <div key={`${book.key}-${index}`} className="flex-[0_0_200px] px-2 -mt-10 pb-14">
                                <Card className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/[0.08] w-[200px] h-[280px] pointer-events-none select-none">
                                    <CardContent className="p-0 h-full flex flex-col items-center">
                                        {/* Image Area */}
                                        <div className="relative h-[220px] w-full p-4 flex items-center justify-center">
                                            {/* Glow Effect */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-500" />

                                            <div className="relative w-full h-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                                <Image
                                                    src={coverUrl}
                                                    alt={book.title}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>

                                            {/* Rank Badge */}
                                            <div className="absolute -top-1 -right-1">
                                                <div className="relative flex items-center justify-center w-10 h-10">
                                                    <div className="absolute inset-0 bg-indigo-500 rotate-12 rounded-lg opacity-20 blur-sm" />
                                                    <div className="relative bg-indigo-600 text-white font-black text-xs w-8 h-6 mr-4 flex items-center justify-center rounded-full shadow-lg">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="px-5 pb-6 text-center space-y-2 mt-auto">
                                            <h3 className="text-[14px] font-bold text-gray-100 line-clamp-1 group-hover:text-white transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-[11px] font-medium text-gray-400 line-clamp-1 uppercase tracking-widest italic opacity-80">
                                                {book.author_name?.[0] || "Unknown"}
                                            </p>

                                            <div className="pt-3 flex items-center justify-center gap-1.5 opacity-60">
                                                <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                                <span className="text-[10px] font-black text-gray-300">
                                                    {book.ratings_average ? book.ratings_average.toFixed(1) : "4.9"}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    {/* Premium Border Overlay */}
                                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/5 pointer-events-none transition-colors duration-500" />
                                </Card>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Bottom Grid Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                />
            </div>
        </section>
    );
};

export default TrendingBooksSection;
