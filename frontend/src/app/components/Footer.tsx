"use client";
import {
  ArrowUpRight,
} from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { SiGumroad } from "react-icons/si";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const socialLinks = [
    { icon: <FaFacebook />, name: "Facebook", color: "from-blue-600 to-indigo-600", href: "#" },
    { icon: <RiInstagramFill />, name: "Instagram", color: "from-purple-600 to-red-600", href: "#" },
    { icon: <FaXTwitter />, name: "Twitter", color: "from-gray-800 to-black", href: "#" },
    { icon: <FaWhatsapp />, name: "Whatsapp", color: "from-green-400 to-emerald-600", href: "#" },
    { icon: <SiGumroad />, name: "Gumroad", color: "from-pink-400 to-violet-500", href: "#" },
  ];

  const features = [
    {
      imageSrc: "/icons/secure.gif",
      title: "Secure Payment",
      description: "100% Encrypted Transactions",
      color: "bg-white",
    },
    {
      imageSrc: "/icons/delivery-truck.gif",
      title: "Fast Delivery",
      description: "Reliable Nationwide Shipping",
      color: "bg-white",
    },
    {
      imageSrc: "/icons/high-quality.gif",
      title: "Quality Books",
      description: "Handpicked Collection",
      color: "bg-white",
    },
    {
      imageSrc: "/icons/customer-service.gif",
      title: "24/7 Support",
      description: "Dedicated Expert Help",
      color: "bg-white",
    },
  ];

  return (
    <footer className="relative bg-gray-950 text-gray-400 border-t border-white/5 overflow-hidden">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-10 left-2/4 w-[700px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-15 right-2/4 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[78%] mx-auto px-0 relative z-10 pt-20 pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-0 mb-20"
        >
          {/* Brand Info */}
          <motion.div variants={itemVariants} className="w-full lg:w-[40%] space-y-6">
            <div className="mb-6">
              <Image src="/images/oxpecker-bookhub.png" alt="Logo" width={120} height={120} />
            </div>
            <p className="text-sm leading-relaxed max-w-[23rem] mb-4 font-medium">
              Your ultimate destination for curated books. We bridge the gap between quality knowledge and affordability through our premium marketplace.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <div key={social.name} className="group relative">
                  <Link
                    href={social.href}
                    className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tl ${social.color} brightness-95 hover:brightness-100 transition-all duration-300 shadow-xl transform group-hover:-translate-y-1`}
                  >
                    <span className="text-white text-lg group-hover:scale-110 transition-transform">{social.icon}</span>
                  </Link>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest">
                    {social.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Useful Links */}
          <motion.div variants={itemVariants} className="w-full lg:w-[15%] space-y-6">
            <h3 className="text-lg font-black text-indigo-400 uppercase tracking-[0.3em]">About</h3>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "/about-us" },
                { label: "Blogs", href: "/blogs" },
                { label: "How it works", href: "/how-it-works" },
                { label: "Contact Us", href: "/contact-us" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-semibold hover:text-white flex items-center group transition-colors">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal / Policy */}
          <motion.div variants={itemVariants} className="w-full lg:w-[15%] space-y-6">
            <h3 className="text-lg font-black text-indigo-400 uppercase tracking-[0.3em]">Policies</h3>
            <ul className="space-y-4">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Use", href: "/terms-of-use" },
                { label: "Return Policy", href: "/return-policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-semibold hover:text-white flex items-center group transition-colors">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Contact */}
          <motion.div variants={itemVariants} className="w-full lg:w-[30%] space-y-6">
            <h3 className="text-lg font-black text-indigo-400 uppercase tracking-[0.3rem]">Support</h3>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 py-10 space-y-4">
              <p className="text-xs font-bold text-gray-300 leading-relaxed tracking-wider">
                Subscribe to our newsletter for exclusive updates & offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-gray-700 border-0 rounded-xl px-4 py-2 text-xs text-white w-full focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature section - PRO UI Card Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 justify-between"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 backdrop-blur-md border-0 rounded-xl px-4 py-6 overflow-hidden hover:bg-gray-700/50 transition-all duration-500"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`mb-6 p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-105 transition-transform duration-500`}>
                  <div className="text-white">
                    <Image
                      src={feature.imageSrc}
                      alt={feature.title}
                      width={72}
                      height={72}
                      className="w-14 h-14 object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <h3 className="text-white font-black uppercase text-base tracking-wide mb-2">{feature.title}</h3>
                <p className="text-sm font-semibold text-gray-400 tracking-wide">{feature.description}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </motion.div>

        <div className="bg-gray-500/50 h-[.7px] w-[70%] mt-10 mx-auto" />

        {/* Payment Partners & Copyright */}
        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center justify-center lg:items-start space-y-2">
            <p className="flex flex-col md:flex-col items-start justify-center gap-2 text-[10px] font-black tracking-widest text-gray-500">
              <span className="flex items-center gap-1 tracking-wide text-gray-400/70 text-xs font-semibold uppercase">
                <Image src="/images/fav-ico.png" alt="Copyright" height={30} width={25} className="brightness-90 opacity-90 hover:brightness-100 hover:opacity-100 hover:scale-105 transition-all cursor-pointer" /> &copy;{currentYear} -
                All Copyright Reserved - Oxpecker Book-Hub. One's book can be Someone's treasure.</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 px-10 h-10 py-0 bg-transparent backdrop-blur-xl border-0">
            {/* <Image src="/icons/maaster.svg" alt="Mastercard" height={30} width={45} className="brightness-90 opacity-50 hover:brightness-100 hover:opacity-100 hover:scale-105 transition-all cursor-pointer" /> */}
            {/* <Image src="/icons/nagad.svg" alt="Nagad" height={50} width={65} className="grayscale-75 opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" /> */}
            <Image src="/icons/bkash-icon.png" alt="Bikash" height={30} width={30} className="brightness-90 opacity-75 hover:brightness-100 hover:opacity-100 hover:scale-105 transition-all cursor-pointer" />
            <Image src="/icons/ssl-commerz.png" alt="SSLCommerz" height={30} width={100} className="brightness-90 opacity-75 hover:brightness-100 hover:opacity-100 hover:scale-105 transition-all cursor-pointer" />
            <Image src="/icons/google-pay.svg" alt="Google Pay" height={30} width={45} className="brightness-90 opacity-75 hover:brightness-100 hover:opacity-100 hover:scale-105 transition-all cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
