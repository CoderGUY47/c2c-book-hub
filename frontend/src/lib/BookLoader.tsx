"use client";

import React, { useEffect, useRef } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";

interface BookLoaderProps {
  message?: string;
  subMessage?: string;
  color?: string;
  size?: number;
  fullScreen?: boolean;
}

export default function BookLoader({
  message = "..Loading Books..",
  subMessage = "Your next favorite read is on its way!",
  color = "#7c08db",
  size = 48,
  fullScreen = true,
}: BookLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dotLottie: DotLottie | null = null;

    if (canvasRef.current) {
      dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: "/cube-loader.lottie",
        renderConfig: {
          autoResize: true,
          devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
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
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-md"
          : "w-full min-h-[60vh] flex flex-col items-center justify-center bg-transparent"
      }
    >
      <div className="flex flex-col items-center text-center p-4">
        {/* Premium 3D Isometric Lottie Cube Loader */}
        <canvas
          ref={canvasRef}
          style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
          className="max-w-[90vw] max-h-[90vh]"
        />

        {/* Loading Text */}
        <p className="mt-6 text-3xl font-black text-white tracking-wide">{message}</p>
        <p className="mt-2 text-lg font-semibold text-slate-400 max-w-sm">{subMessage}</p>
      </div>
    </div>
  );
}