"use client";
export function VerifiedUsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes vu-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes vu-badge{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
        .vu-person{animation:vu-bounce 2.5s ease-in-out infinite}
        .vu-badge{animation:vu-badge 2s ease-in-out infinite;transform-origin:35px 13px}
      `}</style>
      <g className="vu-person">
        <circle cx="20" cy="17" r="7" fill="#4f46e5"/>
        <path d="M6 40 Q6 28 20 28 Q34 28 34 40" fill="#4f46e5" opacity=".8"/>
      </g>
      <g className="vu-badge">
        <circle cx="35" cy="13" r="9" fill="#22c55e"/>
        <polyline points="30,13 33.5,16.5 40,10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}
