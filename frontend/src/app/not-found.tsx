"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookX, Home, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCat404 } from './animated-icons';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white overflow-hidden flex items-center justify-center relative p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Floating Background SVGs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.03] text-indigo-500"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              x: [null, Math.random() * 200 - 100],
              rotate: [null, Math.random() * 360]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          >
            <BookX size={120} />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-white rounded-3xl p-8 md:p-16 text-center">
          
          {/* Cat Animation */}
          <div className="relative mx-auto w-full max-w-[450px] md:max-w-[600px]">
            <AnimatedCat404 className="w-full h-auto" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight mt-6">
            Page Not Found
          </h2>
          
          <p className="text-slate-500 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed font-medium">
            The book, page, or chapter you are looking for has been misplaced, checked out, or never existed in our library.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto group relative h-14 px-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-[0_10px_20px_-10px_rgba(59,130,246,0.6)] transition-all overflow-hidden border-0">
                <span className="relative flex items-center justify-center gap-2">
                  <Home className="size-5 group-hover:-translate-y-1 transition-transform duration-300" />
                  Return Home
                </span>
              </Button>
            </Link>

            <Link href="/books" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto group h-14 px-8 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-base transition-all shadow-sm">
                <span className="flex items-center justify-center gap-2">
                  <Search className="size-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  Browse Books
                  <ChevronRight className="size-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-500" />
                </span>
              </Button>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
