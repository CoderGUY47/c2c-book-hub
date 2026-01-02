import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Add res.cloudinary.com to this list
    domains: [
      'images.unsplash.com', 
      'media.istockphoto.com', 
      'res.cloudinary.com'
    ]
  },
  outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;