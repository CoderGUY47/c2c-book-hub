"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ArrowRightCircle,
  BookOpen,
  Camera,
  CreditCard,
  Library,
  LucideCircleArrowOutUpRight,
  ScanQrCode,
  Search,
  ShoppingBag,
  ShoppingBasket,
  Store,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewBooks from "./components/NewBooks";
import MockBooksSection from "./components/MockBooksSection";
import BlogDeck from "./components/BlogDeck";
import { Card, CardContent } from "@/components/ui/card";
import { BiCollection } from "react-icons/bi";
import BrowseGenresSection from "./components/BrowseGenresSectionV2"; // Using V2 for images layout
import FreeEbooksSection from "./components/FreeEbooksSection";
import TrendingBooksSection from "./components/TrendingBooksSection";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const bannerImages = [
  "/images/book1.webp",
  "/images/book2.webp",
  "/images/book3.webp",
  "/images/book4.webp",
  "/images/book5.webp",
  "/images/book6.webp",
  "/images/book7.webp",

];

const blogPosts = [
  {
    imageSrc: "/images/reading.png",
    title: "Readers are always learners",
    description:
      "Reading is a journey of discovery, and every book opens a new door to knowledge and understanding.",
    // icon: <BookOpen className="w-6 h-6 text-gray-700" />,
  },
  {
    imageSrc:
      "/images/bookshelf.png",
    title: "Also available in any institutional Library",
    description:
      "You can find our books in any institutional library.",
    // icon: <Library className="w-6 h-6 text-gray-700" />,
  },
  {
    imageSrc:
      "/images/feedback.png",
    title: "What is Book-Hub?",
    description:
      "Book-Hub is a platform that helps you to buy and sell used books online easily.",
    // icon: <Store className="w-6 h-6 text-gray-700" />,
  },
];

const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad for selling used books",
    description:
      "Post an ad & describe your book details to sell your old books online.",
    imageSrc: "/icons/post-online.png"
  },
  {
    step: "Step 2",
    title: "Set the selling price for your books",
    description:
      "Set the price for your books at which you want to sell them.",
    imageSrc: "/icons/price.png"
  },
  {
    step: "Step 3",
    title: "Get paid into your Online Banking account",
    description:
      "You will get money into your account once you receive an order for your book.",
    // icon: <Wallet className="h-8 w-8 text-indigo-400" />,
    imageSrc: "/icons/payment.png"
  },
];

