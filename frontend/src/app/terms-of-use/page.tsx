"use client";
import React, { useState } from "react";
import Link from "next/link";

/* ── Animated SVG Icons ── */
function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes hs-shake{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
        @keyframes hs-glow{0%,100%{opacity:.2}50%{opacity:.6}}
        .hs-hand{animation:hs-shake 2s ease-in-out infinite;transform-origin:32px 36px}
        .hs-glow{animation:hs-glow 2s ease-in-out infinite}
      `}</style>
      <circle className="hs-glow" cx="32" cy="32" r="28" fill="#7c3aed" opacity=".1"/>
      <g className="hs-hand">
        <path d="M10 36 Q16 28 24 30 L32 28 L40 30 Q48 28 54 36" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"/>
        <path d="M10 36 Q10 46 20 48 L32 50 L44 48 Q54 46 54 36" fill="#4f46e5" opacity=".7"/>
        <path d="M24 30 Q28 24 32 26 Q36 24 40 30" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ui-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes ui-ring{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.7;transform:scale(1.1)}}
        .ui-person{animation:ui-bounce 2s ease-in-out infinite;transform-origin:32px 32px}
        .ui-ring{animation:ui-ring 2s ease-in-out infinite;transform-origin:32px 28px}
      `}</style>
      <circle className="ui-ring" cx="32" cy="22" r="12" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
      <g className="ui-person">
        <circle cx="32" cy="22" r="10" fill="#4f46e5"/>
        <path d="M14 54 Q14 38 32 38 Q50 38 50 54" fill="#4f46e5" opacity=".8"/>
        <circle cx="32" cy="22" r="4" fill="#818cf8"/>
      </g>
    </svg>
  );
}
function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes bo-page{0%,100%{transform:rotateY(0deg)}50%{transform:rotateY(-15deg)}}
        @keyframes bo-glow{0%,100%{opacity:.2}50%{opacity:.6}}
        .bo-page{animation:bo-page 3s ease-in-out infinite;transform-origin:32px 36px}
        .bo-glow{animation:bo-glow 2s ease-in-out infinite}
      `}</style>
      <ellipse className="bo-glow" cx="32" cy="46" rx="26" ry="8" fill="#7c3aed" opacity=".2"/>
      <g className="bo-page">
        <rect x="10" y="14" width="22" height="36" rx="3" fill="#4f46e5"/>
        <rect x="32" y="14" width="22" height="36" rx="3" fill="#6366f1"/>
        <line x1="32" y1="14" x2="32" y2="50" stroke="#1e1b4b" strokeWidth="2"/>
        <line x1="14" y1="22" x2="28" y2="22" stroke="white" strokeWidth="1.5" opacity=".6"/>
        <line x1="14" y1="28" x2="28" y2="28" stroke="white" strokeWidth="1.5" opacity=".5"/>
        <line x1="14" y1="34" x2="28" y2="34" stroke="white" strokeWidth="1.5" opacity=".4"/>
        <line x1="36" y1="22" x2="50" y2="22" stroke="white" strokeWidth="1.5" opacity=".6"/>
        <line x1="36" y1="28" x2="50" y2="28" stroke="white" strokeWidth="1.5" opacity=".5"/>
        <line x1="36" y1="34" x2="50" y2="34" stroke="white" strokeWidth="1.5" opacity=".4"/>
      </g>
    </svg>
  );
}
function EditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ed-write{0%,100%{transform:translate(0,0)}25%{transform:translate(4px,0)}50%{transform:translate(4px,4px)}75%{transform:translate(0,4px)}}
        @keyframes ed-line{0%{width:0}100%{width:100%}}
        .ed-pen{animation:ed-write 3s ease-in-out infinite;transform-origin:40px 24px}
      `}</style>
      <rect x="10" y="14" width="34" height="40" rx="4" fill="#4f46e5" opacity=".8"/>
      <line x1="16" y1="24" x2="38" y2="24" stroke="white" strokeWidth="2" opacity=".6"/>
      <line x1="16" y1="32" x2="38" y2="32" stroke="white" strokeWidth="2" opacity=".5"/>
      <line x1="16" y1="40" x2="30" y2="40" stroke="white" strokeWidth="2" opacity=".4"/>
      <g className="ed-pen">
        <rect x="36" y="12" width="8" height="20" rx="2" transform="rotate(30,40,22)" fill="#818cf8"/>
        <polygon points="40,44 37,50 43,50" fill="#6366f1"/>
      </g>
    </svg>
  );
}
function BanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ban-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes ban-pulse{0%,100%{opacity:.3}50%{opacity:.7}}
        .ban-ring{animation:ban-spin 6s linear infinite;transform-origin:32px 32px}
        .ban-glow{animation:ban-pulse 1.5s ease-in-out infinite}
      `}</style>
      <circle className="ban-glow" cx="32" cy="32" r="26" fill="#ef4444" opacity=".1"/>
      <circle className="ban-ring" cx="32" cy="32" r="22" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="8 4"/>
      <line x1="14" y1="14" x2="50" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}
function MailIcon2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ml2-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .ml2-env{animation:ml2-bounce 2s ease-in-out infinite}
      `}</style>
      <g className="ml2-env">
        <rect x="8" y="20" width="48" height="34" rx="4" fill="#4f46e5" opacity=".8"/>
        <path d="M8 20 L32 38 L56 20" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="8" y1="54" x2="24" y2="40" stroke="#6366f1" strokeWidth="2" opacity=".5"/>
        <line x1="56" y1="54" x2="40" y2="40" stroke="#6366f1" strokeWidth="2" opacity=".5"/>
      </g>
    </svg>
  );
}

