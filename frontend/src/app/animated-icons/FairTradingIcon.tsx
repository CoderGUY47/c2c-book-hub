"use client";
export function FairTradingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ft-tilt{0%,100%{transform:rotate(0deg)}33%{transform:rotate(-8deg)}66%{transform:rotate(8deg)}}
        @keyframes ft-glow{0%,100%{opacity:.1}50%{opacity:.4}}
        .ft-scale{animation:ft-tilt 3s ease-in-out infinite;transform-origin:24px 14px}
        .ft-glow{animation:ft-glow 2s ease-in-out infinite}
      `}</style>
      <circle className="ft-glow" cx="24" cy="24" r="20" fill="#f59e0b"/>
      <g className="ft-scale">
        <line x1="24" y1="10" x2="24" y2="40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="16" x2="36" y2="16" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="16" x2="12" y2="20" stroke="#fbbf24" strokeWidth="1.5"/>
        <line x1="36" y1="16" x2="36" y2="20" stroke="#fbbf24" strokeWidth="1.5"/>
        <circle cx="12" cy="25" r="5" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5"/>
        <circle cx="36" cy="25" r="5" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5"/>
        <line x1="18" y1="40" x2="30" y2="40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