const buySteps = [
  {
    step: "Step 1",
    title: "Select the used books you want",
    description:
      "Search from over thousands of used books listed on Book-Hub.",
    imageSrc: "/icons/searching.svg",
  },
  {
    step: "Step 2",
    title: "Place the order by making payment",
    description:
      "Then simply place the order by clicking on the 'Buy Now' button.",
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
  const [currentImage, setCurrentImage] = useState(0);
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  // No automatic redirect for admins - allow them to browse the homepage
  useEffect(() => {
    // Admin check removed to prevent infinite loop/forced redirects
  }, [user, router]);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden relative bg-gray-950">
      <section className="relative h-[603px] overflow-hidden -mt-[1px] z-0">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={image}
              fill
              alt="banner"
              className="object-cover"
              priority={index === 0} // Load the first image immediately
            />
            <div className="absolute inset-0 bg-gray-950/60" />
          </div>
        ))}

        <div className="relative flex flex-col w-[80%] mx-auto px-0 h-full items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-6xl max-w-4xl mx-auto font-black font-poppins mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-tl from-amber-600 to-red-600">New</span> Online Buying &
            Selling Book Hub in Bangladesh
          </h1>
          <div className="flex flex-col sm:flex-row gap-5 py-8">
            <Button
              size="lg"
              className="group modern-glow bg-indigo-600/50 backdrop-blur-md text-white px-8 py-7 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-sm  group-hover:bg-white/30 transition-colors">
                  <ScanQrCode className="h-4 w-4" />
                </div>
                <Link href="/books">
                  <div className="text-left">
                    <div className="text-md font-poppins font-black opacity-90">
                      Start Shopping in our Book-Shop
                    </div>
                    <div className="font-semibold font-lg">
                      Available for buying used Books
                    </div>
                  </div>
                </Link>
                <div className="bg-white/30 p-2 rounded-full group-hover:bg-gray-800 transition-colors">
                  <LucideCircleArrowOutUpRight className="h-4 w-4 animate-bounce" />
                </div>
              </div>
            </Button>
            <Button
              size="lg"
              className="group modern-glow bg-purple-600/50 backdrop-blur-md text-white px-8 py-7 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-sm group-hover:bg-white/30 transition-colors">
                  <ShoppingBasket className="h-4 w-4" />
                </div>
                <Link href="/book-sell">
                  <div className="text-left">
                    <div className="text-md font-poppins font-black opacity-90">
                      Now You Can Sell Books Here
                    </div>
                    <div className="font-semibold font-lg">
                      Available for selling used Books
                    </div>
                  </div>
                </Link>
                <div className="bg-white/30 p-2 rounded-full group-hover:bg-gray-800 transition-colors">
                  <LucideCircleArrowOutUpRight className="h-4 w-4 animate-bounce" />
                </div>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Book-Hub Ecosystem & Intelligence Hub */}
      <div className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
        
        <div className="w-[85%] mx-auto space-y-24">
          
          {/* Discovery Row: Bento Layout for Dynamic Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-sm">
              <TrendingBooksSection />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-sm">
                <BrowseGenresSection />
              </div>
              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-sm">
                <FreeEbooksSection />
              </div>
            </div>
          </div>

          {/* Catalog & Recommendations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4 backdrop-blur-sm shadow-2xl overflow-hidden">
               <NewBooks />
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4 backdrop-blur-sm shadow-2xl overflow-hidden">
               <MockBooksSection />
            </div>
          </div>

          {/* THE MASTER HOW-IT-WORKS BENTO GRID */}
          <section className="relative z-10 pt-12">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-poppins font-black mb-8 text-white tracking-tighter leading-none">
                Mastering the <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 via-purple-500 to-indigo-400">Book-Hub</span> Lifecycle
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
                A seamless journey from clearing your bookshelf to uncovering your next literary treasure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[450px]">
              {/* Combine and sequence steps for a Bento look */}
              {[...sellSteps.map(s => ({ ...s, type: 'sell' })), ...buySteps.map(b => ({ ...b, type: 'buy' }))].map((step, index) => (
                <div 
                  key={`${step.type}-${index}`} 
                  className={cn(
                    "group relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-700 hover:shadow-[0_0_100px_rgba(79,70,229,0.2)]",
                    step.type === 'sell' ? "hover:border-indigo-500/50" : "hover:border-purple-500/50",
                    index === 0 ? "lg:col-span-2 lg:row-span-1" : "",
                    index === 5 ? "lg:col-span-2 lg:row-span-1" : ""
                  )}
                >
                  {/* Category Badge */}
                  <div className="absolute top-8 left-8 z-20">
                    <div className={cn(
                      "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md border border-white/10",
                      step.type === 'sell' ? "bg-indigo-600/20 text-indigo-400" : "bg-purple-600/20 text-purple-400"
                    )}>
                      {step.type === 'sell' ? "Seller Experience" : "Buyer Experience"} • {step.step}
                    </div>
                  </div>

                  {/* Visual Background */}
                  <div className="absolute inset-0 flex items-center justify-center p-16 transition-all duration-1000 group-hover:scale-125 group-hover:blur-2xl opacity-70 group-hover:opacity-10">
                    {step.imageSrc && (
                      <Image
                        src={step.imageSrc}
                        alt={step.title}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                      />
                    )}
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-12 text-center opacity-0 group-hover:opacity-100 backdrop-blur-2xl bg-gray-950/40 transition-all duration-700">
                    <h3 className="text-4xl lg:text-5xl font-poppins font-black text-white tracking-tight leading-tight mb-8 transform -translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                      {step.title}
                    </h3>
                    <div className={cn(
                      "w-20 h-1.5 rounded-full mb-8 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700",
                      step.type === 'sell' ? "bg-indigo-500" : "bg-purple-500"
                    )} />
                    <p className="text-gray-200 font-medium leading-relaxed text-xl max-w-lg transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        {/* blogs */}
        <section className="py-15 bg-transparent">
          <div className="w-[80%] mx-auto px-4">
            <h2 className="text-5xl text-white font-poppins font-black text-center mt-8 mb-20">
              Read our <span className="text-transparent bg-clip-text bg-gradient-to-tl from-indigo-600 to-sky-600">Blog</span>
            </h2>
            <div className="flex justify-center mt-20 pb-20">
              <BlogDeck posts={blogPosts} />
            </div>
          </div>
        </section>
        {/* Background decorative elements - Dark theme */}
        <div className="absolute bottom-0 left-0 w-[900px] h-[1000px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-95 w-[900px] h-[900px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[900px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      </div>
    </main>
  );
}
