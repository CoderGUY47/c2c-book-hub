import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Book-Hub",
  description:
    "বুক-হাব ব্লগে পড়ার টিপস, বইয়ের রিভিউ, বিক্রেতাদের গাইড এবং কমিউনিটির গল্প জানুন। প্রতিটি পাঠকের জন্য সহায়ক নিবন্ধ।",
  keywords: "book blog, reading tips, book reviews, buy sell books guide, book hub community",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
