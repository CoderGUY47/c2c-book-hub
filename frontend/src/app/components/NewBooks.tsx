import React from "react";
import NewBooksClient from "./NewBooksClient";

const NewBooks = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${apiUrl}/api/products`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    const result = await res.json();
    const books = result?.success ? result.data : [];
    
    return <NewBooksClient books={books} />;
  } catch (error) {
    console.error("Failed to fetch new books:", error);
    return <NewBooksClient books={[]} />;
  }
};


export default NewBooks;
