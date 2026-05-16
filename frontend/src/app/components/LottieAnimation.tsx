"use client";

import { useEffect, useRef, useState } from "react";

interface LottieAnimationProps {
  animationUrl: string;
  className?: string;
}

const LottieAnimation = ({ animationUrl, className }: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let animationInstance: any = null;

    const loadAnimation = async () => {
      try {
        // Import lottie-web dynamically
        const lottie = (await import("lottie-web")).default;

        if (containerRef.current) {
          animationInstance = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: animationUrl, // Use the direct URL
          });

          animationInstance.addEventListener("DOMLoaded", () => {
            setLoading(false);
          });

          animationInstance.addEventListener("data_failed", () => {
            setError(true);
            setLoading(false);
          });
        }
      } catch (err) {
        console.error("Lottie loading error:", err);
        setError(true);
        setLoading(false);
      }
    };

    loadAnimation();

    return () => {
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, [animationUrl]);

  return (
    <div className={`${className} relative`}>
      {loading && !error && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-sm" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-[10px] text-white/20 rounded-sm">
          Animation Error
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default LottieAnimation;
