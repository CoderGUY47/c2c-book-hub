"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Genre {
  id: number;
  name: string;
  image: string;
}

interface GenreMarqueeProps {
  genres: Genre[];
}

const GenreMarquee: React.FC<GenreMarqueeProps> = ({ genres }) => {
  // Duplicate genres to ensure seamless looping
  const duplicatedGenres = [...genres, ...genres, ...genres];

  return (
    <div className="relative w-full overflow-hidden py-10">
      {/* Background X-Rail Lines (Static Editorial Version) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent -rotate-45" />
      </div>

      <motion.div
        className="flex gap-4 w-max"
        animate={{
          x: [0, -100 * genres.length],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedGenres.map((genre, idx) => (
          <Link
            key={`${genre.id}-${idx}`}
            href={`/books?genre=${genre.name.toLowerCase()}`}
            className="group relative flex-shrink-0"
          >
            <div className="w-48 h-24 relative overflow-hidden rounded-sm border border-white/10 bg-zinc-500 group-hover:border-indigo-500/50">
              {/* Background Image with Overlay */}
              <img
                src={genre.image}
                alt={genre.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-xl font-langar text-white tracking-wider group-hover:text-indigo-600 transition-colors drop-shadow-lg">
                  {genre.name}
                </span>
                <div className="mt-1 h-0.5 w-0 bg-red-500 group-hover:w-12 transition-all duration-500" />
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Side Gradients for Fade Effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/2 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/2 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default GenreMarquee;
