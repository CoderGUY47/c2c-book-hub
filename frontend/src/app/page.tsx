import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  PostAdIcon,
  SetPriceIcon,
  GetPaidIcon,
  BrowseBooksIcon,
  PlaceOrderIcon,
  DeliveryIcon,
} from "./components/BuySellIcons";

// Premium layout-preserving skeleton loader to prevent layout shifts (CLS)
function SectionSkeleton({ height = "300px" }: { height?: string }) {
  return (
    <div 
      className="w-[85%] max-w-7xl mx-auto flex flex-col items-center justify-center animate-pulse bg-gray-900/40 rounded-3xl border border-gray-800/50 my-10 p-8"
      style={{ height }}
    >
      <div className="w-1/3 h-8 bg-gray-800 rounded-full mb-6"></div>
      <div className="w-1/2 h-4 bg-gray-800/80 rounded-full mb-8"></div>
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-800/30 rounded-2xl h-full flex flex-col p-4 border border-gray-800/20">
            <div className="w-full aspect-[3/4] bg-gray-800/70 rounded-xl mb-4"></div>
            <div className="w-3/4 h-4 bg-gray-800/80 rounded-full mb-2"></div>
            <div className="w-1/2 h-3 bg-gray-800/50 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const HeroBanner = dynamic(() => import("./components/HeroBanner"), { 
  ssr: true,
  loading: () => (
    <div className="w-full min-h-[70vh] bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 to-transparent pointer-events-none" />
      <div className="animate-pulse flex flex-col items-center text-center max-w-3xl px-4 w-full">
        <div className="w-48 h-6 bg-gray-800 rounded-full mb-6" />
        <div className="w-96 max-w-full h-12 bg-gray-800 rounded-full mb-4" />
        <div className="w-80 max-w-full h-12 bg-gray-800 rounded-full mb-8" />
        <div className="w-64 max-w-full h-4 bg-gray-800/60 rounded-full mb-10" />
        <div className="flex gap-4">
          <div className="w-36 h-12 bg-gray-800 rounded-xl" />
          <div className="w-36 h-12 bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  )
});

const BrowseGenresSection = dynamic(() => import("./components/BrowseGenresSectionV2"), { 
  ssr: true,
  loading: () => <SectionSkeleton height="260px" />
});

const TrendingBooksSection = dynamic(() => import("./components/TrendingBooksSection"), { 
  ssr: true,
  loading: () => <SectionSkeleton height="460px" />
});

const NewBooks = dynamic(() => import("./components/NewBooks"), { 
  ssr: true,
  loading: () => <SectionSkeleton height="460px" />
});

const MockBooksSection = dynamic(() => import("./components/MockBooksSection"), { 
  ssr: true,
  loading: () => <SectionSkeleton height="460px" />
});

const FreeEbooksSection = dynamic(() => import("./components/FreeEbooksSection"), { 
  ssr: true,
  loading: () => <SectionSkeleton height="460px" />
});

const CustomerReviews = dynamic(() => import("./components/CustomerReviews"), { 
  ssr: true,
  loading: () => (
    <div className="w-[85%] max-w-7xl mx-auto min-h-[300px] flex flex-col items-center justify-center animate-pulse bg-gray-900/20 border border-gray-800/30 rounded-3xl p-8 my-10">
      <div className="w-48 h-8 bg-gray-800 rounded-full mb-6" />
      <div className="w-96 max-w-full h-4 bg-gray-800/80 rounded-full mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800/40 rounded-2xl p-6 border border-gray-800/20 h-40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full" />
              <div>
                <div className="w-24 h-3 bg-gray-800 rounded-full mb-1" />
                <div className="w-16 h-2.5 bg-gray-800/60 rounded-full" />
              </div>
            </div>
            <div className="w-full h-3 bg-gray-800/60 rounded-full mb-2" />
            <div className="w-3/4 h-3 bg-gray-800/40 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: "Book-Hub | Online Buying & Selling Book Shop in Bangladesh",
  description: "Buy and sell used books online in Bangladesh. The best marketplace for students and readers to find huge collections, trending books, and free ebooks.",
  keywords: "books, buy books, sell books, used books, bangladesh, Book-Hub, library",
};

const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad",
    description: "List your books and add details easily.",
    Icon: PostAdIcon,
  },
  {
    step: "Step 2",
    title: "Set your price",
    description: "Choose a fair price for your books.",
    Icon: SetPriceIcon,
  },
  {
    step: "Step 3",
    title: "Get paid",
    description: "Receive payments directly to your account.",
    Icon: GetPaidIcon,
  },
];

const buySteps = [
  {
    step: "Step 1",
    title: "Browse books",
    description: "Browse thousands of available books.",
    Icon: BrowseBooksIcon,
  },
  {
    step: "Step 2",
    title: "Place order",
    description: "Place your order with a single click.",
    Icon: PlaceOrderIcon,
  },
  {
    step: "Step 3",
    title: "Fast delivery",
    description: "Fast delivery right to your doorstep.",
    Icon: DeliveryIcon,
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
        <div className="w-[85%] max-w-7xl mx-auto px-4 relative z-10 mb-26">
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl md:text-5xl font-bold font-langar text-zinc-900 tracking-tight leading-[1.1] mb-4">
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

                <div className="relative z-10 bg-black/70 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 h-full group-hover:-translate-y-0.5">
                  <div className="w-full h-48 mb-6 p-4 flex items-center justify-center overflow-hidden">
                    <step.Icon className="w-40 h-40 transform transition-transform duration-500 group-hover:scale-110" />
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
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold font-langar text-zinc-900 tracking-tight leading-[1.1] mb-6">
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

                <div className="relative z-10 bg-black/70 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 h-full group-hover:-translate-y-0.5">
                  <div className="w-full h-48 mb-6 p-4 flex items-center justify-center overflow-hidden">
                    <step.Icon className="w-40 h-40 transform transition-transform duration-500 group-hover:scale-110" />
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
