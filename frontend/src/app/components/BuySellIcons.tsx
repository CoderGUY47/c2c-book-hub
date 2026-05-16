"use client";
import React from "react";

/* ─────────────────────────────────────────
   SELL ICONS  (violet / indigo palette)
───────────────────────────────────────── */

/** Sell Step 1 – Post an Ad: book with an uploading arrow */
export function PostAdIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes poi-float {0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes poi-arrow {0%,100%{opacity:1;transform:translateY(0)}50%{opacity:.4;transform:translateY(-6px)}}
        @keyframes poi-spark {0%,100%{opacity:0;transform:scale(0)}40%,60%{opacity:1;transform:scale(1)}}
        .poi-book{animation:poi-float 2.5s ease-in-out infinite}
        .poi-arrow{animation:poi-arrow 1.4s ease-in-out infinite}
        .poi-s1{animation:poi-spark 2s ease-in-out infinite 0s}
        .poi-s2{animation:poi-spark 2s ease-in-out infinite .6s}
        .poi-s3{animation:poi-spark 2s ease-in-out infinite 1.2s}
      `}</style>
      <g className="poi-book">
        {/* Book body */}
        <rect x="28" y="38" width="52" height="62" rx="4" fill="#4f46e5"/>
        <rect x="28" y="38" width="11" height="62" rx="3" fill="#3730a3"/>
        {/* Spine highlight */}
        <rect x="30" y="38" width="3" height="62" rx="1.5" fill="#6366f1" opacity=".5"/>
        {/* Lines */}
        <rect x="44" y="50" width="30" height="3" rx="1.5" fill="white" opacity=".7"/>
        <rect x="44" y="58" width="24" height="3" rx="1.5" fill="white" opacity=".5"/>
        <rect x="44" y="66" width="28" height="3" rx="1.5" fill="white" opacity=".6"/>
        <rect x="44" y="74" width="20" height="3" rx="1.5" fill="white" opacity=".4"/>
      </g>
      {/* Upload arrow */}
      <g className="poi-arrow">
        <line x1="84" y1="48" x2="84" y2="22" stroke="#818cf8" strokeWidth="3" strokeLinecap="round"/>
        <polyline points="78,30 84,22 90,30" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      {/* Sparkles */}
      <circle className="poi-s1" cx="18" cy="45" r="3" fill="#c4b5fd"/>
      <circle className="poi-s2" cx="100" cy="38" r="2.5" fill="#a78bfa"/>
      <circle className="poi-s3" cx="105" cy="65" r="2" fill="#818cf8"/>
    </svg>
  );
}

/** Sell Step 2 – Set Your Price: price tag with spinning coin */
export function SetPriceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes spi-spin {0%{transform:rotateY(0deg)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0deg)}}
        @keyframes spi-bounce {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes spi-pulse {0%,100%{opacity:.6}50%{opacity:1}}
        .spi-coin{animation:spi-spin 2s ease-in-out infinite;transform-origin:85px 40px}
        .spi-tag{animation:spi-bounce 2.5s ease-in-out infinite}
        .spi-glow{animation:spi-pulse 1.5s ease-in-out infinite}
      `}</style>
      {/* Price Tag */}
      <g className="spi-tag">
        <path d="M30 35 L30 75 Q30 80 35 80 L75 80 Q80 80 83 77 L95 65 Q98 62 95 59 L83 47 Q80 44 75 44 L50 44 L50 35 Q50 30 45 30 L35 30 Q30 30 30 35Z" fill="#4f46e5"/>
        <path d="M30 35 L30 75 Q30 80 35 80 L75 80 Q80 80 83 77 L95 65 Q98 62 95 59 L83 47 Q80 44 75 44 L50 44 L50 35 Q50 30 45 30 L35 30 Q30 30 30 35Z" fill="none" stroke="#818cf8" strokeWidth="1.5" opacity=".5"/>
        {/* Hole */}
        <circle cx="42" cy="37" r="4" fill="#1e1b4b"/>
        {/* Dollar sign */}
        <text x="62" y="68" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">৳</text>
      </g>
      {/* Coin */}
      <g className="spi-coin">
        <ellipse cx="85" cy="40" rx="14" ry="14" fill="#fbbf24"/>
        <ellipse cx="85" cy="40" rx="11" ry="11" fill="#f59e0b"/>
        <text x="85" y="45" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="bold" fontFamily="sans-serif">$</text>
      </g>
      {/* Glow ring */}
      <circle className="spi-glow" cx="85" cy="40" r="17" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity=".4"/>
    </svg>
  );
}

