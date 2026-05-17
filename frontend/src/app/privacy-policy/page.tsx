import React from "react";

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
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden border-b border-white/5">
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
          <p className="text-gray-600 text-sm mt-4 font-medium" suppressHydrationWarning>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </section>

      {/* Grid Sections */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`border rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300 ${s.color} flex flex-col`}
            >
              <div className={`w-16 h-16 rounded-2xl ${s.iconBg} flex items-center justify-center mb-6`}>
                <s.Icon className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold mb-3">{s.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PLATFORM INFO — BENTO GRID
      ══════════════════════════════════════════════════════ */}
      <section className="w-[90%] max-w-7xl mx-auto px-4 pt-10 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-violet-500" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-violet-400 uppercase">Platform Transparency</p>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">How Book-Hub Keeps You Safe &amp; Verified</h2>
        <p className="text-white/40 text-sm mb-6 max-w-2xl">Our institutional email policy, JWT-powered sessions, and Google OAuth make Book-Hub the most secure book marketplace in Bangladesh — far ahead of legacy platforms.</p>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

          {/* ── CELL 1: Edu Mail Hero (wide) ── */}
          <div className="md:col-span-7 bg-white/[0.03] border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
            <div className="flex items-start gap-5 relative z-10">
              <div className="flex-shrink-0">
                {/* Animated EDU Mail Icon */}
                <svg viewBox="0 0 64 64" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
                  <style>{`
                    @keyframes em-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
                    @keyframes em-glow{0%,100%{opacity:.2}50%{opacity:.7}}
                    @keyframes em-badge{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
                    .em-env{animation:em-bounce 2.5s ease-in-out infinite}
                    .em-glow{animation:em-glow 2s ease-in-out infinite}
                    .em-badge{animation:em-badge 2s ease-in-out infinite}
                  `}</style>
                  <circle className="em-glow" cx="32" cy="32" r="30" fill="#6366f1" opacity=".1"/>
                  <g className="em-env">
                    <rect x="10" y="18" width="44" height="30" rx="4" fill="#4f46e5" opacity=".85"/>
                    <path d="M10 18 L32 34 L54 18" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="10" y1="48" x2="24" y2="36" stroke="#6366f1" strokeWidth="1.5" opacity=".5"/>
                    <line x1="54" y1="48" x2="40" y2="36" stroke="#6366f1" strokeWidth="1.5" opacity=".5"/>
                  </g>
                  <g className="em-badge">
                    <circle cx="48" cy="16" r="10" fill="#22c55e"/>
                    <text x="48" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">✓</text>
                  </g>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-indigo-400">Institutional Email Policy</span>
                <h3 className="text-base font-bold text-white mt-1 mb-2 leading-snug">Why Your .edu or Govt Mail is Required</h3>
                <p className="text-white/50 text-xs leading-relaxed">Book-Hub is built exclusively for verified students and institutional users. Your <span className="text-indigo-300 font-semibold">@diu.edu.bd</span>, <span className="text-indigo-300 font-semibold">@edu.bd</span>, or government-issued email proves you're a real member of an academic community — not a random reseller or bot.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["@diu.edu.bd", "@edu.bd", "@gov.bd", "@ac.bd"].map(d => (
                    <span key={d} className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] font-bold rounded-sm">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── CELL 2: Why Verified (narrow) ── */}
          <div className="md:col-span-5 bg-white/[0.03] border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <svg viewBox="0 0 64 64" className="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  @keyframes sc-check{0%{stroke-dashoffset:50}100%{stroke-dashoffset:0}}
                  @keyframes sc-ring{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.12);opacity:.7}}
                  .sc-check{stroke-dasharray:50;animation:sc-check 2s ease-in-out infinite alternate}
                  .sc-ring{animation:sc-ring 2.5s ease-in-out infinite;transform-origin:32px 32px}
                `}</style>
                <circle className="sc-ring" cx="32" cy="32" r="28" fill="none" stroke="#22c55e" strokeWidth="2"/>
                <circle cx="32" cy="32" r="20" fill="#166534" opacity=".4"/>
                <polyline className="sc-check" points="20,32 28,40 44,24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-sm font-bold text-white mb-2">Why Verification Matters</h3>
              <ul className="space-y-1.5">
                {[
                  "Prevents fake listings & resellers",
                  "Creates a trusted student community",
                  "Protects both buyers and sellers",
                  "Only verified users can list books",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-white/50">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── CELL 3: JWT Security ── */}
          <div className="md:col-span-4 bg-white/[0.03] border border-violet-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-violet-500/40 transition-all duration-300">
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <svg viewBox="0 0 64 64" className="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  @keyframes jt-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
                  @keyframes jt-pulse{0%,100%{opacity:.2}50%{opacity:.7}}
                  .jt-ring{animation:jt-spin 8s linear infinite;transform-origin:32px 32px}
                  .jt-glow{animation:jt-pulse 2s ease-in-out infinite}
                `}</style>
                <circle className="jt-glow" cx="32" cy="32" r="28" fill="#7c3aed" opacity=".1"/>
                <circle className="jt-ring" cx="32" cy="32" r="24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="6 4"/>
                <rect x="20" y="26" width="24" height="20" rx="3" fill="#4f46e5"/>
                <path d="M24 26 L24 22 Q24 14 32 14 Q40 14 40 22 L40 26" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="32" cy="35" r="3" fill="#c4b5fd"/>
                <line x1="32" y1="38" x2="32" y2="42" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-violet-400">JWT Authentication</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-2">Token-Based Security</h3>
              <p className="text-white/45 text-[11px] leading-relaxed">Every session uses signed <strong className="text-violet-300">JSON Web Tokens (JWT)</strong> with short expiry windows. Unlike cookie-only sessions, JWTs are stateless, tamper-proof, and validated on every request — your data never sits exposed.</p>
            </div>
          </div>

          {/* ── CELL 4: Google OAuth ── */}
          <div className="md:col-span-4 bg-white/[0.03] border border-amber-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            <div className="relative z-10">
              <svg viewBox="0 0 64 64" className="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  @keyframes go-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
                  @keyframes go-pulse{0%,100%{opacity:.15}50%{opacity:.5}}
                  .go-ring{animation:go-spin 5s linear infinite;transform-origin:32px 32px}
                  .go-glow{animation:go-pulse 2s ease-in-out infinite}
                `}</style>
                <circle className="go-glow" cx="32" cy="32" r="28" fill="#f59e0b" opacity=".1"/>
                <circle className="go-ring" cx="32" cy="32" r="22" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 5"/>
                <circle cx="32" cy="32" r="13" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5"/>
                <text x="32" y="37" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="sans-serif">G</text>
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-400">Google OAuth 2.0</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-2">Delegated Login Security</h3>
              <p className="text-white/45 text-[11px] leading-relaxed">We never store your Google password. OAuth 2.0 delegates identity to Google's own servers — we only receive a verified token. Your credentials stay in Google's vault, protected by their world-class security infrastructure.</p>
            </div>
          </div>

          {/* ── CELL 5: vs Rokomari ── */}
          <div className="md:col-span-4 bg-gradient-to-br from-rose-950/40 to-gray-950 border border-rose-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-rose-500/40 transition-all duration-300">
            <div className="relative z-10">
              <svg viewBox="0 0 64 64" className="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  @keyframes vs-shield{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
                  @keyframes vs-glow{0%,100%{opacity:.2}50%{opacity:.6}}
                  .vs-shield{animation:vs-shield 2.5s ease-in-out infinite;transform-origin:32px 36px}
                  .vs-glow{animation:vs-glow 2s ease-in-out infinite}
                `}</style>
                <circle className="vs-glow" cx="32" cy="32" r="28" fill="#10b981" opacity=".1"/>
                <g className="vs-shield">
                  <path d="M32 8 L50 16 L50 34 C50 44 40 54 32 58 C24 54 14 44 14 34 L14 16 Z" fill="#065f46" opacity=".7"/>
                  <path d="M32 8 L50 16 L50 34 C50 44 40 54 32 58 C24 54 14 44 14 34 L14 16 Z" fill="none" stroke="#10b981" strokeWidth="2"/>
                  <polyline points="22,33 29,40 44,26" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-rose-400">Security Comparison</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-2">Book-Hub vs Rokomari</h3>
              <div className="space-y-1.5">
                {[
                  { label: "Institutional Verification", us: true, them: false },
                  { label: "JWT Token Sessions", us: true, them: false },
                  { label: "Google OAuth 2.0", us: true, them: false },
                  { label: "C2C Seller Trust", us: true, them: false },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <span className="text-white/50">{row.label}</span>
                    <div className="flex items-center gap-3">
                      <span className={row.us ? "text-emerald-400 font-bold" : "text-rose-400"}>Book-Hub ✓</span>
                      <span className={row.them ? "text-emerald-400" : "text-white/20 line-through"}>Rokomari ✗</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CELL 6: Email Rules (full width) ── */}
          <div className="md:col-span-12 bg-white/[0.02] border border-white/[0.07] rounded-xl p-5 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Eligible Email Domains</h4>
                </div>
                <p className="text-white/40 text-[11px] leading-relaxed">Only emails from recognised academic or government institutions are accepted. This includes <strong className="text-white/60">@diu.edu.bd</strong>, <strong className="text-white/60">@edu.bd</strong>, <strong className="text-white/60">@ac.bd</strong>, <strong className="text-white/60">@gov.bd</strong>, <strong className="text-white/60">@du.ac.bd</strong>, <strong className="text-white/60">@buet.ac.bd</strong> and all UGC-approved university domains.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Account Rules &amp; Limits</h4>
                </div>
                <p className="text-white/40 text-[11px] leading-relaxed">One account per institutional email. Personal Gmail, Yahoo, or Outlook accounts must be linked to a verified institutional email via our OTP system before gaining full access to listing and purchasing features.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Violations &amp; Suspension</h4>
                </div>
                <p className="text-white/40 text-[11px] leading-relaxed">Attempting to register with a fake institutional email, sharing account credentials, or misrepresenting book conditions will result in immediate account suspension and a permanent listing ban with no appeals.</p>
              </div>
            </div>
          </div>

        </div>{/* end bento grid */}
      </section>

      {/* Bottom CTA */}
      <section className="py-10 px-6 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">Have questions about your privacy? <a href="/contact-us" className="text-indigo-400 hover:underline font-semibold">Contact our team →</a></p>
      </section>
    </main>
  );
}
