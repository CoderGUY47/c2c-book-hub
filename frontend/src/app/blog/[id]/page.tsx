import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "নিবন্ধ বিস্তারিত | Book-Hub",
};

const blogPosts = [
  {
    id: "1",
    tag: "বিক্রেতা গাইড",
    title: "মাত্র ৩টি সহজ ধাপে আপনার পুরনো বই কীভাবে বিক্রি করবেন",
    excerpt: "আপনার তাকে ধুলো জমা বই আছে? ১০ মিনিটেরও কম সময়ে সেগুলো বুক-হাবে তালিকাভুক্ত করুন এবং ইতিমধ্যে পড়া বই থেকে টাকা উপার্জন শুরু করুন।",
    author: "আরিফ হোসেন",
    date: "১৮ এপ্রিল, ২০২৬",
    readTime: "৫ মিনিট পড়ার সময়",
    imageSrc: "/images/books/book_1778841217085.jpg",
  },
  {
    id: "2",
    tag: "বইয়ের রিভিউ",
    title: "১০টি বই যা প্রতিটি পাঠকের অন্তত একবার পড়া উচিত",
    excerpt: "আপনি গল্প, ইতিহাস বা বিজ্ঞান ভালোবাসুন না কেন — এই তালিকায় আপনার জন্য কিছু না কিছু আছে। এই বইগুলোই বুক-হাবের পাঠকেরা তাদের বন্ধুদের বারবার সুপারিশ করে।",
    author: "নুসরাত জাহান",
    date: "১৫ এপ্রিল, ২০২৬",
    readTime: "৮ মিনিট পড়ার সময়",
    imageSrc: "/images/books/book_1778841219882.jpg",
  },
  {
    id: "3",
    tag: "ফ্রি রিসোর্স",
    title: "কোথায় অনলাইনে বিনামূল্যে বই পড়া যায় — ১০০% বৈধ উপায়ে",
    excerpt: "দারুণ বই পড়ার জন্য আপনার টাকা খরচ করার প্রয়োজন নেই। আমরা এমন সেরা ওয়েবসাইটগুলোর তালিকা করেছি যেখানে আপনি হাজার হাজার বিনামূল্যের বই পাবেন — কোনো সাবস্ক্রিপশন ছাড়াই।",
    author: "তানভীর রহমান",
    date: "১২ এপ্রিল, ২০২৬",
    readTime: "৪ মিনিট পড়ার সময়",
    imageSrc: "/images/books/book_1778841222808.jpg",
  },
  {
    id: "4",
    tag: "কমিউনিটি",
    title: "আসল মানুষ, আসল গল্প: আমাদের বিক্রেতারা কীভাবে শুরু করেছিলেন",
    excerpt: "সাধারণ শিক্ষার্থী এবং পাঠকদের সাথে পরিচিত হোন যারা বইয়ের প্রতি তাদের ভালোবাসাকে একটি স্থির বাড়তি আয়ের উৎসে পরিণত করেছেন। তাদের গল্পগুলো আপনাকে অনুপ্রাণিত করতে পারে।",
    author: "সুমাইয়া আক্তার",
    date: "১০ এপ্রিল, ২০২৬",
    readTime: "৭ মিনিট পড়ার সময়",
    imageSrc: "/images/books/book_1778841225521.jpg",
  },
  {
    id: "5",
    tag: "উৎপাদনশীলতা",
    title: "পড়ার জন্য অনেক ব্যস্ত? এখানে প্রতি মাসে একটি বই শেষ করার উপায় দেওয়া হলো",
    excerpt: "আপনার ঘণ্টার পর ঘণ্টা অবসর সময়ের প্রয়োজন নেই। আপনার দৈনন্দিন রুটিনে কিছু ছোট পরিবর্তন এনে আপনি স্বাচ্ছন্দ্যে মাসে একটি বই পড়তে পারেন — এমনকি ব্যস্ত সময়সূচীর মধ্যেও।",
    author: "মেহেদী হাসান",
    date: "৮ এপ্রিল, ২০২৬",
    readTime: "৫ মিনিট পড়ার সময়",
    imageSrc: "/images/books/book_1778841214693.jpg",
  },
  {
    id: "6",
    tag: "ক্রেতা গাইড",
    title: "বুক-হাবে আপনার প্রথম কেনাকাটা? এখানে সবকিছু আপনার জানা প্রয়োজন",
    excerpt: "বুক-হাবে নতুন? এই বন্ধুত্বপূর্ণ গাইডটি আপনাকে সঠিক বই খুঁজে পেতে, নিরাপদে আপনার প্রথম অর্ডারটি দিতে এবং এটি হাতে পেতে সাহায্য করবে — ধাপে ধাপে।",
    author: "ফারিহা ইসলাম",
    date: "৫ এপ্রিল, ২০২৬",
    readTime: "৪ মিনিট পড়ার সময়",
    imageSrc: "/images/books/book_1778841217085.jpg",
  },
];

export default function BlogPostDetail({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id) || blogPosts[0];

  return (
    <main className="min-h-screen bg-gray-950 text-white py-24 px-4 font-bangla">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-flex items-center gap-2">
          &larr; ব্লগে ফিরে যান
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
            এটি একটি ডেমো বিস্তারিত পৃষ্ঠা। বর্তমানে এখানে একটি ছোট নমুনা দেখানো হচ্ছে। 
            ভবিষ্যতে আপনি এখানে বিস্তারিত কন্টেন্ট, ছবি এবং অন্যান্য দরকারি তথ্য যোগ করতে পারবেন। 
            বুক-হাবের লক্ষ্য হলো পাঠকদের জন্য একটি আদর্শ প্ল্যাটফর্ম তৈরি করা।
          </p>
        </div>
      </div>
    </main>
  );
}
