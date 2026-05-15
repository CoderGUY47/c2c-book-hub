"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Ariful Islam",
    role: "Avid Reader",
    content: "Book-Hub has completely changed how I buy books. The quality of used books is amazing, and the prices are unbeatable. Highly recommended for every book lover in Bangladesh!",
    rating: 5,
    image: "/images/book1.webp"
  },
  {
    id: 2,
    name: "Sumiya Akter",
    role: "University Student",
    content: "As a student, I'm always looking for affordable textbooks. I found all my semester books here at half the price of new ones. The delivery was fast too!",
    rating: 5,
    image: "/images/book2.webp"
  },
  {
    id: 3,
    name: "Tanvir Ahmed",
    role: "Collector",
    content: "The platform is so easy to use. I sold my old collection in just a few days. The interface is clean, and the community of readers here is fantastic.",
    rating: 4,
    image: "/images/book3.webp"
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    role: "Literature Critic",
    content: "I love the variety of genres available. From rare classics to modern thrillers, Book-Hub has everything. It's more than just a shop; it's a paradise for bibliophiles.",
    rating: 5,
    image: "/images/book4.webp"
  }
];

const CustomerReviews = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="w-full bg-[#0a0a0a] py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold tracking-[0.3em] text-violet-400 uppercase mb-4">Reviews & Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold font-langar text-white tracking-tight leading-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Readers</span> Say
          </h2>
        </div>

        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {reviews.map((review) => (
              <div key={review.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4 min-w-0">
                <div className="h-full bg-white/[0.03] border border-white/10 rounded-[32px] p-8 md:p-10 relative group hover:border-violet-500/30 transition-all duration-500 hover:bg-white/[0.05] flex flex-col">
                  {/* Quote Icon */}
                  <div className="absolute top-8 right-8 text-white/5 group-hover:text-violet-500/10 transition-colors duration-500">
                    <Quote size={64} fill="currentColor" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-white/10"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-white/70 text-lg leading-relaxed mb-10 font-medium italic flex-grow">
                    "{review.content}"
                  </p>

                  {/* User Profile */}
                  <div className="flex items-center gap-4 border-t border-white/5 pt-8 mt-auto">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:border-violet-500/30 transition-colors duration-500">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base tracking-tight">{review.name}</h4>
                      <p className="text-violet-400 text-xs font-bold uppercase tracking-widest">{review.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-3 mt-16">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 transition-all duration-500 rounded-full ${
                selectedIndex === index 
                  ? "w-8 bg-violet-500" 
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
