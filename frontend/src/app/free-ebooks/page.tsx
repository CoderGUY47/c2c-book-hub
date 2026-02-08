"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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

const FreeEbooksPage = () => {
    const [books, setBooks] = useState<OpenLibraryBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
        Autoplay({ delay: 4000, stopOnInteraction: false }),
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
        <div className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 font-poppins tracking-tight">
                            Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Ebooks</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">
                            Expand your knowledge without spending a dime. Dive into our curated collection of free programming and tech books.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Slider Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                        <h2 className="text-3xl font-bold text-gray-900 font-poppins">Featured Free Reads</h2>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 border-2">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 border-2">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg">
                        {error} <Button variant="link" onClick={fetchFreeBooks}>Try Again</Button>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex -ml-4 touch-pan-y">
                                {books.map((book) => {
                                    const coverUrl = book.cover_i
                                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                                        : null;

                                    if (!coverUrl) return null;

                                    // Extract the work ID from the key (e.g., "/works/OL1234W" -> "OL1234W")
                                    const workId = book.key.replace("/works/", "");

                                    return (
                                        <div key={book.key} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 py-4">
                                            <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white rounded-xl overflow-hidden relative">
                                                <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg z-20 text-indigo-900 shadow-sm">
                                                    FREE
                                                </div>
                                                <CardContent className="p-0 h-full flex flex-col">
                                                    <div className="relative h-[300px] w-full bg-gray-100 overflow-hidden">
                                                        <Image
                                                            src={coverUrl}
                                                            alt={book.title}
                                                            fill
                                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                            <Link href={`/books/external/${workId}`}>
                                                                <Button className="rounded-full bg-white text-indigo-900 hover:bg-yellow-400 hover:text-indigo-900 font-bold px-6">
                                                                    Read Now
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 flex flex-col flex-1">
                                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1" title={book.title}>
                                                            {book.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                                                            {book.author_name?.join(", ") || "Unknown Author"}
                                                        </p>
                                                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                                                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">
                                                                {book.subject?.[0] || "Ebook"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {/* Gradient Fade for Slider Edges */}
                        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10 lg:block hidden" />
                        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10 lg:block hidden" />
                    </div>
                )}
            </section>
        </div>
    );
};

export default FreeEbooksPage;
