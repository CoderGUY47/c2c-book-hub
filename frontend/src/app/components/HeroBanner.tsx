"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, LucideCircleArrowOutUpRight, ScanQrCode, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const bannerImages = [
  "/images/book1.webp",
  "/images/book2.webp",
  "/images/book3.webp",
  "/images/book4.webp",
  "/images/book5.webp",
  "/images/book6.webp",
  "/images/book7.webp",
];

export default function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[700px] flex flex-col bg-black/5 overflow-hidden">
      {/* Background slider with more subtlety to match the new light aesthetic */}
      <div className="absolute inset-0 z-0">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImage === index ? "opacity-10" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              fill
              alt="banner"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="container w-[90%] lg:w-[80%] mx-auto flex-grow flex flex-col relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">
          {/* Left Part Text */}
          <div className="max-w-2xl">
            {/* Authority Badge */}
            <div className="flex items-center gap-4 mb-10 overflow-hidden">
                <span className="w-12 h-[2px] bg-white/60"></span>
                <span className="text-xs font-bold uppercase tracking-wide text-white/60 whitespace-nowrap">
                    Est. 2026 // Global Book Marketplace
                </span>
            </div>

            <div className="relative">
              <h1 className="text-6xl lg:text-7xl font-langar font-bold tracking-tighter text-white drop-shadow-2xl">
                Book-Hub
              </h1>
              <p className="text-white font-bold text-2xl lg:text-3xl tracking-normal py-4">A Premier Archive</p>
            </div>

            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-lg font-normal tracking-tight">
              The best online marketplace for buying and selling used books. 
              Find <span className="text-purple-700 font-medium">cheap, trending</span> and academic books globally.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                asChild
                className="bg-white text-black w-[190px] py-8 text-xs font-bold uppercase tracking-widest hover:text-white transition-all duration-500 rounded-none shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95"
              >
                <Link href="/books">Explore Now</Link>
              </Button>
              <Button
                  asChild
                  className="bg-white/30 border border-white text-white w-[190px] py-8 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 rounded-none active:scale-95"
              >
                  <Link href="/book-sell">Sell Books</Link>
              </Button>
            </div>
          </div>

          {/* Right Images Layout (Alternating Bento Shelf - AS PER SKETCH) */}
          <div className="hidden lg:flex flex-col items-stretch justify-center relative w-full max-w-[700px] gap-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="flex flex-col gap-6"
            >
              {/* Row 1: [Wide Rectangle | Small Square] */}
              <div className="flex gap-6 h-64 lg:h-72">
                {/* Box 1 - Wide Rectangle */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } }}
                  className="flex-[0.65] bg-white/5 backdrop-blur-sm border border-white rounded-sm shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex items-center p-6 space-x-6 group transition-all duration-500 hover:shadow-2xl hover:bg-white/10"
                >
                  <div className="w-[35%] h-full relative">
                    <Image 
                      src="/images/mock-books/sapiens.jpg" 
                      fill
                      className="object-contain drop-shadow-lg" 
                      alt="Sapiens" 
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl font-poppins text-white mb-1">Sapiens</h3>
                    <p className="text-[12px] text-white/80 font-langar uppercase tracking-[0.3em] opacity-60">Yuval Noah Harari</p>
                    <div className="mt-4 h-px w-20 bg-gray-200 group-hover:w-full transition-all duration-700" />
                  </div>
                </motion.div>

                {/* Box 2 - Small Square */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } }}
                  className="flex-[0.35] bg-white/15 backdrop-blur-sm border border-white rounded-sm  shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center justify-center p-6 transition-all duration-500"
                >
                  <div className="w-full h-[70%] mb-4 relative">
                    <Image 
                      src="/images/mock-books/thinking-fast-and-slow.jpg" 
                      fill
                      className="object-contain drop-shadow-md" 
                      alt="Thinking Fast" 
                      sizes="(max-width: 768px) 100vw, 150px"
                    />
                  </div>
                  <h3 className="text-sm font-langar text-white text-center line-clamp-1">Fast & Slow</h3>
                </motion.div>
              </div>

              {/* Row 2: [Small Square | Wide Rectangle] */}
              <div className="flex gap-6 h-64 lg:h-72">
                {/* Box 3 - Small Square */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } }}
                  className="flex-[0.35] bg-white/15 backdrop-blur-sm border border-white rounded-sm shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center justify-center p-6 transition-all duration-500"
                >
                  <div className="w-full h-[70%] mb-4 relative">
                    <Image 
                      src="/images/mock-books/alchemist.jpg" 
                      fill
                      className="object-contain drop-shadow-md" 
                      alt="The Alchemist" 
                      sizes="(max-width: 768px) 100vw, 150px"
                    />
                  </div>
                  <h3 className="text-sm font-langar text-white text-center line-clamp-1">The Alchemist</h3>
                </motion.div>

                {/* Box 4 - Wide Rectangle */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } }}
                  className="flex-[0.65] bg-white/5 backdrop-blur-sm border border-white rounded-sm  shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex items-center p-6 space-x-6 group transition-all duration-500 hover:shadow-2xl hover:bg-white/10"
                >
                  <div className="flex-1 flex flex-col justify-center items-end text-right">
                    <h3 className="text-2xl font-poppins text-white mb-1">Becoming</h3>
                    <p className="text-[12px] text-white/80 font-langar uppercase tracking-[0.3em] opacity-60">Michelle Obama</p>
                    <div className="mt-4 h-px w-20 bg-gray-200 group-hover:w-full transition-all duration-700" />
                  </div>
                  <div className="w-[35%] h-full relative">
                    <Image 
                      src="/images/mock-books/becoming.jpg" 
                      fill
                      className="object-contain drop-shadow-lg" 
                      alt="Becoming" 
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Decorative Background Accents */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 blur-[120px] pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[100px] pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
