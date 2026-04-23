"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import GenreMarquee from "./GenreMarquee";

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
        <section className="py-10 bg-black relative overflow-hidden">
            <div className="container mx-auto w-full relative z-10">
                <div className="text-center mb-2">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-langar text-white mb-4 tracking-tight">
                            Browse By <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Genre.</span>
                        </h2>
                        <p className="text-white/60 font-medium text-base tracking-wider">
                            Explore our vast collection categorized for you.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-4">
                    <GenreMarquee genres={genresV2} />
                </div>
            </div>


        </section>
    );
};

export default BrowseGenresSectionV2;
