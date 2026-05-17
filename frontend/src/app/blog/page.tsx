"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import {
  BookArticlesIcon,
  ReadersIcon,
  CategoriesIcon,
  FreeReadIcon,
} from "../animated-icons";

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */

const categories = [
  { label: "All Articles", slug: "all" },
  { label: "Reading Tips", slug: "reading-tips" },
  { label: "Book Reviews", slug: "book-reviews" },
  { label: "Seller Guide", slug: "seller-guide" },
  { label: "Buyer Guide", slug: "buyer-guide" },
  { label: "Free Ebooks", slug: "free-ebooks" },
  { label: "Community", slug: "community" },
];

const featuredPost = {
  category: "Reading Tips",
  categorySlug: "reading-tips",
  title: "How Reading for Just 20 Minutes a Day Can Completely Change Your Life",
  excerpt:
    "Reading isn't just limited to student homework — it's one of the most powerful daily habits you can build. Reading a good book for just 20 minutes a day sharpens your mind, reduces stress, expands your vocabulary, and helps you see the world differently. In this article, we discuss exactly how to start and how to keep it going.",
  author: "Book-Hub Editorial",
  date: "April 20, 2026",
  readTime: "6 min read",
  imageSrc: "/images/book7.webp",
  tags: ["Reading Habits", "Self-Improvement", "Daily Routine"],
};

const blogPosts = [
  {
    id: 1,
    category: "seller-guide",
    tag: "Seller Guide",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    title: "How to Sell Your Used Books in Just 3 Easy Steps",
    excerpt:
      "Have dusty books on your shelf? List them on Book-Hub in less than 10 minutes and start earning money from books you've already read.",
    author: "Arif Hossain",
    authorInitial: "A",
    date: "April 18, 2026",
    readTime: "5 min read",
    imageSrc: "/images/book1.webp",
  },
  {
    id: 2,
    category: "book-reviews",
    tag: "Book Reviews",
    tagColor: "bg-violet-500/15 text-violet-400 border-violet-500/20",
    title: "10 Books Every Reader Should Read at Least Once",
    excerpt:
      "Whether you love fiction, history, or science — there's something for you in this list. These are the books Book-Hub readers recommend to their friends over and over.",
    author: "Nusrat Jahan",
    authorInitial: "N",
    date: "April 15, 2026",
    readTime: "8 min read",
    imageSrc: "/images/book2.webp",
  },
  {
    id: 3,
    category: "free-ebooks",
    tag: "Free Resources",
    tagColor: "bg-sky-500/15 text-sky-400 border-sky-500/20",
    title: "Where to Read Books for Free Online — 100% Legal Ways",
    excerpt:
      "You don't need to spend money to read great books. We've listed the best websites where you can find thousands of free books — with no subscription needed.",
    author: "Tanvir Rahman",
    authorInitial: "T",
    date: "April 12, 2026",
    readTime: "4 min read",
    imageSrc: "/images/book3.webp",
  },
  {
    id: 4,
    category: "community",
    tag: "Community",
    tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    title: "Real People, Real Stories: How Our Sellers Got Started",
    excerpt:
      "Meet ordinary students and readers who have turned their love for books into a steady source of extra income. Their stories might inspire you.",
    author: "Sumaiya Akter",
    authorInitial: "S",
    date: "April 10, 2026",
    readTime: "7 min read",
    imageSrc: "/images/book4.webp",
  },
  {
    id: 5,
    category: "reading-tips",
    tag: "Productivity",
    tagColor: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    title: "Too Busy to Read? Here's How to Finish One Book a Month",
    excerpt:
      "You don't need hours of free time. By making some small changes to your daily routine, you can comfortably read one book a month — even with a busy schedule.",
    author: "Mehedi Hasan",
    authorInitial: "M",
    date: "April 8, 2026",
    readTime: "5 min read",
    imageSrc: "/images/book5.webp",
  },
  {
    id: 6,
    category: "buyer-guide",
    tag: "Buyer Guide",
    tagColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    title: "Your First Purchase on Book-Hub? Here's Everything You Need to Know",
    excerpt:
      "New to Book-Hub? This friendly guide will help you find the right books, place your first order safely, and get it in your hands — step by step.",
    author: "Fariha Islam",
    authorInitial: "F",
    date: "April 5, 2026",
    readTime: "4 min read",
    imageSrc: "/images/book6.webp",
  },
];

