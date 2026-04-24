import React from "react";
import NewBooksClient from "./NewBooksClient";

const NewBooks = async () => {
  try {
    // Must use absolute URL for server-side fetch during build/SSR.
    // NEXT_PUBLIC_API_URL should be set to https://oxpecker.pro.bd in Vercel.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://oxpecker.pro.bd";
    const res = await fetch(`${apiUrl}/api/products`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!res.ok) throw new Error(`API responded with status ${res.status}`);
    const result = await res.json();
    const books = result?.success ? result.data : [];
    
    return <NewBooksClient books={books} />;
  } catch (error) {
    console.error("Failed to fetch new books:", error);
    return <NewBooksClient books={[]} />;
  }
};


export default NewBooks;
