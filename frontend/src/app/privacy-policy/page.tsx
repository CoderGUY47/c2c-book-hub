"use client";
import React, { useState } from "react";

/* ── Animated SVG Icons ── */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes sh-pulse{0%,100%{opacity:.3}50%{opacity:.9}}
        @keyframes sh-check{0%{stroke-dashoffset:30}100%{stroke-dashoffset:0}}
        .sh-glow{animation:sh-pulse 2s ease-in-out infinite}
        .sh-check{stroke-dasharray:30;animation:sh-check 1.5s ease-in-out infinite alternate}
      `}</style>
      <path d="M32 4 L54 14 L54 32 C54 45 42 56 32 60 C22 56 10 45 10 32 L10 14 Z" fill="#4f46e5" opacity=".8"/>
      <path className="sh-glow" d="M32 8 L50 16 L50 32 C50 42 40 52 32 56 C24 52 14 42 14 32 L14 16 Z" fill="none" stroke="#818cf8" strokeWidth="1.5"/>
      <polyline className="sh-check" points="22,32 29,39 42,26" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes eye-blink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.1)}}
        @keyframes eye-scan{0%,100%{transform:translateX(-6px)}50%{transform:translateX(6px)}}
        .eye-outer{animation:eye-blink 3s ease-in-out infinite;transform-origin:32px 32px}
        .eye-pupil{animation:eye-scan 2.5s ease-in-out infinite}
      `}</style>
      <g className="eye-outer">
        <ellipse cx="32" cy="32" rx="24" ry="14" fill="none" stroke="#6366f1" strokeWidth="3"/>
        <ellipse cx="32" cy="32" rx="24" ry="14" fill="#4f46e5" opacity=".2"/>
      </g>
      <g className="eye-pupil">
        <circle cx="32" cy="32" r="8" fill="#6366f1"/>
        <circle cx="32" cy="32" r="4" fill="#818cf8"/>
        <circle cx="34" cy="30" r="2" fill="white" opacity=".7"/>
      </g>
    </svg>
  );
}
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes sh2-dot{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
        @keyframes sh2-line{0%,100%{opacity:.4}50%{opacity:1}}
        .sh2-d1{animation:sh2-dot 1.5s ease-in-out infinite 0s;transform-origin:14px 32px}
        .sh2-d2{animation:sh2-dot 1.5s ease-in-out infinite .3s;transform-origin:50px 14px}
        .sh2-d3{animation:sh2-dot 1.5s ease-in-out infinite .6s;transform-origin:50px 50px}
        .sh2-line{animation:sh2-line 1.5s ease-in-out infinite}
      `}</style>
      <line className="sh2-line" x1="14" y1="32" x2="50" y2="14" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
      <line className="sh2-line" x1="14" y1="32" x2="50" y2="50" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
      <circle className="sh2-d1" cx="14" cy="32" r="7" fill="#4f46e5"/>
      <circle className="sh2-d2" cx="50" cy="14" r="7" fill="#4f46e5"/>
      <circle className="sh2-d3" cx="50" cy="50" r="7" fill="#4f46e5"/>
    </svg>
  );
}
function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes lk-unlock{0%,70%,100%{transform:translateY(0)}35%{transform:translateY(-4px)}}
        @keyframes lk-key{0%,100%{opacity:.5}50%{opacity:1}}
        .lk-shackle{animation:lk-unlock 3s ease-in-out infinite;transform-origin:32px 22px}
        .lk-key{animation:lk-key 1.5s ease-in-out infinite}
      `}</style>
      <rect x="16" y="28" width="32" height="26" rx="4" fill="#4f46e5"/>
      <circle className="lk-key" cx="32" cy="40" r="5" fill="#818cf8"/>
      <line className="lk-key" x1="32" y1="45" x2="32" y2="50" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
      <path className="lk-shackle" d="M20 28 L20 20 Q20 10 32 10 Q44 10 44 20 L44 28" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}
