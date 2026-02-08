"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
    Heart,
    Loader2,
    MapPin,
    Share2,
    ShoppingCart,
    Star,
    BookOpen,
    ExternalLink,
    Library
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareButton } from "@/app/components/Share";
import NoData from "@/app/components/NoData";

interface OpenLibraryWork {
    title: string;
    description?: string | { value: string };
    covers?: number[];
    subject?: string[];
    authors?: { author: { key: string } }[];
    first_publish_date?: string;
    key: string;
}

interface Author {
    name: string;
}

const ExternalBookDetails = () => {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [book, setBook] = useState<OpenLibraryWork | null>(null);
    const [author, setAuthor] = useState<string>("Unknown Author");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchBookDetails = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Work Details
                const workRes = await fetch(`https://openlibrary.org/works/${id}.json`);
                if (!workRes.ok) throw new Error("Failed to fetch work");
                const workData: OpenLibraryWork = await workRes.json();

                // If the work itself doesn't have an IA ID, we might want to check its editions
                // But often 'works' have a 'ia' property if there is a representative edition.
                // For better coverage, we could fetch editions, but let's start with the work's IA ID.
                setBook(workData);

                // 2. Fetch Author Details (if available)
                if (workData.authors && workData.authors.length > 0) {
                    const authorKey = workData.authors[0].author.key;
                    const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
                    if (authorRes.ok) {
                        const authorData: Author = await authorRes.json();
                        setAuthor(authorData.name);
                    }
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchBookDetails();
        }
    }, [id]);

    const getDescription = (book: OpenLibraryWork) => {
        if (typeof book.description === 'string') return book.description;
        if (typeof book.description === 'object' && book.description?.value) return book.description.value;
        return "No description available for this book.";
    };

    const getCoverImage = (coverId?: number, size: 'M' | 'L' = 'L') => {
        if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
        return "/images/book-placeholder.jpg"; // Fallback
    };

    // Images array for gallery (using up to 3 covers if available, or just the main one)
    const bookImages = book?.covers
        ? book.covers.slice(0, 3).map(c => getCoverImage(c, 'L'))
        : ["/images/book-placeholder.jpg"];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Skeleton Loading UI mimicking the main page */}
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                            <Skeleton className="h-[500px] w-full rounded-xl bg-gray-200" />
                            <div className="flex gap-2">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-20 w-20 rounded-lg bg-gray-200" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-3/4 bg-gray-200" />
                            <Skeleton className="h-6 w-1/4 bg-gray-200" />
                            <Skeleton className="h-32 w-full bg-gray-200" />
                            <Skeleton className="h-14 w-40 bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <NoData
                    imageUrl="/images/no-book.jpg"
                    message="Book Not Found"
                    description="We couldn't locate the details for this book."
                    buttonText="Browse Trending"
                    onClick={() => router.push("/")}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 font-poppins text-gray-800">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 overflow-hidden whitespace-nowrap">
                    <Link href="/" className="hover:text-indigo-600 font-medium transition-colors">Home</Link>
                    <span>/</span>
                    <span className="font-medium text-indigo-600">External</span>
                    <span>/</span>
                    <span className="truncate text-gray-800">{book.title}</span>
                </nav>

                <div className="grid gap-12 lg:grid-cols-[1fr,1.2fr]">
                    {/* Left Column: Images */}
                    <div className="space-y-6">
                        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 group">
                            <Image
                                src={bookImages[selectedImage]}
                                alt={book.title}
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                EXTERNAL LISTING
                            </div>
                        </div>

                        {bookImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {bookImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative h-24 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? "border-indigo-600 ring-2 ring-indigo-100" : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3">
                                {book.title}
                            </h1>
                            <div className="flex items-center flex-wrap gap-4 text-sm font-medium text-gray-500">
                                <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md">
                                    <BookOpen className="w-4 h-4" />
                                    {author}
                                </span>
                                {book.first_publish_date && (
                                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-md">
                                        Published: {book.first_publish_date}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 py-6 border-t border-b border-gray-200">
                            <Button
                                className="h-14 px-8 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 rounded-xl transition-all hover:-translate-y-1"
                                onClick={() => window.open(`https://openlibrary.org/works/${id}`, '_blank')}
                            >
                                <ExternalLink className="mr-2 h-5 w-5" />
                                View on Open Library
                            </Button>
                            <div className="flex gap-3">
                                <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <Heart className="h-6 w-6" />
                                </Button>
                                <ShareButton
                                    url={`https://openlibrary.org/works/${id}`}
                                    title={book.title}
                                    text={`Check out this book: ${book.title}`}
                                />
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <Card className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Library className="w-4 h-4" /> Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed text-sm h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {getDescription(book) || "No description provided."}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Star className="w-4 h-4" /> Topics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {book.subject?.slice(0, 8).map((subject, i) => (
                                            <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                                                {subject}
                                            </Badge>
                                        )) || <span className="text-gray-400 text-sm">No topics listed.</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
                            <div className="bg-amber-100 p-2 rounded-full h-fit">
                                <ExternalLink className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 text-sm mb-1">External Source</h4>
                                <p className="text-sm text-amber-800/80">
                                    This book data is sourced from the Open Library. It is not listed for sale directly on our platform but may be available in the public domain or other retailers.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExternalBookDetails;