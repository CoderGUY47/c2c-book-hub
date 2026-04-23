import React from "react";
import TrendingBooksCarousel from "./TrendingBooksCarousel";

const TrendingBooksSection = async () => {
    try {
        const res = await fetch("https://openlibrary.org/search.json?subject=thriller&sort=editions&limit=50", {
            next: { revalidate: 3600 } // Revalidate hourly for trending books
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        return <TrendingBooksCarousel books={data?.docs || []} />;
    } catch (error) {
        console.error("Failed to fetch trending books:", error);
        return <TrendingBooksCarousel books={[]} />;
    }
};

export default TrendingBooksSection;
