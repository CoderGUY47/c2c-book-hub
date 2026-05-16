"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DotLottie } from '@lottiefiles/dotlottie-web';

export default function NotFound() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dotLottie: DotLottie | null = null;
    
    if (canvasRef.current) {
      dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        // The EXACT Cat animation URL from LottieFiles
        src: "https://assets-v2.lottiefiles.com/a/f0eb5d7c-117f-11ee-a567-436398b6fdbc/6cUUA6bUcA.lottie",
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
    <div className="relative min-h-screen bg-black text-slate-200 flex flex-col items-center justify-center text-center p-8 overflow-hidden font-sans">
      
      {/* Floating Animation for Cat */}
      <style>{`
        @keyframes float-404 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-404 {
          animation: float-404 4s ease-in-out infinite;
        }
      `}</style>

      {/* Dot grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} 
        aria-hidden="true" 
      />

      {/* Ambient glow - updated to match site's indigo/blue brand colors */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)"
        }}
        aria-hidden="true" 
      />



      {/* Animation wrapper */}
      <div className="relative z-10 animate-float-404">
        <canvas 
          ref={canvasRef} 
          className="w-[360px] h-[360px] max-w-[85vw] max-h-[85vw]" 
          style={{ filter: "hue-rotate(220deg) saturate(1.6) brightness(0.9)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mt-7">
        <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3.5 py-1 text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          404 Error
        </span>
        
        <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight mb-3 tracking-tight text-white">
          Page not found
        </h1>
        
        <p className="text-base text-slate-400 max-w-[340px] mx-auto mb-8 leading-relaxed">
          Looks like the cat knocked this page right off the internet. It's gone.
        </p>
        
        <div className="flex gap-3 justify-center flex-wrap">
          <button 
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/25"
          >
            &larr; Go home
          </button>
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all bg-transparent text-slate-300 border border-slate-700 hover:text-white hover:border-slate-500 hover:bg-slate-800/50"
          >
            Go back
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/69 tracking-widest z-10 whitespace-nowrap">
        HTTP 404 &middot; PAGE_NOT_FOUND
      </div>
    </div>
  );
}
