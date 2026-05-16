"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Package, Clock, ShieldCheck } from "lucide-react";

/* ── Animated SVG Icons ── */
function ReturnBoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes rb-lid{0%,100%{transform:rotateX(0deg)}40%,60%{transform:rotateX(-25deg)}}
        @keyframes rb-arrow{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes rb-pulse{0%,100%{opacity:.3}50%{opacity:.8}}
        .rb-lid{animation:rb-lid 3s ease-in-out infinite;transform-origin:60px 48px}
        .rb-arrow{animation:rb-arrow 1.5s ease-in-out infinite}
        .rb-glow{animation:rb-pulse 2s ease-in-out infinite}
      `}</style>
      <rect x="25" y="55" width="70" height="45" rx="4" fill="#4f46e5"/>
      <rect x="25" y="55" width="70" height="10" rx="2" fill="#3730a3"/>
      <g className="rb-lid">
        <rect x="20" y="40" width="80" height="18" rx="4" fill="#6366f1"/>
        <rect x="48" y="34" width="24" height="12" rx="3" fill="#818cf8"/>
      </g>
      <g className="rb-arrow">
        <path d="M60 72 L60 90 M54 82 L60 90 L66 82" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".8"/>
      </g>
      <circle className="rb-glow" cx="60" cy="60" r="50" fill="none" stroke="#6366f1" strokeWidth="1"/>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ci-check{0%{stroke-dashoffset:60}100%{stroke-dashoffset:0}}
        @keyframes ci-ring{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes ci-glow{0%,100%{opacity:.2}50%{opacity:.6}}
        .ci-check{stroke-dasharray:60;animation:ci-check 1.5s ease-in-out infinite alternate;transform-origin:60px 60px}
        .ci-ring{animation:ci-ring 2s ease-in-out infinite;transform-origin:60px 60px}
        .ci-glow{animation:ci-glow 2s ease-in-out infinite}
      `}</style>
      <circle className="ci-glow" cx="60" cy="60" r="48" fill="#22c55e" opacity=".15"/>
      <circle className="ci-ring" cx="60" cy="60" r="38" fill="none" stroke="#22c55e" strokeWidth="3"/>
      <polyline className="ci-check" points="40,62 54,76 80,44" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes clk-hand{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes clk-min{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes clk-pulse{0%,100%{opacity:.3}50%{opacity:.7}}
        .clk-hand{animation:clk-hand 6s linear infinite;transform-origin:60px 60px}
        .clk-min{animation:clk-min 1s linear infinite;transform-origin:60px 60px}
        .clk-glow{animation:clk-pulse 2s ease-in-out infinite}
      `}</style>
      <circle className="clk-glow" cx="60" cy="60" r="46" fill="#f59e0b" opacity=".1"/>
      <circle cx="60" cy="60" r="38" fill="none" stroke="#f59e0b" strokeWidth="3"/>
      <circle cx="60" cy="60" r="3" fill="#f59e0b"/>
      <line className="clk-hand" x1="60" y1="60" x2="60" y2="30" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
      <line className="clk-min" x1="60" y1="60" x2="60" y2="35" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
    </svg>
  );
}

const steps = [
  { Icon: ReturnBoxIcon, step: "01", title: "Initiate Return", desc: "Go to your order history, select the book and click 'Return Request'. Describe the issue briefly." },
  { Icon: CheckIcon, step: "02", title: "Approval", desc: "Our team reviews your request within 24 hours and sends you a pickup confirmation." },
  { Icon: ClockIcon, step: "03", title: "Refund Processed", desc: "Once the book is received and verified, your refund is processed within 2-3 business days." },
];

const eligible = [
  "Book condition is significantly worse than described by the seller",
  "Wrong book was delivered to you",
  "Book has missing pages or severe undisclosed damage",
  "Delivery was delayed by more than 7 days past expected date",
];
const notEligible = [
  "Change of mind after purchase",
  "Book condition matches the seller's description",
  "Return requested after the 3-day window has passed",
  "Books marked as 'Final Sale' or heavily discounted (>60%)",
];

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-indigo-400 mb-6">Customer First</span>
          <h1 className="text-5xl md:text-7xl font-bold font-langar leading-tight mb-6">
            Return <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            We stand behind every purchase. If something's not right, we'll make it right — with a fair, transparent return process.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-6 py-2 text-indigo-300 text-sm font-bold">
            <ShieldCheck className="w-4 h-4" /> 3-Day Return Window on Eligible Orders
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-violet-400">Process</span>
            <h2 className="text-4xl font-bold font-langar mt-3">How to Return a Book</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all duration-500 text-center">
                <div className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none">{s.step}</div>
                <div className="w-28 h-28 mx-auto mb-6">
                  <s.Icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligible / Not Eligible */}
      <section className="py-24 px-6 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-violet-400">Conditions</span>
            <h2 className="text-4xl font-bold font-langar mt-3">What Qualifies for a Return?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-300">Eligible for Return</h3>
              </div>
              <ul className="space-y-4">
                {eligible.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-300">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-4">
                {notEligible.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Info Cards */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { Icon: RefreshCcw, title: "3-Day Window", desc: "Returns must be initiated within 3 days of delivery confirmation.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
              { Icon: Package, title: "Original Condition", desc: "Books must be returned in the same condition they were received.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { Icon: AlertCircle, title: "Seller Protection", desc: "Sellers are protected against fraudulent returns. All requests are reviewed.", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
            ].map((card, i) => (
              <div key={i} className={`border rounded-2xl p-7 ${card.bg}`}>
                <card.Icon className={`w-8 h-8 ${card.color} mb-4`} />
                <h3 className="font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-white/5">
        <h2 className="text-3xl font-bold font-langar mb-3">Need help with a return?</h2>
        <p className="text-gray-400 mb-8 font-medium">Our support team will guide you through the entire process.</p>
        <Link href="/contact-us" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          Contact Support <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
}
