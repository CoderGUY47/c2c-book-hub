import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Book-Hub",
  description:
    "Learn about reading tips, book reviews, seller guides, and community stories on the Book-Hub blog. Helpful articles for every reader.",
  keywords: "book blog, reading tips, book reviews, buy sell books guide, book hub community",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
