"use client";
import React from "react";
import { BookOpen, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden py-24">
      {/* Background decorative elements - Dark theme */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10 w-[80%] mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black font-poppins mb-6 text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 to-purple-500">Us</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome to <span className="text-white font-bold">Book-Hub</span>, your ultimate destination for buying and selling
            used books online. We believe every book has a second story to tell.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <BookOpen className="w-12 h-12 text-indigo-400" />,
              title: "Our Mission",
              desc: "At Book-Hub, we aim to make reading accessible to everyone by providing a platform where people can buy and sell their old books easily."
            },
            {
              icon: <Users className="w-12 h-12 text-purple-400" />,
              title: "Our Community",
              desc: "We believe in building a community of book lovers who can share their passion for reading while promoting eco-friendly practices."
            },
            {
              icon: <ShieldCheck className="w-12 h-12 text-blue-400" />,
              title: "Our Commitment",
              desc: "We are committed to providing a secure platform for transactions and ensuring customer satisfaction at every step."
            }
          ].map((item, idx) => (
            <div key={idx} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] transition-all duration-500 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_50px_rgba(79,70,229,0.2)]">
              <div className="flex items-center justify-center mb-8 transform transition-transform duration-500 group-hover:scale-110">
                <div className="p-4 rounded-2xl bg-gray-900/50 shadow-inner">
                  {item.icon}
                </div>
              </div>
              <h2 className="text-2xl font-black font-poppins text-center mb-4 text-white uppercase tracking-wide">
                {item.title}
              </h2>
              <p className="text-gray-400 text-center font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <section className="py-20 relative px-0 bg-transparent">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-poppins tracking-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-orange-400">Book-Hub?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { emoji: "📚", title: "Wide Selection", desc: "Thousands of used books available at your fingertips." },
              { emoji: "📝", title: "Easy Listing", desc: "Sell your old books in just a few clicks." },
              { emoji: "🔒", title: "Secure Transactions", desc: "Safe payment methods ensure your peace of mind." },
              { emoji: "🤝", title: "Community Driven", desc: "Join a community of readers and sellers who share your passion." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:bg-gray-800/40 transition-all duration-500 group hover:-translate-y-2">
                <div className="flex items-center justify-center mb-6 text-4xl transform transition-transform group-hover:scale-125 duration-500">
                  {feature.emoji}
                </div>
                <h3 className="font-black font-poppins text-md text-center mb-3 text-white uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center text-sm font-semibold leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Images Section - Explicit Bento Grid for Manual Updates */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 md:grid-rows-4 gap-4 mb-20 h-auto md:h-[500px]">
          {/* Image 1 */}
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-xl md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-1">
            <img
              src="/images/book-1.webp"
              alt="Premium Books"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
          </div>

          {/* Image 2 */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-1">
            <img
              src="/images/book-2.webp"
              alt="Reading Culture"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-50" />
          </div>

          {/* Image 3 */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg md:col-start-1 md:col-span-2 md:row-start-2 md:row-span-2">
            <img
              src="/images/book-3.webp"
              alt="Book Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-50" />
          </div>

          {/* Image 4 */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-2">
            <img
              src="/images/book-4.webp"
              alt="Quality Knowledge"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-50" />
          </div>

          {/* Image 5 */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg md:col-start-1 md:col-span-3 md:row-start-4 md:row-span-4">
            <img
              src="/images/book-5.webp"
              alt="Eco Friendly"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-50" />
          </div>
        </div>

        <div className="text-center py-10 bg-gradient-to-tr from-slate-900/80 via-gray-600/30 to-slate-900/80 rounded-[4rem] border-0 backdrop-blur-xl">
          <h2 className="text-2xl md:text-3xl font-black font-poppins text-white mb-4 uppercase tracking-wider">
            Join Us Today!
          </h2>
          <p className="text-gray-300 text-md md:text-lg font-medium mb-4 max-w-[600px] mx-auto">
            Sign up now to start buying and selling your favorite books on
            <span className="text-white font-bold"> Book-Hub</span>!
          </p>

          <div className="flex justify-center">
            <Link
              href="/"
              className="group relative px-10 py-4 bg-indigo-600 text-white font-black rounded-full transition-all duration-300 hover:bg-indigo-700 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started <BookOpen className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
