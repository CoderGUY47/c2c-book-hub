"use client";
export function SafePaymentsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes sp-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes sp-pulse{0%,100%{opacity:.15}50%{opacity:.5}}
        @keyframes sp-key{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
        .sp-ring{animation:sp-spin 8s linear infinite;transform-origin:24px 24px}
        .sp-glow{animation:sp-pulse 2s ease-in-out infinite}
        .sp-key{animation:sp-key 1.5s ease-in-out infinite}
      `}</style>
      <circle className="sp-glow" cx="24" cy="24" r="20" fill="#6366f1"/>
      <circle className="sp-ring" cx="24" cy="24" r="18" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5 3"/>
      <rect x="14" y="22" width="20" height="16" rx="3" fill="#4f46e5"/>
      <path d="M17 22 L17 18 Q17 11 24 11 Q31 11 31 18 L31 22" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
      <g className="sp-key">
        <circle cx="24" cy="29" r="3" fill="#c4b5fd"/>
        <line x1="24" y1="32" x2="24" y2="35" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
