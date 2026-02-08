"use client";
import Image from "next/image";
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

export default function Home() {
  const bannerImages = [
    "/images/book1.webp",
    "/images/book-2.jpg",
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

  const [currentImage, setCurrentImage] = useState(0);
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
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
        ))}

        <div className="relative flex flex-col w-[80%] mx-auto px-0 h-full items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-6xl max-w-4xl mx-auto font-black font-poppins mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-tl from-amber-600 to-red-600">New</span> Online Buying &
            Selling Mart in Bangladesh
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

      {/* Trending Books Section (NYT Style) */}
      <TrendingBooksSection />

      {/* Browse Genres Section */}
      <BrowseGenresSection />

      <NewBooks />
      {/* <div className="flex justify-center mt-7 mb-20">
        <Link href="/books">
          <Button className="ripple-button inline-flex items-center justify-between bg-purple-600 text-md font-bold p-6 text-white border-0 rounded-full tracking-wider overflow-hidden transition-all cursor-pointer">
            <i className="animation"></i>
            Go to Books Collection <BiCollection className="size-5" />
            <i className="animation"></i>
          </Button>
        </Link>
      </div> */}

      {/* Recommended for You (Mock Books) */}
      <MockBooksSection />

      {/* Free Ebooks Section */}
      <FreeEbooksSection />

      {/* selling system */}
      <div className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

        <section className="py-8 bg-transparent relative z-10">
          <div className="w-[80%] mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-poppins font-black mb-4 text-white tracking-tighter">
                How to
                <span className="text-transparent bg-clip-text bg-gradient-to-tl from-red-600 to-orange-400"> SELL </span>Your Used Books in
                <span className="text-transparent bg-clip-text bg-gradient-to-tl from-indigo-600 to-violet-500"> Book-Hub?</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                Turn your bookshelf into a goldmine with these 3-step selling process.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {sellSteps.map((step, index) => (
                <div key={index} className="group relative w-full aspect-[3/4] md:aspect-auto md:h-[420px] flex justify-center p-2">
                  {/* Premium Image-First Card */}
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(79,70,229,0.3)] group-hover:border-indigo-500/50">

                    {/* Hero Icon (Fills Card) */}
                    <div className="absolute inset-0 flex items-center justify-center p-0 transition-all duration-700 group-hover:scale-110 group-hover:blur-md opacity-90 group-hover:opacity-20">
                      {/* @ts-ignore */}
                      {step.imageSrc && (
                        <Image
                          /* @ts-ignore */
                          src={step.imageSrc}
                          alt={step.title}
                          width={500}
                          height={500}
                          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        />
                      )}
                    </div>

                    {/* Step Number Badge (Preserved style as requested) */}
                    <div className="absolute top-0 right-0 z-20 transition-all duration-500 group-hover:scale-90 group-hover:opacity-0">
                      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black px-6 py-2 rounded-bl-3xl shadow-xl tracking-tighter uppercase text-xs">
                        {step.step}
                      </div>
                    </div>

                    {/* Hover Overlay (Full Content) */}
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-10 text-center opacity-0 group-hover:opacity-100 backdrop-blur-2xl bg-gray-950/40 transition-all duration-700">

                      <div className="mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                        {step.step}
                      </div>

                      <h3 className="text-3xl font-poppins font-black text-white tracking-tight leading-tight mb-6 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                        {step.title}
                      </h3>

                      <div className="w-16 h-1 bg-indigo-500 rounded-full mb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-300" />

                      <p className="text-gray-200 font-medium leading-relaxed text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-400">
                        {step.description}
                      </p>

                      <div className="absolute bottom-10 flex flex-col items-center opacity-40">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                          Book-Hub
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* buying system */}
        <section className="py-10 pb-15 bg-transparent">
          <div className="w-[80%] mx-auto px-4">
            <div className="text-center mb-7">
              <h2 className="text-4xl md:text-5xl font-poppins font-black mb-4 text-white tracking-tighter">
                How to
                <span className="text-transparent bg-clip-text bg-gradient-to-tl from-red-600 to-orange-400"> BUY </span>Your Used Books in
                <span className="text-transparent bg-clip-text bg-gradient-to-tl from-indigo-600 to-violet-500"> Book-Hub?</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                Get a limited dicscount and get the best price for your books in
                Book-Hub.😉
              </p>
            </div>
            <div className="relative grid md:grid-cols-3 gap-4 pt-10">
              {buySteps.map((step, index) => (
                <div key={index} className="group relative w-full aspect-[3/4] md:aspect-auto md:h-[420px] flex justify-center p-2">
                  {/* Premium Image-First Card */}
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(124,58,237,0.3)] group-hover:border-purple-500/50">

                    {/* Hero SVG Icon (Fills Card) */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-700 group-hover:scale-110 group-hover:blur-md opacity-90 group-hover:opacity-20">
                      {/* @ts-ignore */}
                      {step.imageSrc && (
                        <Image
                          /* @ts-ignore */
                          src={step.imageSrc}
                          alt={step.title}
                          width={280}
                          height={280}
                          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        />
                      )}
                    </div>

                    {/* Step Badge (Subtle initial state) */}
                    <div className="absolute top-6 left-6 z-20 transition-all duration-500 group-hover:scale-90 group-hover:opacity-0">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-[0.2em]">
                        {step.step}
                      </div>
                    </div>

                    {/* Hover Overlay (Full Content) */}
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-10 text-center opacity-0 group-hover:opacity-100 backdrop-blur-2xl bg-gray-950/40 transition-all duration-700">

                      <div className="mb-4 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                        {step.step}
                      </div>

                      <h3 className="text-3xl font-poppins font-black text-white tracking-tight leading-tight mb-6 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                        {step.title}
                      </h3>

                      <div className="w-16 h-1 bg-purple-500 rounded-full mb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-300" />

                      <p className="text-gray-200 font-medium leading-relaxed text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-400">
                        {step.description}
                      </p>

                      <div className="absolute bottom-10 flex flex-col items-center opacity-40">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">
                          Book-Hub
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
