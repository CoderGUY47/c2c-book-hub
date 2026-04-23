"use client";
import NoData from "@/app/components/NoData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useAddToCartMutation,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import {
    addToWishlistAction,
    removeFromWishlistAction,
} from "@/store/slice/wishlistSlice";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { formatDistanceToNow } from "date-fns";
import {
    CheckCircle2,
    Heart,
    Loader2,
    MapPin,
    Smartphone,
    ShoppingCart,
    User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ShareButton } from "@/app/components/Share";
import { books } from "@/lib/Constant";
import { TbShare2 } from "react-icons/tb";

const MockBookDetailsPage = () => {
    const params = useParams();
    const idOrSlug = params.id as string;
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddToCart, setIsAddToCart] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Find the mock book by ID or slug
    const book = books.find((b) => {
        const slug = b.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
        return b._id === idOrSlug || slug === idOrSlug;
    });

    const user = useSelector((state: RootState) => state.user.user);
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const [addToCartMutation] = useAddToCartMutation();
    const [addToWishlistMutation] = useAddToWishlistMutation();
    const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();

    const handleAddToCart = async () => {
        // Check if user is logged in first
        if (!user) {
            dispatch(toggleLoginDialog());
            toast.error("Please log in to add items to your cart");
            return;
        }

        // Mock books are for demonstration only - they don't exist in the database
        toast.error("This is a curated example book for demonstration purposes only. Please browse our actual marketplace to find real listings!", {
            duration: 5000,
            icon: "📚"
        });
        return;
    };

    const handleAddToWishlist = async (productId: string) => {
        // Check if user is logged in first
        if (!user) {
            dispatch(toggleLoginDialog());
            toast.error("Please log in to manage your wishlist");
            return;
        }

        // Mock books are for demonstration only - they don't exist in the database
        toast.error("This is a curated example book for demonstration purposes only. Please browse our actual marketplace to find real listings!", {
            duration: 5000,
            icon: "📚"
        });
        return;
    };

    if (!book) {
        return (
            <div className="my-10 max-w-3xl justify-center mx-auto">
                <NoData
                    imageUrl="/images/no-book.jpg"
                    message="Book Not Found"
                    description="We couldn't find the curated classic you're looking for."
                    onClick={() => router.push("/mock-books")}
                    buttonText="Browse Mock Collection"
                />
            </div>
        );
    }

    const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price) {
            const discount = ((price - finalPrice) / price) * 100;
            return Math.round(discount);
        }
        return 0;
    };

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const bookImage = book?.images || [];

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <div className="container mx-auto px-9 py-8">
                <nav className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:underline font-bold text-primary">
                        {""}
                        Home{""}
                    </Link>
                    <span>/</span>
                    <Link
                        href="/mock-books"
                        className="hover:underline font-medium text-primary"
                    >
                        Mock Books
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600">{book.category}</span>
                    <span>/</span>
                    <span className="text-gray-600">{book.title}</span>
                </nav>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="relative h-[400px] overflow-hidden rounded-lg border bg-white shadow-md">
                            <Image
                                src={bookImage[selectedImage] || "/images/book-placeholder.jpg"}
                                alt={book.title}
                                fill
                                className="object-contain"
                            />
                            {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                <span
                                    className="
                                        absolute left-3 top-4             
                                        transform -rotate-12
                                        bg-gradient-to-r from-amber-500 to-orange-500
                                        shadow-2xl
                                        px-4 py-2
                                        text-xs font-bold font-hanken-grotesk text-black
                                        rounded-md 
                                        transition-transform duration-200 hover:scale-110
                                        cursor-pointer"
                                >
                                    {calculateDiscount(book.price, book.finalPrice)}%Off
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {bookImage.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border 
                                        transition-all duration-300 ${selectedImage === index
                                            ? "ring-2 ring-blue-500 scale-105"
                                            : "hover:scale-105"
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${book.title} - Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-black">{book.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                    Posted {isMounted ? formatDate(book.createdAt) : '...'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {isMounted ? (
                                    <ShareButton
                                        url={window.location.href}
                                        title={`Check out this book on Book Shop: ${book.title}`}
                                        text={`I just found this book on Book Shop and I think you will love it!: ${book.title}`}
                                    />
                                ) : (
                                    <Button variant="outline" size="sm">
                                        <TbShare2 className="size-5 mr-1" />Share
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddToWishlist(book._id || "")}
                                >
                                    <Heart
                                        className={`size-5 mr-1 ${wishlist.some((w) => w.products.includes(book._id || ""))
                                            ? "fill-red-500"
                                            : ""
                                            }`}
                                    />
                                    <span className="hidden md:inline cursor-pointer">
                                        {wishlist.some((w) => w.products.includes(book._id || ""))
                                            ? "Removed"
                                            : "Add"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.finalPrice}
                                </span>
                                {book.price && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.price}
                                    </span>
                                )}
                                <Badge variant="secondary" className="text-green-500 text-sm">
                                    Delivery Available
                                </Badge>
                            </div>
                            <Button
                                className="w-60 py-6 font-hanken-grotesk font-bold text-base group bg-gradient-to-r from-indigo-400 to-indigo-700 hover:from-indigo-700 hover:to-indigo-400 text-white"
                                onClick={handleAddToCart}
                                disabled={isAddToCart}
                            >
                                {isAddToCart ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Adding to Cart...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Buy Now
                                    </>
                                )}
                            </Button>
                            <Card className="border border-gray-200 shadow-sm bg-white text-black">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">
                                        Book Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="font-medium text-muted-foreground">
                                            Edition
                                        </div>
                                        <div>{book.edition || "N/A"}</div>
                                        <div className="font-medium text-muted-foreground">
                                            For class
                                        </div>
                                        <div>{book.classType || "General"}</div>
                                        <div className="font-medium text-muted-foreground">
                                            Book Type
                                        </div>
                                        <div>{book.category}</div>
                                        <div className="font-medium text-muted-foreground">
                                            Genre
                                        </div>
                                        <div>{book.genre}</div>
                                        <div className="font-medium text-muted-foreground">
                                            Writer
                                        </div>
                                        <div>{book.author}</div>
                                        <div className="font-medium text-muted-foreground">
                                            Book Condition
                                        </div>
                                        <div>{book.condition}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <Card className="border-none shadow-md bg-white text-black">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Description</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {('aboutAuthor' in book) && (
                                <div className="text-sm font-semibold text-black">
                                    {String((book as any).aboutAuthor)}
                                </div>
                            )}
                            <p className="text-sm font-medium text-muted-foreground whitespace-pre-wrap">
                                {book.description || "No description available"}
                            </p>
                            <div className="border-t-2 pt-4">
                                <h3 className="font-bold mb-2 text-md">Our Community</h3>
                                <p className="text-muted-foreground text-sm">
                                    Join our community of book lovers and share your thoughts on
                                    this book!
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div>Ad Id: {book._id}</div>
                                <div>Posted: {isMounted ? formatDate(book.createdAt) : '...'}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md h-[300px] bg-white text-black">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Sold By</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {book.seller ? (
                                <>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                                                {(book.seller as any)?.profilePicture ? (
                                                    <Image
                                                        src={(book.seller as any).profilePicture}
                                                        alt={book.seller?.name || "Seller"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User2 className="h-6 w-6 text-indigo-500" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">
                                                        {(book.seller as any)?.name || "Anonymous Seller"}
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-green-500 p-3 py-1 border-dashed rounded-full border-green-600 bg-green-100 whitespace-nowrap text-[10px]"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Verified
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    Dhaka, Bangladesh
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(book.seller as any)?.contact && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Smartphone className="h-4 w-4 mr-1 text-indigo-600" />
                                            <p className="text-sm">{(book.seller as any).contact}</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">
                                    Seller information unavailable
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MockBookDetailsPage;
