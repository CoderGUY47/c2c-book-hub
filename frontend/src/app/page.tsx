import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroBanner = dynamic(() => import("./components/HeroBanner"), { ssr: true });
const BrowseGenresSection = dynamic(() => import("./components/BrowseGenresSectionV2"), { ssr: true });
const TrendingBooksSection = dynamic(() => import("./components/TrendingBooksSection"), { ssr: true });
const NewBooks = dynamic(() => import("./components/NewBooks"), { ssr: true });
const MockBooksSection = dynamic(() => import("./components/MockBooksSection"), { ssr: true });
const FreeEbooksSection = dynamic(() => import("./components/FreeEbooksSection"), { ssr: true });
const CustomerReviews = dynamic(() => import("./components/CustomerReviews"), { ssr: true });

export const metadata: Metadata = {
  title: "Book-Hub | Online Buying & Selling Book Shop in Bangladesh",
  description: "Buy and sell used books online in Bangladesh. The best marketplace for students and readers to find huge collections, trending books, and free ebooks.",
  keywords: "books, buy books, sell books, used books, bangladesh, Book-Hub, library",
};

import LottieAnimation from "./components/LottieAnimation";

const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad",
    description: "List your books and add details easily.",
    lottieUrl: "https://raw.githubusercontent.com/Karthik-S-K/Lottie-Animations/master/Animations/ecommerce.json",
  },
  {
    step: "Step 2",
    title: "Set your price",
    description: "Choose a fair price for your books.",
    lottieUrl: "https://raw.githubusercontent.com/Karthik-S-K/Lottie-Animations/master/Animations/payment.json",
  },
  {
    step: "Step 3",
    title: "Get paid",
    description: "Receive payments directly to your account.",
    lottieUrl: "https://raw.githubusercontent.com/Karthik-S-K/Lottie-Animations/master/Animations/success.json",
  },
];

const buySteps = [
  {
    step: "Step 1",
    title: "Browse books",
    description: "Browse thousands of available books.",
    lottieUrl: "https://raw.githubusercontent.com/Karthik-S-K/Lottie-Animations/master/Animations/search.json",
  },
  {
    step: "Step 2",
    title: "Place order",
    description: "Place your order with a single click.",
    lottieUrl: "https://raw.githubusercontent.com/Karthik-S-K/Lottie-Animations/master/Animations/empty_cart.json",
  },
  {
    step: "Step 3",
    title: "Fast delivery",
    description: "Fast delivery right to your doorstep.",
    lottieUrl: "https://raw.githubusercontent.com/Karthik-S-K/Lottie-Animations/master/Animations/delivery.json",
  },
];

export default function Homepage() {
  return (
    <main className="min-h-screen overflow-x-hidden relative bg-gray-950">
      {/* Hero Banner Section (Client Component) */}
      <HeroBanner />

      {/* Browse Genres Section */}
      <BrowseGenresSection />

      {/* Trending Books Section (Server Fetched) */}
      <TrendingBooksSection />

      {/* New Arrivals Section (Server Fetched) */}
      <NewBooks />

      {/* Recommended for You (Mock Books) */}
      <MockBooksSection />

      {/* Free Ebooks Section */}
      <FreeEbooksSection />

      {/* Light Theme Step Sections Wrapper */}
      <section className="py-32 bg-[#fcfcfa] border-y border-gray-100 relative overflow-hidden">
        {/* Subtle Grid Background Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Selling System Section */}
        <div className="w-[85%] max-w-7xl mx-auto px-4 relative z-10 mb-32">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl md:text-6xl font-bold font-langar text-zinc-900 tracking-tight leading-[1.1] mb-4">
              How to <span className="text-violet-600">Sell</span> Your <br />
              Used Books in Book-Hub?
            </h2>
            <p className="text-black/40 max-w-2xl mx-auto text-base font-semibold tracking-tight">
              Turn your bookshelf into a goldmine with our refined 3-step selling process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {sellSteps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Large Architectural Numbering */}
                <div className="absolute -top-12 -left-4 text-[120px] font-bold text-zinc-100/50 select-none pointer-events-none transition-all duration-700 group-hover:text-indigo-50 group-hover:-translate-y-4">
                  0{index + 1}
                </div>

                <div className="relative z-10 bg-black/70 border border-gray-100 rounded-none p-4 flex flex-col items-center text-center shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 h-full group-hover:-translate-y-0.5">
                  <div className="w-full h-48 mb-6 p-4 flex items-center justify-center overflow-hidden">
                    <LottieAnimation 
                      animationUrl={step.lottieUrl} 
                      className="w-40 h-40 transform transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight mb-2 uppercase">
                    {step.title}
                  </h3>
                  <div className="w-10 h-[2px] bg-indigo-500 mb-4 transition-all duration-500 group-hover:w-20" />
                  <p className="text-white/60 font-medium leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buying System Section */}
        <div className="w-[85%] max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold font-langar text-zinc-900 tracking-tight leading-[1.1] mb-6">
              How to <span className="text-purple-600">Buy</span> Your <br />
              Next Story in Book-Hub?
            </h2>
            <p className="text-black/40 max-w-2xl mx-auto text-base font-semibold tracking-tight">
              Best rates for your collection with our streamlined buying interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-6">
            {buySteps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Large Architectural Numbering */}
                <div className="absolute -top-12 -left-4 text-[120px] font-bold text-zinc-100/50 select-none pointer-events-none transition-all duration-700 group-hover:text-purple-50 group-hover:-translate-y-4">
                  0{index + 1}
                </div>

                <div className="relative z-10 bg-black/70 border border-gray-100 rounded-none p-4 flex flex-col items-center text-center shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 h-full group-hover:-translate-y-0.5">
                  <div className="w-full h-48 mb-6 p-4 flex items-center justify-center overflow-hidden">
                    <LottieAnimation 
                      animationUrl={step.lottieUrl} 
                      className="w-40 h-40 transform transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight mb-2 uppercase">
                    {step.title}
                  </h3>
                  <div className="w-10 h-[2px] bg-purple-500 mb-4 transition-all duration-500 group-hover:w-20" />
                  <p className="text-white/60 font-medium leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviews />
    </main>
  );
}
