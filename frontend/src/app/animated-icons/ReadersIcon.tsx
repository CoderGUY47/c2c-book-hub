"use client";
export function ReadersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ri-blink{0%,85%,100%{transform:scaleY(1)}92%{transform:scaleY(0.08)}}
        @keyframes ri-scan{0%,100%{transform:translateX(-5px)}50%{transform:translateX(5px)}}
        @keyframes ri-glow{0%,100%{opacity:.1}50%{opacity:.4}}
        .ri-eye{animation:ri-blink 3s ease-in-out infinite;transform-origin:24px 20px}
        .ri-pupil{animation:ri-scan 2.5s ease-in-out infinite}
        .ri-g{animation:ri-glow 2s ease-in-out infinite}
      `}</style>
      <circle className="ri-g" cx="24" cy="22" r="18" fill="#818cf8"/>
      <g className="ri-eye">
        <ellipse cx="24" cy="22" rx="15" ry="8" fill="none" stroke="#6366f1" strokeWidth="2"/>
        <ellipse cx="24" cy="22" rx="15" ry="8" fill="#4f46e5" opacity=".25"/>
      </g>
      <g className="ri-pupil">
        <circle cx="24" cy="22" r="5" fill="#6366f1"/>
        <circle cx="24" cy="22" r="2.5" fill="#a5b4fc"/>
        <circle cx="25.5" cy="20.5" r="1" fill="white" opacity=".8"/>
      </g>
      <path d="M10 36 Q16 32 24 34 Q32 32 38 36" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
