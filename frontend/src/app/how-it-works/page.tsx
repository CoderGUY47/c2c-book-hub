"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  PostAdIcon,
  SetPriceIcon,
  GetPaidIcon,
  BrowseBooksIcon,
  PlaceOrderIcon,
  DeliveryIcon,
} from "../components/BuySellIcons";

const sellSteps = [
  { step: "01", title: "Post Your Book", desc: "List your used book with title, condition, photos & a price. Takes under 2 minutes.", Icon: PostAdIcon },
  { step: "02", title: "Set Your Price", desc: "You're in control. Set a fair price and attract the right buyers instantly.", Icon: SetPriceIcon },
  { step: "03", title: "Get Paid", desc: "Once sold, receive payment directly to your bKash or bank account.", Icon: GetPaidIcon },
];

const buySteps = [
  { step: "01", title: "Browse & Discover", desc: "Search thousands of books by genre, condition, price or subject area.", Icon: BrowseBooksIcon },
  { step: "02", title: "Place Your Order", desc: "Found your book? Place an order with one click — no complicated checkout.", Icon: PlaceOrderIcon },
  { step: "03", title: "Fast Delivery", desc: "We deliver to your doorstep quickly and safely across Bangladesh.", Icon: DeliveryIcon },
];

const faqs = [
  { q: "Is Book-Hub free to use?", a: "Yes! Creating an account, browsing, and listing books is completely free." },
  { q: "How do I get paid after selling?", a: "Payments are released to your registered bKash or bank account within 2 business days of delivery confirmation." },
  { q: "Are the books verified?", a: "All sellers are verified DIU students/alumni. Book condition is described by the seller and supported by photos." },
  { q: "Can I return a book?", a: "Yes. We have a 3-day return window if the book condition significantly differs from the description." },
  { q: "What payment methods are accepted?", a: "We accept bKash, SSLCommerz, and Google Pay for a seamless checkout experience." },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-indigo-400 mb-6">The Platform</span>
          <h1 className="text-5xl md:text-7xl font-bold font-langar leading-tight mb-6">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Book-Hub</span> Works
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Book-Hub is Bangladesh's first C2C (customer-to-customer) book marketplace — designed for students to buy and sell used books with zero friction.
          </p>
        </div>
      </section>

      {/* Sell Steps */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-violet-400">For Sellers</span>
            <h2 className="text-4xl md:text-5xl font-bold font-langar mt-3">Sell in 3 Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sellSteps.map((s, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-violet-500/40 hover:bg-white/[0.05] transition-all duration-500">
                <div className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none group-hover:text-violet-500/10 transition-colors">{s.step}</div>
                <div className="w-28 h-28 mb-6">
                  <s.Icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy Steps */}
      <section className="py-24 px-6 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-purple-400">For Buyers</span>
            <h2 className="text-4xl md:text-5xl font-bold font-langar mt-3">Buy in 3 Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buySteps.map((s, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-purple-500/40 hover:bg-white/[0.05] transition-all duration-500">
                <div className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none group-hover:text-purple-500/10 transition-colors">{s.step}</div>
                <div className="w-28 h-28 mb-6">
                  <s.Icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Book-Hub */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-indigo-400">Why Us</span>
            <h2 className="text-4xl md:text-5xl font-bold font-langar mt-3">Why Choose Book-Hub?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              "Trusted by 5,000+ DIU students across Bangladesh",
              "Secure payments via bKash & SSLCommerz",
              "Verified sellers — buy with confidence",
              "Doorstep delivery nationwide",
              "Sell your old books in under 2 minutes",
              "Free to list — no hidden charges ever",
              "3-day hassle-free return policy",
              "24/7 customer support team",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white/[0.015] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-violet-400">FAQ</span>
            <h2 className="text-4xl font-bold font-langar mt-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold font-langar mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-10 font-medium">Join thousands of book lovers already using Book-Hub.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/books" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Browse Books <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/book-sell" className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Sell a Book <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