const sections = [
  { Icon: HandshakeIcon, title: "Acceptance of Terms", color: "border-indigo-500/30 bg-indigo-500/5", iconBg: "bg-indigo-500/10", content: "By accessing Book-Hub, you accept these terms and conditions in full. If you disagree with any part of these terms, you must not use our platform. Your continued use of the site constitutes agreement to the most current version of these terms." },
  { Icon: UserIcon, title: "User Responsibilities", color: "border-violet-500/30 bg-violet-500/5", iconBg: "bg-violet-500/10", content: "Users are responsible for maintaining the confidentiality of their account credentials and for all activities occurring under their account. You agree not to impersonate other users or engage in any fraudulent or abusive behavior on the platform." },
  { Icon: BookOpenIcon, title: "Selling Books", color: "border-purple-500/30 bg-purple-500/5", iconBg: "bg-purple-500/10", content: "When selling books on Book-Hub, you agree to provide accurate and complete information including the book's condition, edition, and clear photographs. Misrepresentation of book condition is a violation of our terms and may result in account suspension." },
  { Icon: EditIcon, title: "Changes to Terms", color: "border-amber-500/30 bg-amber-500/5", iconBg: "bg-amber-500/10", content: "We may revise these terms from time to time. Revised terms apply to the use of our website from the date of publication. We will notify registered users of significant changes via email or an in-app notification at least 7 days in advance." },
  { Icon: BanIcon, title: "Prohibited Activities", color: "border-rose-500/30 bg-rose-500/5", iconBg: "bg-rose-500/10", content: "Users must not engage in unlawful activities, post offensive content, violate intellectual property rights, or attempt to manipulate pricing or reviews. Book-Hub reserves the right to immediately terminate accounts in breach of these conditions." },
  { Icon: MailIcon2, title: "Contact Us", color: "border-teal-500/30 bg-teal-500/5", iconBg: "bg-teal-500/10", content: "If you have any questions about these terms, please contact us at support@oxpecker.pro.bd. Our legal & support team will respond within 2-3 business days with a full resolution to your query." },
];

export default function TermsOfUsePage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="w-20 h-20 mx-auto mb-8">
            <HandshakeIcon className="w-full h-full" />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-violet-400 mb-4">Platform Rules</span>
          <h1 className="text-5xl md:text-7xl font-bold font-langar leading-tight mb-6">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Use</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            These terms outline the rules and guidelines for using Book-Hub. Please read them carefully before using our platform.
          </p>
          <p className="text-gray-600 text-sm mt-4 font-medium">Last Updated: July 18, 2025</p>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 px-6 bg-white/[0.015] border-b border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Free to Use", sub: "No listing fees" },
            { label: "Verified Users", sub: "DIU community" },
            { label: "Fair Trading", sub: "No fake listings" },
            { label: "Safe Payments", sub: "Encrypted & secure" },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <p className="font-bold text-white text-sm">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${open === i ? s.color : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center gap-5 p-6">
                <div className={`w-14 h-14 rounded-xl ${open === i ? s.iconBg : "bg-white/5"} flex items-center justify-center flex-shrink-0 transition-colors`}>
                  <s.Icon className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold flex-1">{s.title}</h2>
                <span className={`text-2xl font-bold text-gray-600 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
              </div>
              {open === i && (
                <div className="px-6 pb-6 pt-0">
                  <div className="pl-[4.75rem]">
                    <p className="text-gray-400 text-sm leading-relaxed">{s.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">
          Questions about our terms?{" "}
          <Link href="/contact-us" className="text-violet-400 hover:underline font-semibold">Contact us →</Link>
        </p>
      </section>
    </main>
  );
}
