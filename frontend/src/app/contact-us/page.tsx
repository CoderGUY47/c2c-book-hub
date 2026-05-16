"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const contactInfo = [
  { icon: Mail, label: "Email Support", value: "support@oxpecker.pro.bd", sub: "We reply within 24 hours", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { icon: Phone, label: "Phone / WhatsApp", value: "+880 1XXXXXXXXX", sub: "Sun – Thu, 9 AM – 6 PM", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { icon: MapPin, label: "Location", value: "DIU Campus, Dhaka", sub: "Daffodil International University", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  { icon: Clock, label: "Support Hours", value: "9 AM – 9 PM", sub: "Every day including weekends", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
];

const socials = [
  { icon: FaFacebook, label: "Facebook", href: "#", color: "from-blue-600 to-indigo-600" },
  { icon: RiInstagramFill, label: "Instagram", href: "#", color: "from-purple-600 to-red-500" },
  { icon: FaWhatsapp, label: "WhatsApp", href: "#", color: "from-green-500 to-emerald-600" },
];

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-indigo-400 mb-6">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl font-bold font-langar leading-tight mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Us</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or need help with your order? Our support team is here for you.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-violet-400">Details</span>
              <h2 className="text-3xl font-bold font-langar mt-2 mb-6">We'd love to hear from you</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, i) => (
                <div key={i} className={`border rounded-xl p-5 ${info.bg} transition-all hover:-translate-y-0.5 duration-300`}>
                  <info.icon className={`w-6 h-6 ${info.color} mb-3`} />
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="font-bold text-white text-sm">{info.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{info.sub}</p>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-gray-500 mb-4">Follow Us</p>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <a key={i} href={s.href} className={`flex items-center gap-2 bg-gradient-to-r ${s.color} text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity`}>
                    <s.icon className="w-4 h-4" />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Live Chat Prompt */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Live Chat Available</p>
                <p className="text-gray-400 text-xs mt-1">Chat with us on WhatsApp for instant support during business hours.</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-langar mb-8">Send a Message</h2>
            {sent && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-300 text-sm font-medium">Message sent! We'll get back to you within 24 hours.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                  <input
                    required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Rahim Uddin"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                  <input
                    required type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                <input
                  required value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Order issue, feedback, general question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                <textarea
                  required rows={5} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