function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes bl-ring{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-12deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-6deg)}80%{transform:rotate(6deg)}}
        @keyframes bl-dot{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
        .bl-bell{animation:bl-ring 2s ease-in-out infinite 1s;transform-origin:32px 14px}
        .bl-dot{animation:bl-dot 2s ease-in-out infinite}
      `}</style>
      <g className="bl-bell">
        <path d="M32 10 Q20 12 18 28 L16 44 L48 44 L46 28 Q44 12 32 10 Z" fill="#4f46e5"/>
        <rect x="26" y="44" width="12" height="5" rx="2.5" fill="#6366f1"/>
        <circle className="bl-dot" cx="32" cy="10" r="4" fill="#818cf8"/>
        <path d="M28 49 Q32 54 36 49" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ml-flap{0%,100%{transform:rotateX(0deg)}40%,60%{transform:rotateX(-20deg)}}
        @keyframes ml-dash{0%{stroke-dashoffset:60}100%{stroke-dashoffset:0}}
        .ml-env{animation:ml-flap 3s ease-in-out infinite;transform-origin:32px 22px}
        .ml-line{stroke-dasharray:60;animation:ml-dash 2s ease-in-out infinite alternate}
      `}</style>
      <rect x="8" y="20" width="48" height="34" rx="4" fill="#4f46e5"/>
      <g className="ml-env">
        <path d="M8 20 L32 38 L56 20" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <polyline className="ml-line" points="8,54 24,40" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
      <polyline className="ml-line" points="56,54 40,40" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
    </svg>
  );
}

const sections = [
  { Icon: EyeIcon, title: "Information We Collect", color: "border-indigo-500/30 bg-indigo-500/5", iconBg: "bg-indigo-500/10", content: "We collect information from you when you register on our site or place an order. This includes your name, email address, mailing address, phone number, and payment details necessary to process transactions. We may also collect usage data such as pages visited and browsing patterns to improve our services." },
  { Icon: ShieldIcon, title: "How We Use Your Information", color: "border-violet-500/30 bg-violet-500/5", iconBg: "bg-violet-500/10", content: "We use the information we collect to process transactions, personalise your experience, improve our platform, and send relevant communications. Your data is never used for spam or sold to third parties under any circumstances." },
  { Icon: ShareIcon, title: "Sharing Your Information", color: "border-purple-500/30 bg-purple-500/5", iconBg: "bg-purple-500/10", content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent. We may share data with trusted service partners (e.g., delivery services, payment processors) strictly for fulfilling your orders." },
  { Icon: LockIcon, title: "Security of Your Information", color: "border-rose-500/30 bg-rose-500/5", iconBg: "bg-rose-500/10", content: "We implement industry-standard security measures including HTTPS encryption, hashed passwords, and access controls to maintain the safety of your personal information at all times. However, no method of transmission over the Internet is 100% secure." },
  { Icon: BellIcon, title: "Changes to Our Privacy Policy", color: "border-amber-500/30 bg-amber-500/5", iconBg: "bg-amber-500/10", content: "We may update this privacy policy periodically. We will notify you about significant changes by sending a notice to your primary email address or by placing a prominent notice on our site. Continued use of the platform implies acceptance of the updated policy." },
  { Icon: MailIcon, title: "Contact Us", color: "border-teal-500/30 bg-teal-500/5", iconBg: "bg-teal-500/10", content: "If you have any questions about this privacy policy or our practices regarding your personal information, please contact us at support@oxpecker.pro.bd. Our team responds to all privacy-related inquiries within 48 hours." },
];

export default function PrivacyPolicyPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="w-20 h-20 mx-auto mb-8">
            <ShieldIcon className="w-full h-full" />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-indigo-400 mb-4">Your Trust Matters</span>
          <h1 className="text-5xl md:text-7xl font-bold font-langar leading-tight mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            At Book-Hub, we're committed to protecting your privacy. Here's exactly how we collect, use, and protect your data.
          </p>
          <p className="text-gray-600 text-sm mt-4 font-medium">Last Updated: July 18, 2025</p>
        </div>
      </section>

      {/* Sections */}
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

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">Have questions about your privacy? <a href="/contact-us" className="text-indigo-400 hover:underline font-semibold">Contact our team →</a></p>
      </section>
    </main>
  );
}
