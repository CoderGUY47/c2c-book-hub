"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ExternalLink, Download, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/app/components/NoData";

interface GoogleBookDetails {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        publisher?: string;
        publishedDate?: string;
        description?: string;
        pageCount?: number;
        categories?: string[];
        imageLinks?: {
            thumbnail: string;
            small: string;
            medium: string;
            large: string;
        };
        previewLink?: string;
        infoLink?: string;
        language?: string;
    };
    accessInfo?: {
        epub?: {
            isAvailable: boolean;
            downloadLink?: string;
        };
        pdf?: {
            isAvailable: boolean;
            downloadLink?: string;
        };
        webReaderLink?: string;
        accessViewStatus?: string;
    };
}

const FreeEbookDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [book, setBook] = useState<GoogleBookDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const res = await fetch(
                    `https://www.googleapis.com/books/v1/volumes/${id}`
                );
                if (!res.ok) throw new Error("Failed to fetch book details");
                const data = await res.json();
                setBook(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load book details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container w-[80%] mx-auto px-4">
                    <Skeleton className="h-10 w-32 mb-8 bg-gray-200" />
                    <div className="grid gap-12 lg:grid-cols-[1fr,1.5fr]">
                        <div className="space-y-6">
                            <Skeleton className="h-[500px] w-full rounded-2xl bg-gray-200" />
                        </div>
                        <div className="space-y-8">
                            <Skeleton className="h-12 w-3/4 bg-gray-200" />
                            <Skeleton className="h-6 w-1/2 bg-gray-100" />
                            <Skeleton className="h-32 w-full bg-gray-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <NoData
                    imageUrl="/images/no-book.jpg"
                    message="Book Not Found"
                    description="We couldn't locate the details for this free ebook."
                    buttonText="Browse Free Ebooks"
                    onClick={() => router.push("/")}
                />
            </div>
        );
    }

    const image = book.volumeInfo.imageLinks?.large ||
        book.volumeInfo.imageLinks?.medium ||
        book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
        "/images/book-placeholder.jpg";

    const webReaderLink = book.accessInfo?.webReaderLink;
    const pdfDownload = book.accessInfo?.pdf?.downloadLink;
    const epubDownload = book.accessInfo?.epub?.downloadLink;

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            <div className="container w-[80%] mx-auto px-4 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-8 hover:bg-gray-100 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Free Ebooks
                </Button>

                <div className="grid gap-12 lg:grid-cols-[1fr,1.5fr]">
                    {/* Left Column: Book Image */}
                    <div className="space-y-6">
                        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100 group">
                            <Image
                                src={image}
                                alt={book.volumeInfo.title}
                                fill
                                className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-full shadow-lg">
                                    FREE LICENSE
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Book Details */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3">
                                {book.volumeInfo.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                {book.volumeInfo.authors && (
                                    <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-md font-medium">
                                        <BookOpen className="w-4 h-4" />
                                        {book.volumeInfo.authors.join(", ")}
                                    </span>
                                )}
                                {book.volumeInfo.publishedDate && (
                                    <span className="bg-gray-100 px-4 py-1.5 rounded-md font-medium text-gray-700">
                                        Published: {book.volumeInfo.publishedDate}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 py-6 border-t border-b border-gray-200">
                            {webReaderLink && (
                                <Button
                                    className="h-14 px-8 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 rounded-xl transition-all hover:-translate-y-1"
                                    onClick={() => {
                                        // Open in a controlled popup window
                                        const width = Math.min(1200, window.screen.width * 0.9);
                                        const height = Math.min(800, window.screen.height * 0.9);
                                        const left = (window.screen.width - width) / 2;
                                        const top = (window.screen.height - height) / 2;

                                        window.open(
                                            webReaderLink,
                                            'GoogleBooksReader',
                                            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,scrollbars=yes,resizable=yes`
                                        );
                                    }}
                                >
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Read Online
                                </Button>
                            )}

                            {pdfDownload && (
                                <Button
                                    variant="outline"
                                    className="h-14 px-8 text-base font-bold border-gray-300 hover:bg-gray-50 rounded-xl"
                                    onClick={() => window.open(pdfDownload, "_blank")}
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Download PDF
                                </Button>
                            )}

                            {epubDownload && (
                                <Button
                                    variant="outline"
                                    className="h-14 px-8 text-base font-bold border-gray-300 hover:bg-gray-50 rounded-xl"
                                    onClick={() => window.open(epubDownload, "_blank")}
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Download EPUB
                                </Button>
                            )}

                            {book.volumeInfo.previewLink && (
                                <Button
                                    variant="outline"
                                    className="h-14 px-8 text-base font-bold border-gray-300 hover:bg-gray-50 rounded-xl"
                                    onClick={() => window.open(book.volumeInfo.previewLink, "_blank")}
                                >
                                    <ExternalLink className="mr-2 h-5 w-5" />
                                    Google Books
                                </Button>
                            )}
                        </div>

                        {/* Info Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <Card className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed text-sm max-h-40 overflow-y-auto custom-scrollbar">
                                        {book.volumeInfo.description?.replace(/<[^>]*>/g, "") || "No description available."}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    {book.volumeInfo.publisher && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Publisher:</span>
                                            <span className="font-medium text-gray-900">{book.volumeInfo.publisher}</span>
                                        </div>
                                    )}
                                    {book.volumeInfo.pageCount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Pages:</span>
                                            <span className="font-medium text-gray-900">{book.volumeInfo.pageCount}</span>
                                        </div>
                                    )}
                                    {book.volumeInfo.language && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Language:</span>
                                            <span className="font-medium text-gray-900 uppercase">{book.volumeInfo.language}</span>
                                        </div>
                                    )}
                                    {book.volumeInfo.categories && book.volumeInfo.categories.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <div className="flex flex-wrap gap-2">
                                                {book.volumeInfo.categories.slice(0, 3).map((cat, i) => (
                                                    <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                                                        {cat}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
                            <div className="bg-amber-100 p-2 rounded-full h-fit">
                                <ExternalLink className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 text-sm mb-1">Free & Open Access</h4>
                                <p className="text-sm text-amber-800/80">
                                    This ebook is sourced from Google Books and available under a free license.
                                    You can read, download, and share it freely according to the license terms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reading Notice */}
                <div className="container w-[80%] mx-auto px-4 py-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4">
                        <div className="bg-blue-100 p-2 rounded-full h-fit">
                            <BookOpen className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm mb-1">Online Reading Experience</h4>
                            <p className="text-sm text-blue-800/80">
                                When you click "Read Online", the book will open in a popup window powered by Google Books.
                                For the best reading experience, please allow popups for this site. The reader includes built-in
                                copyright protection and limited download capabilities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeEbookDetailPage;
