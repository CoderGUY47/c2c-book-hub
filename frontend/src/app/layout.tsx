import type { Metadata } from "next";
import { Poppins, Hanken_Grotesk, Langar } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./LayoutWrapper";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

// const hankenGrotesk = Hanken_Grotesk({
//   weight: ["400", "500", "600", "700", "800", "900"],
//   style: ["normal"],
//   subsets: ["latin"],
//   display: "swap",
// });


const langar = Langar({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-langar",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Book-Hub",
    default: "Book-Hub - Online Buying & Selling Book Hub",
  },
  description: "The best online marketplace for buying and selling used books. Find cheap, trending, and academic books globally.",
  keywords: ["books", "used books", "buy books online", "sell books online", "bookstore", "read books"],
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${langar.variable}`}
    >
      <head>
        <link rel="stylesheet" href="/icons/css/all.min.css" />
      </head>
      <body className="flex flex-col min-h-screen bg-gradient from-gray-950 via-bg-transparent to-gray-950 ">
        <LayoutWrapper>
          {/* <Header /> */}
          <main className="flex-grow w-full bg-gray-950">
            {children}
          </main>
          {/* <Footer /> */}
        </LayoutWrapper>
      </body>
    </html>
  );
}
