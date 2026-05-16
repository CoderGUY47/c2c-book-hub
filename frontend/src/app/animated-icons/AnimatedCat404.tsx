"use client";
export function AnimatedCat404({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes cat-tail{0%,100%{transform:rotate(0deg)}50%{transform:rotate(15deg)}}
        @keyframes cat-blink{0%,85%,100%{transform:scaleY(1)}90%{transform:scaleY(0.1)}}
        @keyframes cat-ear-l{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-10deg)}40%{transform:rotate(0deg)}}
        @keyframes cat-ear-r{0%,100%{transform:rotate(0deg)}60%{transform:rotate(10deg)}80%{transform:rotate(0deg)}}
        @keyframes cat-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes text-glitch{0%,100%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(2px,-2px)}60%{transform:translate(-2px,-2px)}80%{transform:translate(2px,2px)}}
        .cat-group{animation:cat-float 4s ease-in-out infinite;transform-origin:center}
        .cat-tail{animation:cat-tail 3s ease-in-out infinite;transform-origin:250px 180px}
        .cat-eye{animation:cat-blink 4s ease-in-out infinite;transform-origin:center}
        .cat-ear-l{animation:cat-ear-l 5s ease-in-out infinite;transform-origin:170px 100px}
        .cat-ear-r{animation:cat-ear-r 6s ease-in-out infinite;transform-origin:230px 100px}
        .glitch-text{animation:text-glitch 0.2s ease-in-out infinite alternate}
      `}</style>

      {/* Background elements */}
      <circle cx="200" cy="150" r="100" fill="#4f46e5" opacity="0.1"/>
      <circle cx="200" cy="150" r="120" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="10 10" opacity="0.2">
        <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="20s" repeatCount="indefinite"/>
      </circle>

      {/* Floating 404 Text Background */}
      <g opacity="0.1">
        <text x="200" y="200" fontSize="180" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" fill="#818cf8">404</text>
      </g>

      <g className="cat-group">
        {/* Tail */}
        <path className="cat-tail" d="M 230 200 Q 280 200 290 150 Q 300 100 270 90 Q 250 85 260 120 Q 270 160 230 190" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round"/>

        {/* Body */}
        <path d="M 140 220 Q 140 160 200 160 Q 260 160 260 220 Z" fill="#f8fafc"/>
        <path d="M 160 220 Q 160 180 200 180 Q 240 180 240 220 Z" fill="#e2e8f0"/>

        {/* Head */}
        <circle cx="200" cy="130" r="50" fill="#f8fafc"/>

        {/* Ears */}
        <polygon className="cat-ear-l" points="160,100 150,50 190,90" fill="#f8fafc"/>
        <polygon className="cat-ear-l" points="163,95 155,60 185,90" fill="#f1f5f9"/>
        
        <polygon className="cat-ear-r" points="240,100 250,50 210,90" fill="#f8fafc"/>
        <polygon className="cat-ear-r" points="237,95 245,60 215,90" fill="#f1f5f9"/>

        {/* Eyes */}
        <g className="cat-eye">
          <circle cx="180" cy="120" r="8" fill="#1e293b"/>
          <circle cx="220" cy="120" r="8" fill="#1e293b"/>
          <circle cx="178" cy="118" r="3" fill="#ffffff"/>
          <circle cx="218" cy="118" r="3" fill="#ffffff"/>
        </g>

        {/* Nose & Mouth */}
        <polygon points="195,135 205,135 200,140" fill="#f472b6"/>
        <path d="M 190 145 Q 200 150 200 140 Q 200 150 210 145" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>

        {/* Whiskers */}
        <path d="M 160 130 L 130 125 M 160 135 L 125 135 M 160 140 L 130 145" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
        <path d="M 240 130 L 270 125 M 240 135 L 275 135 M 240 140 L 270 145" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>

        {/* Paws */}
        <rect x="160" y="210" width="20" height="15" rx="7.5" fill="#f8fafc"/>
        <rect x="220" y="210" width="20" height="15" rx="7.5" fill="#f8fafc"/>
        
        {/* Book */}
        <rect x="130" y="220" width="140" height="20" rx="4" fill="#6366f1"/>
        <rect x="135" y="222" width="130" height="16" fill="#ffffff"/>
        <path d="M 180 220 L 180 240 M 200 220 L 200 240" fill="none" stroke="#e0e7ff" strokeWidth="1"/>
      </g>

      {/* Floating Question Marks */}
      <text x="120" y="80" fontSize="30" fill="#a5b4fc" fontWeight="bold" opacity="0.6">
        <animate attributeName="y" values="80;70;80" dur="2s" repeatCount="indefinite"/>
        ?
      </text>
      <text x="280" y="60" fontSize="24" fill="#a5b4fc" fontWeight="bold" opacity="0.4">
        <animate attributeName="y" values="60;50;60" dur="2.5s" repeatCount="indefinite"/>
        ?
      </text>
    </svg>
  );
}