const stats = [
  { value: "120+", label: "Articles Published", Icon: BookArticlesIcon, color: "border-indigo-500/20 hover:border-indigo-500/40" },
  { value: "15k+", label: "Monthly Readers", Icon: ReadersIcon, color: "border-violet-500/20 hover:border-violet-500/40" },
  { value: "6", label: "Topic Categories", Icon: CategoriesIcon, color: "border-purple-500/20 hover:border-purple-500/40" },
  { value: "100%", label: "Free to Read", Icon: FreeReadIcon, color: "border-indigo-500/20 hover:border-indigo-500/40" },
];

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
    setIsSubscribing(false);
  };

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return blogPosts;
    return blogPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[520px] flex flex-col justify-center overflow-hidden">
        {/* Ambient gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-600/[0.06] rounded-full blur-[120px] pointer-events-none" />
        {/* Top border line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="w-[90%] max-w-7xl mx-auto px-4 relative z-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[2px] bg-white/30" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                  Book-Hub // Our Blog
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-16 mb-6">
                Stories and{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  Ideas
                </span>
                <br />
                for Every Reader
              </h1>

              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mb-8 font-normal">
                Whether you love to buy, sell, or just read — our blog has helpful guides, honest reviews, and real stories written for ordinary readers like you.
              </p>

              {/* Search bar */}
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for new articles / 'how to sell books'"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-none text-white/70 placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all duration-200"
                />
              </div>
            </div>

            {/* Right: Stats grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`bg-white/[0.03] border ${s.color} p-6 rounded-xl backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group`}
                >
                  <s.Icon className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-4xl font-bold font-poppins text-white mb-1 tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORY PILLS
      ══════════════════════════════════════════════════════ */}
      <section className="w-[90%] max-w-7xl mx-auto px-4 py-8 border-b border-white/[0.06]">
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border rounded-none ${
                activeCategory === cat.slug
                  ? "bg-violet-600 border-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                  : "bg-white/[0.03] border-white/[0.08] text-white/45 hover:bg-white/[0.08] hover:text-white hover:border-white/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED ARTICLE  (Flexbox Layout)
      ══════════════════════════════════════════════════════ */}
      <section className="w-[90%] max-w-7xl mx-auto px-4 pt-14 pb-4">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-violet-500" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-violet-400 uppercase">
            Featured Article
          </p>
        </div>

        <div className="group relative bg-white/[0.03] border border-white/[0.07] rounded-sm overflow-hidden cursor-pointer hover:border-violet-500/30 transition-all duration-500 hover:shadow-[0_0_80px_rgba(139,92,246,0.08)]">
          <div className="flex flex-col md:flex-row items-stretch min-h-[300px]">
            {/* Image column */}
            <div className="relative md:w-[300px] flex-shrink-0 h-[200px] md:h-auto overflow-hidden p-6 bg-white/5">
              <Image
                src={featuredPost.imageSrc}
                alt={featuredPost.title}
                fill
                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-700 p-8"
                priority
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-950 hidden md:block pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent md:hidden pointer-events-none" />

              {/* Category badge on image */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-violet-600/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-sm">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* Content column */}
            <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-white/30 text-[11px]">
                  <span>{featuredPost.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {featuredPost.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl text-white leading-tight mb-5 group-hover:text-violet-200 transition-colors duration-300 tracking-tight">
                  {featuredPost.title}
                </h2>

                {/* Excerpt */}
                <p className="text-white/45 text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                  {featuredPost.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.07] text-white/35 text-[10px] font-medium rounded-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author + CTA */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    BH
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-semibold">
                      {featuredPost.author}
                    </p>
                    <p className="text-white/25 text-[10px]">Book-Hub Team</p>
                  </div>
                </div>
                <Link
                  href="/blog/why-reading-changes-your-life"
                  className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-bold uppercase tracking-widest hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-200 rounded-sm"
                >
                  Read Article
                  <svg
                    className="w-3.5 h-3.5 translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ARTICLES GRID  (3-col premium cards)
      ══════════════════════════════════════════════════════ */}
      <section className="w-[90%] max-w-7xl mx-auto px-4 pt-14 pb-6">
        {/* Section label */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-indigo-500" />
            <p className="text-[10px] font-bold tracking-[0.3em] text-white/35 uppercase">
              Latest Articles
            </p>
          </div>
          <span className="text-[11px] text-white/20 font-medium">
            {filteredPosts.length} articles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group relative bg-white/[0.03] border border-white/[0.06] overflow-hidden cursor-pointer hover:border-violet-500/25 transition-all duration-300 hover:shadow-[0_0_50px_rgba(139,92,246,0.07)] flex flex-col rounded-sm"
            >
              {/* Card image */}
              <div className="relative h-48 overflow-hidden flex-shrink-0 bg-white/5">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500 p-6"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent pointer-events-none" />

                {/* Tag pill — top left */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 border rounded-sm text-[9px] font-bold tracking-[0.15em] uppercase ${post.tagColor}`}
                  >
                    {post.tag}
                  </span>
                </div>

                {/* Read time — top right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-sm">
                  <svg
                    className="w-2.5 h-2.5 text-white/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-[9px] text-white/50 font-semibold">
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5">
                {/* Date */}
                <p className="text-white/25 text-[10px] font-medium mb-3">
                  {post.date}
                </p>

                {/* Title */}
                <h3 className="text-sm text-white leading-snug mb-3 group-hover:text-violet-200 transition-colors duration-200 line-clamp-2 tracking-tight">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-white/40 text-xs leading-relaxed line-clamp-3 flex-1 mb-5 font-normal">
                  {post.excerpt}
                </p>

                {/* Divider */}
                <div className="h-[1px] bg-white/[0.05] mb-4 group-hover:bg-violet-500/20 transition-colors duration-300" />

                {/* Footer row */}
                <div className="flex items-center justify-between">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                      {post.authorInitial}
                    </div>
                    <span className="text-white/30 text-[10px] font-medium">
                      {post.author}
                    </span>
                  </div>

                  {/* Read more */}
                  <Link
                    href={`/blog/${post.id}`}
                    className="group/link inline-flex items-center gap-1.5 text-[10px] font-bold text-violet-400 hover:text-violet-300 uppercase tracking-widest transition-colors duration-200"
                  >
                    Read
                    <svg
                      className="w-3 h-3 translate-x-0 group-hover/link:translate-x-0.5 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Bottom glow line on hover */}
              <div className="h-[2px] bg-gradient-to-r from-violet-600 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </article>
          ))}
        </div>

        {/* Empty state if no posts match */}
        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center mb-4 text-white/10">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-white/60 text-lg mb-2">No articles found in this category</h3>
            <p className="text-white/30 text-sm max-w-xs">We are working on adding new articles soon. Please try another category.</p>
            <button 
              onClick={() => setActiveCategory("all")}
              className="mt-6 text-violet-400 text-xs font-bold uppercase tracking-widest hover:text-violet-300 transition-colors"
            >
              Back to All Articles
            </button>
          </div>
        )}

        {/* Load more */}
        {filteredPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/[0.04] border border-white/[0.08] text-white/45 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer rounded-none">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Load More Articles
            </button>
          </div>
        )}
      </section>



      {/* ══════════════════════════════════════════════════════
          NEWSLETTER CTA
      ══════════════════════════════════════════════════════ */}
      <section className="w-[90%] max-w-7xl mx-auto px-4 py-16">
        <div className="relative bg-white/[0.03] border border-violet-500/15 rounded-sm p-10 md:p-14 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/[0.08] blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Left: text */}
            <div className="text-center md:text-left">
              <span className="text-[10px] font-bold tracking-[0.3em] text-violet-400 uppercase block mb-3">
                Stay Updated
              </span>
              <h2 className="text-3xl md:text-4xl text-white mb-3 tracking-tight leading-tight">
                Get New Articles Every Week
                <br className="hidden md:block" /> — For Free
              </h2>
              <p className="text-white/40 text-sm max-w-md leading-relaxed font-normal">
                Join thousands of readers and get our best book collections, selling tips, and community stories directly to your inbox. No spam. You can unsubscribe at any time.
              </p>
            </div>

            {/* Right: form */}
            <div className="w-full md:w-auto flex-shrink-0">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 min-w-[340px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3.5 bg-white/[0.05] border border-white/10 text-white/70 placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-all duration-200 rounded-sm min-w-0"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer whitespace-nowrap shadow-[0_0_30px_rgba(139,92,246,0.3)] rounded-sm flex items-center justify-center min-w-[150px] disabled:opacity-70"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe Free"
                  )}
                </button>
              </form>
              <p className="text-white/20 text-[10px] mt-3 text-center sm:text-left">
                By subscribing you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
