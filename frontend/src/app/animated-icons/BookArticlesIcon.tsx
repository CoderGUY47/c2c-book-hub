"use client";
export function BookArticlesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ba-flip{0%,100%{transform:scaleX(1)}50%{transform:scaleX(0.08)}}
        @keyframes ba-glow{0%,100%{opacity:.1}50%{opacity:.4}}
        .ba-p{animation:ba-flip 2.5s ease-in-out infinite;transform-origin:32px 28px}
        .ba-g{animation:ba-glow 2s ease-in-out infinite}
      `}</style>
      <ellipse className="ba-g" cx="24" cy="40" rx="14" ry="3" fill="#818cf8"/>
      <rect x="8" y="12" width="14" height="22" rx="2" fill="#4f46e5"/>
      <g className="ba-p"><rect x="26" y="12" width="14" height="22" rx="2" fill="#6366f1"/></g>
      <rect x="24" y="12" width="1" height="22" fill="#1e1b4b"/>
      <rect x="10" y="17" width="8" height="1.5" rx=".75" fill="white" opacity=".6"/>
      <rect x="10" y="21" width="6" height="1.5" rx=".75" fill="white" opacity=".4"/>
      <rect x="10" y="25" width="8" height="1.5" rx=".75" fill="white" opacity=".5"/>
      <rect x="28" y="17" width="8" height="1.5" rx=".75" fill="white" opacity=".6"/>
      <rect x="28" y="21" width="6" height="1.5" rx=".75" fill="white" opacity=".4"/>
      <rect x="28" y="25" width="8" height="1.5" rx=".75" fill="white" opacity=".5"/>
    </svg>
  );
}
