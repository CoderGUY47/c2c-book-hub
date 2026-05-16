"use client";
export function FreeToUseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ftu-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes ftu-glow{0%,100%{opacity:.15}50%{opacity:.5}}
        .ftu-tag{animation:ftu-bounce 2.5s ease-in-out infinite}
        .ftu-glow{animation:ftu-glow 2s ease-in-out infinite}
      `}</style>
      <circle className="ftu-glow" cx="24" cy="26" r="18" fill="#22c55e"/>
      <g className="ftu-tag">
        <path d="M12 16 L12 34 Q12 36 14 36 L30 36 Q32 36 34 34 L40 28 Q42 26 40 24 L34 18 Q32 16 30 16 L20 16 L20 12 Q20 10 18 10 L14 10 Q12 10 12 12Z" fill="#14532d" opacity=".9"/>
        <path d="M12 16 L12 34 Q12 36 14 36 L30 36 Q32 36 34 34 L40 28 Q42 26 40 24 L34 18 Q32 16 30 16 L20 16 L20 12 Q20 10 18 10 L14 10 Q12 10 12 12Z" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
        <circle cx="17" cy="14" r="2" fill="#14532d" stroke="#22c55e" strokeWidth="1.5"/>
        <text x="27" y="31" textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="bold" fontFamily="sans-serif">FREE</text>
      </g>
    </svg>
  );
}