/** Sell Step 3 – Get Paid: wallet with coins flying out */
export function GetPaidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes gpi-c1{0%,100%{transform:translate(0,0);opacity:0}20%{opacity:1}80%{transform:translate(-18px,-22px);opacity:1}100%{transform:translate(-22px,-28px);opacity:0}}
        @keyframes gpi-c2{0%,100%{transform:translate(0,0);opacity:0}20%{opacity:1}80%{transform:translate(10px,-24px);opacity:1}100%{transform:translate(14px,-30px);opacity:0}}
        @keyframes gpi-c3{0%,100%{transform:translate(0,0);opacity:0}20%{opacity:1}80%{transform:translate(22px,-18px);opacity:1}100%{transform:translate(28px,-22px);opacity:0}}
        @keyframes gpi-check{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}
        @keyframes gpi-wallet{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .gpi-c1{animation:gpi-c1 2s ease-out infinite .2s}
        .gpi-c2{animation:gpi-c2 2s ease-out infinite .5s}
        .gpi-c3{animation:gpi-c3 2s ease-out infinite .1s}
        .gpi-wallet{animation:gpi-wallet 2.5s ease-in-out infinite}
        .gpi-check{stroke-dasharray:40;animation:gpi-check 1s ease-in-out infinite alternate}
      `}</style>
      <g className="gpi-wallet">
        {/* Wallet body */}
        <rect x="20" y="50" width="68" height="45" rx="6" fill="#4f46e5"/>
        <rect x="20" y="50" width="68" height="12" rx="3" fill="#3730a3"/>
        {/* Card slot */}
        <rect x="68" y="60" width="20" height="22" rx="4" fill="#312e81"/>
        <circle cx="76" cy="71" r="5" fill="#6366f1"/>
        {/* Check */}
        <polyline className="gpi-check" points="30,72 40,82 55,65" fill="none" stroke="#86efac" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      {/* Flying coins */}
      <circle className="gpi-c1" cx="54" cy="50" r="7" fill="#fbbf24"/>
      <circle className="gpi-c2" cx="54" cy="50" r="6" fill="#f59e0b"/>
      <circle className="gpi-c3" cx="54" cy="50" r="5" fill="#fbbf24"/>
      {/* Coin labels */}
      <text className="gpi-c1" x="54" y="54" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="bold" fontFamily="sans-serif">$</text>
      <text className="gpi-c2" x="54" y="53" textAnchor="middle" fill="#78350f" fontSize="7" fontWeight="bold" fontFamily="sans-serif">$</text>
      <text className="gpi-c3" x="54" y="53" textAnchor="middle" fill="#78350f" fontSize="6" fontWeight="bold" fontFamily="sans-serif">$</text>
    </svg>
  );
}

/* ─────────────────────────────────────────
   BUY ICONS  (purple palette)
───────────────────────────────────────── */

/** Buy Step 1 – Browse Books: books with scanning magnifier */
export function BrowseBooksIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes bbi-scan{0%{transform:translateX(-18px)}100%{transform:translateX(18px)}}
        @keyframes bbi-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes bbi-glow{0%,100%{opacity:.3}50%{opacity:.8}}
        .bbi-mag{animation:bbi-scan 2s ease-in-out infinite alternate}
        .bbi-b1{animation:bbi-float 2.2s ease-in-out infinite 0s}
        .bbi-b2{animation:bbi-float 2.2s ease-in-out infinite .4s}
        .bbi-b3{animation:bbi-float 2.2s ease-in-out infinite .8s}
        .bbi-glow{animation:bbi-glow 2s ease-in-out infinite}
      `}</style>
      {/* Shelf */}
      <rect x="15" y="88" width="90" height="5" rx="2.5" fill="#581c87"/>
      {/* Book 1 */}
      <g className="bbi-b1">
        <rect x="20" y="52" width="20" height="36" rx="3" fill="#7c3aed"/>
        <rect x="20" y="52" width="6" height="36" rx="2" fill="#6d28d9"/>
        <rect x="28" y="60" width="9" height="2" rx="1" fill="white" opacity=".6"/>
        <rect x="28" y="65" width="7" height="2" rx="1" fill="white" opacity=".4"/>
        <rect x="28" y="70" width="9" height="2" rx="1" fill="white" opacity=".5"/>
      </g>
      {/* Book 2 */}
      <g className="bbi-b2">
        <rect x="44" y="44" width="22" height="44" rx="3" fill="#9333ea"/>
        <rect x="44" y="44" width="7" height="44" rx="2" fill="#7e22ce"/>
        <rect x="54" y="54" width="9" height="2" rx="1" fill="white" opacity=".6"/>
        <rect x="54" y="60" width="7" height="2" rx="1" fill="white" opacity=".4"/>
        <rect x="54" y="66" width="9" height="2" rx="1" fill="white" opacity=".6"/>
        <rect x="54" y="72" width="6" height="2" rx="1" fill="white" opacity=".4"/>
      </g>
      {/* Book 3 */}
      <g className="bbi-b3">
        <rect x="70" y="56" width="18" height="32" rx="3" fill="#a855f7"/>
        <rect x="70" y="56" width="5" height="32" rx="2" fill="#9333ea"/>
        <rect x="77" y="64" width="8" height="2" rx="1" fill="white" opacity=".6"/>
        <rect x="77" y="70" width="6" height="2" rx="1" fill="white" opacity=".4"/>
        <rect x="77" y="76" width="8" height="2" rx="1" fill="white" opacity=".5"/>
      </g>
      {/* Magnifier */}
      <g className="bbi-mag">
        <circle cx="60" cy="40" r="13" fill="none" stroke="#e879f9" strokeWidth="3"/>
        <circle className="bbi-glow" cx="60" cy="40" r="13" fill="#c026d3" opacity=".15"/>
        <line x1="69.5" y1="49.5" x2="78" y2="58" stroke="#e879f9" strokeWidth="3.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

