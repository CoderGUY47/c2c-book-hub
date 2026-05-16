import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Article Details | Book-Hub",
};

const blogPosts = [
  {
    id: "1",
    tag: "Seller Guide",
    title: "How to Sell Your Used Books in Just 3 Easy Steps",
    excerpt: "Have dusty books on your shelf? List them on Book-Hub in less than 10 minutes and start earning money from books you've already read.",
    author: "Arif Hossain",
    date: "April 18, 2026",
    readTime: "5 min read",
    imageSrc: "/images/book1.webp",
  },
  {
    id: "2",
    tag: "Book Reviews",
    title: "10 Books Every Reader Should Read at Least Once",
    excerpt: "Whether you love fiction, history, or science — there's something for you in this list. These are the books Book-Hub readers recommend to their friends over and over.",
    author: "Nusrat Jahan",
    date: "April 15, 2026",
    readTime: "8 min read",
    imageSrc: "/images/book2.webp",
  },
  {
    id: "3",
    tag: "Free Resources",
    title: "Where to Read Books for Free Online — 100% Legal Ways",
    excerpt: "You don't need to spend money to read great books. We've listed the best websites where you can find thousands of free books — with no subscription needed.",
    author: "Tanvir Rahman",
    date: "April 12, 2026",
    readTime: "4 min read",
    imageSrc: "/images/book3.webp",
  },
  {
    id: "4",
    tag: "Community",
    title: "Real People, Real Stories: How Our Sellers Got Started",
    excerpt: "Meet ordinary students and readers who have turned their love for books into a steady source of extra income. Their stories might inspire you.",
    author: "Sumaiya Akter",
    date: "April 10, 2026",
    readTime: "7 min read",
    imageSrc: "/images/book4.webp",
  },
  {
    id: "5",
    tag: "Productivity",
    title: "Too Busy to Read? Here's How to Finish One Book a Month",
    excerpt: "You don't need hours of free time. By making some small changes to your daily routine, you can comfortably read one book a month — even with a busy schedule.",
    author: "Mehedi Hasan",
    date: "April 8, 2026",
    readTime: "5 min read",
    imageSrc: "/images/book5.webp",
  },
  {
    id: "6",
    tag: "Buyer Guide",
    title: "Your First Purchase on Book-Hub? Here's Everything You Need to Know",
    excerpt: "New to Book-Hub? This friendly guide will help you find the right books, place your first order safely, and get it in your hands — step by step.",
    author: "Fariha Islam",
    date: "April 5, 2026",
    readTime: "4 min read",
    imageSrc: "/images/book6.webp",
  },
];

export default async function BlogPostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id) || blogPosts[0];

  return (
    <main className="min-h-screen bg-gray-950 text-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-flex items-center gap-2">
          &larr; Back to Blog
        </Link>
        <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-lg">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{post.author}</p>
            <p className="text-xs text-white/40">{post.tag}</p>
          </div>
        </div>
        <div className="relative w-full h-[400px] mb-10 rounded-lg overflow-hidden border border-white/10 bg-white/[0.03]">
          <Image 
            src={post.imageSrc} 
            fill 
            alt={post.title} 
            className="object-contain p-8" 
          />
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-white/80 leading-relaxed mb-6 font-medium">
            {post.excerpt}
          </p>
          <p className="text-lg text-white/60 leading-relaxed mb-6">
            This is a demo detail page. Currently, a short sample is shown here. 
            In the future, you will be able to add detailed content, images, and other useful information here. 
            Book-Hub's mission is to create an ideal platform for readers.
          </p>
        </div>
      </div>
    </main>
  );
}
