"use client";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
  animationUrl: string;
  className?: string;
}

const LottieAnimation = ({ animationUrl, className }: LottieAnimationProps) => {
  return (
    <div className={className}>
      <Lottie
        animationData={null}
        path={animationUrl}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnimation;
