"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import("lottie-react"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse" />
});

interface LottieAnimationProps {
  animationUrl: string;
  className?: string;
}

const LottieAnimation = ({ animationUrl, className }: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (animationUrl) {
      fetch(animationUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch animation");
          return res.json();
        })
        .then((data) => {
          if (isMounted) setAnimationData(data);
        })
        .catch((err) => {
          console.error("Lottie Error:", err);
          if (isMounted) setError(true);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [animationUrl]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-white/5 text-[10px] text-white/20`}>
        Animation Error
      </div>
    );
  }

  if (!animationData) {
    return <div className={`${className} bg-white/5 animate-pulse`} />;
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnimation;
