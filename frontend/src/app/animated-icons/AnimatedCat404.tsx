"use client";
import React from "react";

export function AnimatedCat404({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 600" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes tail-wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 96%, 98%, 100% { transform: scaleY(1); }
          97%, 99% { transform: scaleY(0.1); }
        }
        @keyframes plant-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        .tail { animation: tail-wag 4s ease-in-out infinite; transform-origin: 390px 400px; }
        .floating-cat { animation: float 6s ease-in-out infinite; transform-origin: center; }
        .eye { animation: blink 5s infinite; transform-origin: center; }
        .plant { animation: plant-sway 5s ease-in-out infinite; transform-origin: 620px 450px; }
      `}</style>

      {/* Abstract Background Blob */}
      <path d="M150,300 C150,150 250,50 400,50 C580,50 650,200 650,350 C650,500 550,550 400,550 C250,550 150,450 150,300 Z" fill="#93c5fd" opacity="0.8"/>
      
      {/* Floor Line */}
      <line x1="180" y1="480" x2="620" y2="480" stroke="#1e293b" strokeWidth="2" strokeDasharray="10 10 200 10 20 100"/>

      {/* 4 0 4 Background Text */}
      <g fill="#1e293b" fontFamily="sans-serif" fontWeight="900" fontSize="280" letterSpacing="-10">
        <text x="180" y="320">4</text>
        <text x="540" y="320">4</text>
      </g>
      
      {/* The "0" as a thick ring/hole */}
      <path d="M 400,100 C 330,100 290,160 290,240 C 290,320 330,380 400,380 C 470,380 510,320 510,240 C 510,160 470,100 400,100 Z M 400,150 C 440,150 455,190 455,240 C 455,290 440,330 400,330 C 360,330 345,290 345,240 C 345,190 360,150 400,150 Z" fill="#1e293b" />

      {/* Back half of the cat (inside the 0) */}
      <g className="floating-cat">
        {/* Body inside */}
        <path d="M350,240 C350,320 450,320 450,240" fill="#e2e8f0" />
      </g>

      {/* Front half of the cat (coming out of the 0) */}
      <g className="floating-cat">
        {/* Cat Body (Lower half hanging) */}
        <path d="M350,240 C350,420 450,420 450,240" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3"/>
        
        {/* Cat Head */}
        <path d="M330,180 C330,120 470,120 470,180 C470,230 330,230 330,180 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3"/>
        
        {/* Ears */}
        <path d="M340,140 L330,90 L380,120 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M338,135 L332,100 L370,122 Z" fill="#3b82f6"/>
        
        <path d="M460,140 L470,90 L420,120 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M462,135 L468,100 L430,122 Z" fill="#3b82f6"/>
        
        {/* Head Stripes */}
        <path d="M380,120 L385,145 M400,118 L400,148 M420,120 L415,145" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"/>

        {/* Face Details */}
        <path d="M375,170 Q385,160 390,170" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        <path d="M425,170 Q415,160 410,170" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        
        <g className="eye">
          <circle cx="382" cy="175" r="4" fill="#1e293b"/>
          <circle cx="418" cy="175" r="4" fill="#1e293b"/>
        </g>
        
        <path d="M400,190 L395,185 L405,185 Z" fill="#3b82f6"/>
        <path d="M400,190 Q390,200 380,195 M400,190 Q410,200 420,195" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Whiskers */}
        <path d="M360,185 L340,180 M360,192 L335,192 M365,199 L345,204" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
        <path d="M440,185 L460,180 M440,192 L465,192 M435,199 L455,204" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>

        {/* Arms (Hanging over the 0) */}
        <path d="M345,240 C320,240 320,290 340,290 C350,290 355,270 355,270" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        <path d="M328,260 L338,255 M330,270 L342,265" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round"/>
        <path d="M340,290 L340,280 M333,288 L335,280 M347,288 L345,280" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
        
        <path d="M455,240 C480,240 480,290 460,290 C450,290 445,270 445,270" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        <path d="M472,260 L462,255 M470,270 L458,265" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round"/>
        <path d="M460,290 L460,280 M467,288 L465,280 M453,288 L455,280" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>

        {/* Left Leg */}
        <path d="M360,350 C340,350 340,380 370,380 C380,380 390,360 390,360" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        <path d="M370,380 L370,370 M363,378 L365,370 M377,378 L375,370" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>

        {/* Right Leg (Lifted up) */}
        <path d="M430,320 C470,320 480,350 460,370 C440,390 430,360 430,360" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="450" cy="355" r="5" fill="none" stroke="#1e293b" strokeWidth="2"/>
        <circle cx="462" cy="345" r="4" fill="none" stroke="#1e293b" strokeWidth="2"/>
        <circle cx="470" cy="355" r="4" fill="none" stroke="#1e293b" strokeWidth="2"/>
        <circle cx="465" cy="365" r="4" fill="none" stroke="#1e293b" strokeWidth="2"/>

        {/* Tail */}
        <g className="tail">
          <path d="M390,370 C390,480 320,440 320,400 C320,380 350,380 350,400 C350,420 370,440 370,370" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round"/>
          <path d="M390,370 C390,480 320,440 320,400 C320,380 350,380 350,400 C350,420 370,440 370,370" fill="none" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" opacity="0.1"/>
          
          <path d="M390,370 C390,480 320,440 320,400 C320,380 350,380 350,400 C350,420 370,440 370,370" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round"/>
          <path d="M322,390 C330,385 340,390 345,400" fill="none" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round"/>
          <path d="M335,420 L350,430 M360,435 L372,425 M378,405 L382,390" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round"/>
          <path d="M390,370 C390,480 320,440 320,400 C320,380 350,380 350,400 C350,420 370,440 370,370" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </g>

      {/* "0" Overlap to create illusion of cat coming through */}
      <path d="M 345,240 C 345,300 365,330 400,330 C 435,330 455,300 455,240 L 510,240 C 510,320 470,380 400,380 C 330,380 290,320 290,240 Z" fill="#1e293b" />

      {/* Plant */}
      <g className="plant" fill="#0ea5e9">
        {/* Stems */}
        <path d="M600,450 Q580,380 540,350 M600,450 Q620,370 650,320 M600,450 Q630,400 680,400" fill="none" stroke="#1e293b" strokeWidth="3"/>
        {/* Leaves */}
        <path d="M540,350 Q560,330 580,350 Q560,370 540,350 Z" />
        <path d="M560,380 Q520,380 520,400 Q540,410 560,380 Z" />
        <path d="M610,390 Q600,350 630,340 Q630,380 610,390 Z" />
        <path d="M650,320 Q660,280 690,290 Q670,330 650,320 Z" />
        <path d="M640,360 Q670,340 680,360 Q660,380 640,360 Z" />
        <path d="M610,430 Q650,410 660,430 Q640,450 610,430 Z" />
        
        {/* Pot */}
        <path d="M580,450 L620,450 L610,490 L590,490 Z" fill="#1e293b"/>
      </g>

      {/* Ball of Yarn */}
      <g transform="translate(420, 430)">
        <path d="M -50,100 C -150,110 50,130 50,100 C 50,80 -20,80 -20,100 C -20,110 -50,110 -50,100 Z" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round"/>
        <path d="M -50,100 C -150,110 50,130 50,100 C 50,80 -20,80 -20,100 C -20,110 -50,110 -50,100 Z" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
        
        <circle cx="0" cy="50" r="30" fill="#f8fafc" stroke="#1e293b" strokeWidth="3"/>
        <path d="M -20,30 Q 0,20 20,40 M -28,45 Q 0,40 28,55 M -25,65 Q 0,60 25,70" fill="none" stroke="#1e293b" strokeWidth="2"/>
        <path d="M -10,22 Q -5,50 5,79 M 5,20 Q 15,50 18,75 M -20,28 Q -15,50 -10,78 M 18,25 Q 25,45 28,60" fill="none" stroke="#1e293b" strokeWidth="2"/>
      </g>
    </svg>
  );
}
