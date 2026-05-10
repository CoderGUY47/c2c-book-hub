import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const UnauthorizedEmailPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0b] text-white p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Illustration Container */}
        <div className="relative w-full aspect-square max-w-[500px] mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full animate-pulse"></div>
          <Image 
            src="/unauth.png" 
            alt="Access Denied" 
            width={500}
            height={500}
            priority
            className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Please log in with your <br/> official account.
          </h1>
          <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-[400px] mx-auto">
            Use your <span className="text-purple-400 font-bold">academic</span> (.edu, .ac.bd) or <span className="text-blue-400 font-bold">professional</span> (.gov.bd) email to access the platform.
          </p>
          <p className="text-sm text-gray-500 italic">
            Personal Gmail/Outlook accounts are not accepted for verification.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-10">
          <Link 
            href="/"
            className="inline-block w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-[0_10px_40px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_50px_rgba(124,58,237,0.6)] active:scale-95 uppercase tracking-wider"
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedEmailPage;
