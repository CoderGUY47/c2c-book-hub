"use client";
export function FreeReadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes fr-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes fr-spark{0%,100%{opacity:0;transform:scale(0)}40%,60%{opacity:1;transform:scale(1)}}
        .fr-star{animation:fr-spin 8s linear infinite;transform-origin:24px 24px}
        .fr-s1{animation:fr-spark 2s ease-in-out infinite 0s}
        .fr-s2{animation:fr-spark 2s ease-in-out infinite .5s}
        .fr-s3{animation:fr-spark 2s ease-in-out infinite 1s}
        .fr-s4{animation:fr-spark 2s ease-in-out infinite 1.5s}
      `}</style>
      <g className="fr-star">
        <polygon points="24,6 27,18 39,18 29,26 33,38 24,30 15,38 19,26 9,18 21,18" fill="#4f46e5"/>
        <polygon points="24,10 26.5,19 35,19 28,24 30.5,33 24,28 17.5,33 20,24 13,19 21.5,19" fill="#818cf8" opacity=".5"/>
      </g>
      <circle className="fr-s1" cx="8" cy="8" r="2.5" fill="#c4b5fd"/>
      <circle className="fr-s2" cx="40" cy="8" r="2" fill="#818cf8"/>
      <circle className="fr-s3" cx="40" cy="40" r="2.5" fill="#c4b5fd"/>
      <circle className="fr-s4" cx="8" cy="40" r="2" fill="#818cf8"/>
    </svg>
  );
}