/** Buy Step 2 – Place Order: book flying into cart */
export function PlaceOrderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes poi2-fly{0%{transform:translate(0,0) rotate(0deg);opacity:1}70%{transform:translate(22px,20px) rotate(15deg);opacity:1}100%{transform:translate(28px,26px) rotate(20deg);opacity:0}}
        @keyframes poi2-cart{0%,80%{transform:translateX(0)}85%{transform:translateX(-4px)}90%{transform:translateX(3px)}95%{transform:translateX(-2px)}100%{transform:translateX(0)}}
        @keyframes poi2-spark{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}
        .poi2-book{animation:poi2-fly 2s ease-in-out infinite}
        .poi2-cart{animation:poi2-cart 2s ease-in-out infinite}
        .poi2-s1{animation:poi2-spark 2s ease-in-out infinite .4s}
        .poi2-s2{animation:poi2-spark 2s ease-in-out infinite .8s}
      `}</style>
      {/* Cart */}
      <g className="poi2-cart">
        <path d="M38 55 L42 55 L50 82 L88 82 L94 60 L46 60" fill="none" stroke="#9333ea" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="57" cy="89" r="4" fill="#a855f7"/>
        <circle cx="79" cy="89" r="4" fill="#a855f7"/>
        {/* Items in cart */}
        <rect x="52" y="64" width="12" height="14" rx="2" fill="#7c3aed" opacity=".7"/>
        <rect x="68" y="64" width="12" height="14" rx="2" fill="#9333ea" opacity=".7"/>
      </g>
      {/* Flying book */}
      <g className="poi2-book">
        <rect x="22" y="30" width="24" height="30" rx="3" fill="#7c3aed"/>
        <rect x="22" y="30" width="7" height="30" rx="2" fill="#6d28d9"/>
        <rect x="31" y="38" width="12" height="2" rx="1" fill="white" opacity=".7"/>
        <rect x="31" y="44" width="9" height="2" rx="1" fill="white" opacity=".5"/>
        <rect x="31" y="50" width="11" height="2" rx="1" fill="white" opacity=".6"/>
      </g>
      {/* Sparkles on impact */}
      <circle className="poi2-s1" cx="75" cy="60" r="4" fill="#e879f9"/>
      <circle className="poi2-s2" cx="85" cy="54" r="3" fill="#c026d3"/>
    </svg>
  );
}

/** Buy Step 3 – Fast Delivery: truck with motion lines */
export function DeliveryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes di-truck{0%,100%{transform:translateX(0) translateY(0)}25%{transform:translateX(2px) translateY(-1px)}75%{transform:translateX(-1px) translateY(1px)}}
        @keyframes di-line1{0%{transform:translateX(0);opacity:.8}100%{transform:translateX(-20px);opacity:0}}
        @keyframes di-line2{0%{transform:translateX(0);opacity:.6}100%{transform:translateX(-20px);opacity:0}}
        @keyframes di-wheel{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes di-cloud{0%,100%{opacity:.4}50%{opacity:.8}}
        .di-truck{animation:di-truck 0.4s ease-in-out infinite}
        .di-l1{animation:di-line1 .8s ease-out infinite}
        .di-l2{animation:di-line2 .8s ease-out infinite .15s}
        .di-l3{animation:di-line2 .8s ease-out infinite .3s}
        .di-w1{animation:di-wheel 1s linear infinite;transform-origin:38px 85px}
        .di-w2{animation:di-wheel 1s linear infinite;transform-origin:75px 85px}
        .di-spark{animation:di-cloud 1.5s ease-in-out infinite}
      `}</style>
      {/* Motion lines */}
      <line className="di-l1" x1="30" y1="60" x2="10" y2="60" stroke="#c026d3" strokeWidth="2.5" strokeLinecap="round"/>
      <line className="di-l2" x1="28" y1="68" x2="12" y2="68" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
      <line className="di-l3" x1="25" y1="76" x2="14" y2="76" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Truck */}
      <g className="di-truck">
        {/* Cargo */}
        <rect x="28" y="48" width="55" height="35" rx="3" fill="#7c3aed"/>
        <rect x="28" y="48" width="55" height="8" rx="2" fill="#6d28d9"/>
        {/* Package */}
        <rect x="38" y="58" width="20" height="18" rx="2" fill="#9333ea"/>
        <line x1="48" y1="58" x2="48" y2="76" stroke="#6d28d9" strokeWidth="1.5"/>
        <line x1="38" y1="67" x2="58" y2="67" stroke="#6d28d9" strokeWidth="1.5"/>
        {/* Cab */}
        <path d="M83 56 L83 83 L98 83 L98 65 Q98 56 90 56 Z" fill="#9333ea"/>
        <rect x="85" y="60" width="8" height="8" rx="2" fill="#bfdbfe" opacity=".9"/>
        {/* Cab join */}
        <rect x="80" y="56" width="5" height="27" fill="#7c3aed"/>
      </g>
      {/* Wheels */}
      <circle className="di-w1" cx="38" cy="85" r="8" fill="#312e81" stroke="#818cf8" strokeWidth="2"/>
      <circle cx="38" cy="85" r="3" fill="#818cf8"/>
      <circle className="di-w2" cx="75" cy="85" r="8" fill="#312e81" stroke="#818cf8" strokeWidth="2"/>
      <circle cx="75" cy="85" r="3" fill="#818cf8"/>
      <circle cx="92" cy="85" r="7" fill="#312e81" stroke="#a855f7" strokeWidth="2"/>
      <circle cx="92" cy="85" r="2.5" fill="#a855f7"/>
      {/* Speed stars */}
      <circle className="di-spark" cx="105" cy="52" r="3" fill="#e879f9"/>
      <circle className="di-spark" cx="110" cy="63" r="2" fill="#c026d3"/>
    </svg>
  );
}
