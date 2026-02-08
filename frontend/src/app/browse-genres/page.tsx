"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Book, Code, Heart, Rocket, Skull, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const genres = [
    { id: 1, name: "Fiction", icon: Book, color: "bg-blue-100 text-blue-600", gradient: "from-blue-500 to-cyan-400" },
    { id: 2, name: "Sci-Fi", icon: Rocket, color: "bg-purple-100 text-purple-600", gradient: "from-purple-500 to-indigo-500" },
    { id: 3, name: "Romance", icon: Heart, color: "bg-pink-100 text-pink-600", gradient: "from-pink-500 to-rose-400" },
    { id: 4, name: "Thriller", icon: Skull, color: "bg-red-100 text-red-600", gradient: "from-red-600 to-orange-500" },
    { id: 5, name: "Comedy", icon: Smile, color: "bg-yellow-100 text-yellow-600", gradient: "from-yellow-400 to-amber-500" },
    { id: 6, name: "Programming", icon: Code, color: "bg-green-100 text-green-600", gradient: "from-emerald-500 to-teal-400" },
    { id: 7, name: "Fantasy", icon: Book, color: "bg-indigo-100 text-indigo-600", gradient: "from-indigo-500 to-violet-400" },
    { id: 8, name: "Mystery", icon: Skull, color: "bg-gray-100 text-gray-600", gradient: "from-gray-600 to-slate-400" },
    { id: 9, name: "History", icon: Book, color: "bg-orange-100 text-orange-600", gradient: "from-orange-500 to-amber-600" },
    { id: 10, name: "Business", icon: Rocket, color: "bg-sky-100 text-sky-600", gradient: "from-sky-500 to-blue-600" },
    { id: 11, name: "Health", icon: Heart, color: "bg-teal-100 text-teal-600", gradient: "from-teal-400 to-emerald-500" },
    { id: 12, name: "Travel", icon: Rocket, color: "bg-lime-100 text-lime-600", gradient: "from-lime-500 to-green-600" },
];

const BrowseGenresPage = () => {
    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <section className="relative py-24 mb-16 bg-gray-950 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-900/30 to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-4 font-poppins"
                    >
                        Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Genres</span>
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Explore our vast collection categorized by genre. Find your next favorite story.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 w-[90%]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {genres.map((genre, index) => {
                        const Icon = genre.icon;
                        return (
                            <motion.div
                                key={genre.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                            >
                                <Link href={`/books?genre=${genre.name.toLowerCase()}`}>
                                    <Card className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md group overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                            <div className={`w-16 h-16 rounded-full ${genre.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-black transition-colors">
                                                {genre.name}
                                            </h3>
                                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                                                    Explore <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default BrowseGenresPage;
