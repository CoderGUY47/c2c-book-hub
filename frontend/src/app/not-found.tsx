"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookX, Home, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DotLottie } from '@lottiefiles/dotlottie-web';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dotLottie: DotLottie | null = null;
    
    if (canvasRef.current) {
      dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie",
        renderConfig: {
          autoResize: true,
          devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
        },
      });
    }

    return () => {
      if (dotLottie) {
        dotLottie.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden flex items-center justify-center relative p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
        
        {/* Floating Book Silhouettes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10 text-white"
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
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-16 shadow-2xl text-center">
          
          {/* Lottie Animation Header */}
          <div className="relative mb-8 flex justify-center">
            <canvas ref={canvasRef} className="w-64 h-64 md:w-80 md:h-80 mx-auto drop-shadow-[0_0_15px_rgba(96,165,250,0.2)]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 tracking-tight">
            Lost in the Archives
          </h2>
          
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            The book, page, or chapter you are looking for has been misplaced, checked out, or never existed in our library.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto group relative h-14 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-semibold text-base shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all overflow-hidden border-0">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative flex items-center justify-center gap-2">
                  <Home className="size-5 group-hover:-translate-y-1 transition-transform duration-300" />
                  Return Home
                </span>
              </Button>
            </Link>

            <Link href="/books" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto group h-14 px-8 rounded-full border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200 font-semibold text-base transition-all">
                <span className="flex items-center justify-center gap-2">
                  <Search className="size-5 text-slate-400 group-hover:text-white transition-colors" />
                  Browse Books
                  <ChevronRight className="size-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-400" />
                </span>
              </Button>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
