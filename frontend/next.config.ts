import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com', 
      'media.istockphoto.com', 
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'books.google.com',
      'covers.openlibrary.org'
    ],
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Suppress 'supports-color' missing module warning from debug/axios on client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'supports-color': false,
      };
    }
    return config;
  },
};

export default nextConfig;