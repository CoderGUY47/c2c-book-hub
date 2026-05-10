import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const UnauthorizedEmailPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0b] text-white p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Illustration Container */}
        <div className="relative w-full aspect-square max-w-[350px] mx-auto mb-8">
          <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full"></div>
          <img 
            src="/unauthorized-illustration.png" 
            alt="Access Denied" 
            className="relative z-10 w-full h-full object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Please log in with your <br/> educational account.
          </h1>
          <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-[320px] mx-auto">
            Sign in with your educational gmail account which is <span className="text-purple-400 font-bold">@diu.edu.bd</span>
          </p>
          <p className="text-sm text-gray-500 italic">
            Personal Google accounts are not accepted at this time.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-10">
          <Link 
            href="/"
            className="inline-block w-full py-5 px-10 rounded-[30px] bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-[0_10px_40px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_50px_rgba(124,58,237,0.6)] active:scale-95 uppercase tracking-wider"
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedEmailPage;
