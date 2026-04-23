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

export const metadata: Metadata = {
  title: "Book-Shop | Online Buying & Selling Book Shop in Bangladesh",
  description: "Buy and sell used books online in Bangladesh. The best marketplace for students and readers to find huge collections, trending books, and free ebooks.",
  keywords: "books, buy books, sell books, used books, bangladesh, book-shop, library",
};

const blogPosts = [
  {
    imageSrc: "/images/reading.png",
    title: "Readers are always learners",
    description: "Reading is a journey of discovery, and every book opens a new door to knowledge and understanding.",
  },
  {
    imageSrc: "/images/bookshelf.png",
    title: "Also available in any institutional Library",
    description: "You can find our books in any institutional library.",
  },
  {
    imageSrc: "/images/feedback.png",
    title: "What is Book-Shop?",
    description: "Book-Shop is a platform that helps you to buy and sell used books online easily.",
  },
];

const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad for selling used books",
    description: "Post an ad & describe your book details to sell your old books online.",
    imageSrc: "/icons/post-online.png",
  },
  {
    step: "Step 2",
    title: "Set the selling price for your books",
    description: "Set the price for your books at which you want to sell them.",
    imageSrc: "/icons/price.png",
  },
  {
    step: "Step 3",
    title: "Get paid into your Online Banking account",
    description: "You will get money into your account once you receive an order for your book.",
    imageSrc: "/icons/payment.png",
  },
];

const buySteps = [
  {
    step: "Step 1",
    title: "Select the used books you want",
    description: "Search from over thousands of used books listed on Book-Shop.",
    imageSrc: "/icons/searching.svg",
  },
  {
    step: "Step 2",
    title: "Place the order by making payment",
    description: "Then simply place the order by clicking on the 'Buy Now' button.",
    imageSrc: "/icons/payment.svg",
  },
  {
    step: "Step 3",
    title: "Get the books delivered at your doorstep",
    description: "The books will be delivered to you at your doorstep!",
    imageSrc: "/icons/delivery.svg",
  },
];

export default function Homepage() {
  return (
    <main className="min-h-screen overflow-x-hidden relative bg-gray-950">
      {/* Hero Banner Section (Client Component) */}
      <HeroBanner />

      {/* Browse Genres Section */}
      <BrowseGenresSection/>

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
                Used Books in Book-Shop?
              </h2>
              <p className="text-black/40 max-w-2xl mx-auto text-base font-semibold tracking-tight">
                Turn your bookshelf into a goldmine with our refined 3-step selling process designed for authors and collectors.
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
                    <div className="w-70 h-50 mb-10 p-6 rounded-none flex items-center justify-center">
                      {step.imageSrc && (
                        <Image
                          src={step.imageSrc}
                          alt={step.title}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover grayscale opacity-100 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                      )}
                    </div>
                    
                    <h3 className="text-base font-semibold text-white tracking-tight leading-tight mb-2">
                      {step.title}
                    </h3>
                    <div className="w-10 h-[1px] bg-indigo-500 mb-2 transition-all duration-500 group-hover:w-full" />
                    <p className="text-white/60 font-normal leading-relaxed text-xs">
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
                Next Story in Book-Shop?
              </h2>
              <p className="text-black/40 max-w-2xl mx-auto text-base font-semibold tracking-tight">
                Get limited discounts and the best rates for your collection with our streamlined buying interface.
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
                    <div className="w-70 h-50 mb-10 p-6 rounded-none flex items-center justify-center">
                      {step.imageSrc && (
                        <Image
                          src={step.imageSrc}
                          alt={step.title}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover grayscale opacity-100 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                      )}
                    </div>
                    
                    <h3 className="text-base font-semibold text-white tracking-tight leading-tight mb-2">
                      {step.title}
                    </h3>
                    <div className="w-10 h-[1px] bg-purple-500 mb-2 transition-all duration-500 group-hover:w-full" />
                    <p className="text-white/60 font-normal leading-relaxed text-xs">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get to Know — Editorial Author/Blog Section */}
        <section className="bg-[#0a0a0a] py-20 relative overflow-hidden">
          {/* Subtle top border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="w-[90%] max-w-7xl mx-auto px-4 relative z-10">

            {/* Section header row */}
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-violet-400 uppercase mb-3">Articles &amp; Insights</p>
                <h2 className="text-4xl md:text-5xl font-bold font-langar text-white tracking-tight leading-[1.1]">
                  Get to know
                </h2>
              </div>
              <Link
                href="/blog"
                className="group flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                See all
                <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Three-column author/blog cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className="group relative bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.08)]"
                >
                  <div className="p-7 flex flex-col justify-between min-h-[230px] relative">
                    {/* Small cover image — top-right corner */}
                    {post.imageSrc && (
                      <div className="absolute top-5 right-5 w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                        <Image
                          src={post.imageSrc}
                          alt={post.title}
                          fill
                          className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500"
                          sizes="56px"
                        />
                      </div>
                    )}

                    {/* Text content */}
                    <div className="pr-16">
                      <p className="text-[9px] font-bold tracking-[0.25em] text-white/25 uppercase mb-1">Name:</p>
                      <h3 className="text-base font-bold text-white mb-5 leading-tight group-hover:text-violet-300 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <p className="text-[9px] font-bold tracking-[0.25em] text-white/25 uppercase mb-2">About the author:</p>
                      <p className="text-white/45 text-sm leading-relaxed line-clamp-4">
                        {post.description}
                      </p>
                    </div>

                    {/* Accent line */}
                    <div className="mt-6 w-8 h-[2px] bg-violet-500/60 group-hover:w-14 transition-all duration-300 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    </main>
  );
}
