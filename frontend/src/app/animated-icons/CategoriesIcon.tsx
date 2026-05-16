"use client";
export function CategoriesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ci-pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        .ci-d1{animation:ci-pulse 1.8s ease-in-out infinite 0s;transform-origin:15px 15px}
        .ci-d2{animation:ci-pulse 1.8s ease-in-out infinite .3s;transform-origin:33px 15px}
        .ci-d3{animation:ci-pulse 1.8s ease-in-out infinite .6s;transform-origin:15px 33px}
        .ci-d4{animation:ci-pulse 1.8s ease-in-out infinite .9s;transform-origin:33px 33px}
      `}</style>
      <rect className="ci-d1" x="8" y="8" width="14" height="14" rx="3" fill="#4f46e5"/>
      <rect className="ci-d2" x="26" y="8" width="14" height="14" rx="3" fill="#6366f1"/>
      <rect className="ci-d3" x="8" y="26" width="14" height="14" rx="3" fill="#7c3aed"/>
      <rect className="ci-d4" x="26" y="26" width="14" height="14" rx="3" fill="#4f46e5"/>
      <rect x="11" y="11" width="5" height="5" rx="1" fill="white" opacity=".35"/>
      <rect x="29" y="11" width="5" height="5" rx="1" fill="white" opacity=".35"/>
      <rect x="11" y="29" width="5" height="5" rx="1" fill="white" opacity=".35"/>
      <rect x="29" y="29" width="5" height="5" rx="1" fill="white" opacity=".35"/>
    </svg>
  );
}
