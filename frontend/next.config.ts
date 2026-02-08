import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Add res.cloudinary.com to this list
    domains: [
      'images.unsplash.com', 
      'media.istockphoto.com', 
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'books.google.com',
      'covers.openlibrary.org'
    ]
  },
  outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;