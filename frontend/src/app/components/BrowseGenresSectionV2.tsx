"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// Mapping genres to their respective high-quality images
const genresV2 = [
    { id: 1, name: "Fiction", image: "/images/genre/fiction.webp", gradient: "from-blue-600/20 to-indigo-600/20" },
    { id: 2, name: "Sci-Fi", image: "/images/genre/Sci-fi.webp", gradient: "from-purple-600/20 to-indigo-600/20" },
    { id: 3, name: "Romance", image: "/images/genre/romance.webp", gradient: "from-pink-600/20 to-rose-600/20" },
    { id: 4, name: "Mystery", image: "/images/genre/mystery.webp", gradient: "from-red-600/20 to-orange-600/20" },
    { id: 5, name: "Fantasy", image: "/images/genre/fantasy.webp", gradient: "from-violet-600/20 to-purple-600/20" },
    { id: 6, name: "Horror", image: "/images/genre/horror.webp", gradient: "from-slate-800/20 to-gray-800/20" },
    { id: 7, name: "Non-Fiction", image: "/images/genre/non-fiction.webp", gradient: "from-emerald-600/20 to-teal-600/20" },
    { id: 8, name: "History", image: "/images/genre/history.webp", gradient: "from-amber-600/20 to-orange-600/20" },
    { id: 9, name: "Crime", image: "/images/genre/crime.webp", gradient: "from-zinc-800/40 to-slate-900/40" },
    { id: 10, name: "Business", image: "/images/genre/business.webp", gradient: "from-sky-600/20 to-blue-600/20" },
    { id: 11, name: "Poetry", image: "/images/genre/poetry.webp", gradient: "from-fuchsia-600/20 to-pink-600/20" },
    { id: 12, name: "Travel", image: "/images/genre/travels.webp", gradient: "from-lime-600/20 to-green-600/20" },
    { id: 13, name: "Art", image: "/images/genre/art.webp", gradient: "from-yellow-600/20 to-amber-600/20" },
    { id: 14, name: "Comics", image: "/images/genre/comic.webp", gradient: "from-cyan-600/20 to-sky-600/20" },
    { id: 15, name: "Detective", image: "/images/genre/detective.webp", gradient: "from-indigo-800/20 to-blue-900/20" },
    { id: 16, name: "Motivational", image: "/images/genre/motivational.webp", gradient: "from-orange-700/20 to-yellow-700/20" },
    { id: 17, name: "Religion", image: "/images/genre/religion.webp", gradient: "from-amber-700/20 to-yellow-800/20" },
    { id: 18, name: "Journals", image: "/images/genre/journals.webp", gradient: "from-teal-500/20 to-emerald-500/20" },
];

const BrowseGenresSectionV2 = () => {
    return (
        <section className="py-24 bg-gray-950 relative overflow-hidden">
            <div className="container mx-auto px-4 w-[85%] relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-poppins font-black text-white mb-4 tracking-tight">
                            Browse By <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Genre.</span>
                        </h2>
                        <p className="text-gray-400 font-medium text-lg">
                            Explore our vast collection categorized for you.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {genresV2.map((genre, index) => (
                        <motion.div
                            key={genre.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                        >
                            <Link href={`/books?genre=${genre.name.toLowerCase()}`}>
                                <Card className="group w-[90%] h-[110px] relative overflow-hidden border-0 shadow-lg rounded-lg bg-white cursor-pointer hover:shadow-2xl transition-all duration-500">
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src={genre.image}
                                            alt={genre.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent transition-opacity duration-500`} />
                                        <div className={`absolute inset-0 bg-gradient-to-r ${genre.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    </div>

                                    <CardContent className="relative z-10 h-full flex flex-col justify-end p-5 bg-black/40 mt-10">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 + 0.2 }}
                                            className="space-y-1"
                                        >
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-indigo-100 group-hover:drop-shadow-md transition-colors">
                                                {genre.name}
                                            </h3>
                                            <div className="h-1 w-8 bg-indigo-500 rounded-full group-hover:w-16 transition-all duration-500" />
                                        </motion.div>
                                    </CardContent>

                                    {/* Glass reflection overlay */}
                                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out" />
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background decorative elements - Dark theme */}
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            <div className="absolute top-20 right-95 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
        </section>
    );
};

export default BrowseGenresSectionV2;
