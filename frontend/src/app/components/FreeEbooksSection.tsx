"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Sparkles, Binary } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface OpenLibraryBook {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    ratings_average?: number;
    first_publish_year?: number;
    subject?: string[];
}

const FreeEbooksSection = () => {
    const [books, setBooks] = useState<OpenLibraryBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const fetchFreeBooks = async () => {
        try {
            setIsLoading(true);
            // Fetching specifically computer science/programming books from OpenLibrary
            const res = await fetch(
                "https://openlibrary.org/search.json?subject=computer_science&sort=editions&limit=20"
            );
            if (!res.ok) throw new Error("Failed to fetch books");
            const data = await res.json();
            setBooks(data.docs || []);
        } catch (err) {
            setError("Failed to load free ebooks. Please try again later.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFreeBooks();
    }, []);

    return (
        <section className="py-20 bg-gray-950 relative overflow-hidden border-0">
            {/* Background Decoration - Dark Theme */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)]" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)]" />

            <div className="container mx-auto px-4 w-[100%] relative z-10">
                <div className="flex flex-col container mx-auto px-4 w-[80%] md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                                <Binary className="w-6 h-6 text-indigo-400" />
                            </div>
                            <span className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Open Knowledge</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black font-poppins text-white leading-tight uppercase tracking-tighter mb-1">
                            FREE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">EBOOKS.</span>
                        </h2>
                        <p className="mt-2 text-gray-400 font-medium max-w-lg leading-relaxed">
                            Master your craft with our curated selection of free programming and tech resources. No cost, pure learning.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollPrev}
                            className="rounded-full w-10 h-10 border-0 bg-white/10 text-white hover:bg-white hover:text-gray-50 transition-all shadow-2xl backdrop-blur-md"
                        >
                            <ChevronLeft className="size-6" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollNext}
                            className="rounded-full w-10 h-10 border-0 bg-white/10 text-white hover:bg-white hover:text-gray-50 transition-all shadow-2xl backdrop-blur-md"
                        >
                            <ChevronRight className="size-6" />
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[450px]">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-zinc-50 rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                        <p className="text-rose-600 font-bold mb-4">{error}</p>
                        <Button variant="outline" onClick={fetchFreeBooks} className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-100 font-bold px-8">
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <div className="relative group/carousel">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex -ml-6">
                                {books.map((book, index) => {
                                    const coverUrl = book.cover_i
                                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                                        : null;

                                    if (!coverUrl) return null;

                                    // Extract the work ID from the key (e.g., "/works/OL1234W" -> "OL1234W")
                                    const workId = book.key.replace("/works/", "");

                                    return (
                                        <div key={book.key} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-6 py-6">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                                                viewport={{ once: true }}
                                            >
                                                <Card className="group/card relative h-[450px] flex flex-col p-0 gap-0 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-indigo-500/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                                                    <div className="absolute top-6 right-6 z-30">
                                                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black px-5 py-2 rounded-full shadow-2xl transform rotate-3 group-hover/card:rotate-0 transition-transform tracking-widest uppercase">
                                                            FREE LICENSE
                                                        </span>
                                                    </div>

                                                    {/* Image Wrapper */}
                                                    <div className="relative h-[250px] w-full bg-white/5 p-4 flex items-center justify-center overflow-hidden shrink-0">
                                                        <div className="absolute inset-0 bg-gray-950/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-40 flex items-center justify-center backdrop-blur-[4px]">
                                                            <Link href={`/books/external/${workId}`} className="transform scale-90 group-hover/card:scale-100 transition-transform duration-500">
                                                                <Button className="rounded-full bg-white/50 text-gray-950 hover:bg-indigo-600 hover:text-white font-black px-10 py-7 shadow-2xl text-xs tracking-widest uppercase transition-all">
                                                                    Read Now
                                                                </Button>
                                                            </Link>
                                                        </div>

                                                        <div className="relative w-full h-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-700 z-20">
                                                            <Image
                                                                src={coverUrl}
                                                                alt={book.title}
                                                                fill
                                                                className="object-contain p-2 bg-gray-700"
                                                            />
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                                                    </div>

                                                    <CardHeader className="px-4 pt-4 pb-2 space-y-2">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className="w-12 h-[1.5px] bg-indigo-500/50" />
                                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none">
                                                                {book.author_name?.[0] || "Open Source Author"}
                                                            </p>
                                                        </div>
                                                        <CardTitle className="text-lg font-black text-white leading-tight line-clamp-2 h-14 group-hover/card:text-indigo-400 transition-colors tracking-tight">
                                                            {book.title}
                                                        </CardTitle>
                                                    </CardHeader>

                                                    <CardContent className="px-4 -mt-2 py-0 flex-grow">
                                                        <CardDescription className="text-gray-400 text-xs line-clamp-2 leading-relaxed font-medium">
                                                            {book.subject?.[0] || "Expand your programming horizons with this free community resource."}
                                                        </CardDescription>
                                                    </CardContent>

                                                    <CardFooter className="px-4 -mt-10 pb-5 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                                            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                                                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tight">
                                                                {book.subject?.[1] || "Programming"}
                                                            </span>
                                                        </div>
                                                        <Link href={`https://openlibrary.org${book.key}`} target="_blank" className="text-[10px] font-black text-gray-500 hover:text-indigo-400 transition-colors uppercase tracking-widest border-b border-transparent hover:border-indigo-400">
                                                            Preview
                                                        </Link>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FreeEbooksSection;
