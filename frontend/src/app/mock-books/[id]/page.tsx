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

const MockBookDetailsPage = () => {
    const params = useParams();
    const idOrSlug = params.id as string;
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddToCart, setIsAddToCart] = useState(false);

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
        <div className="min-h-screen bg-gray-100">
            <div className="container w-[80%] mx-auto px-9 py-8">
                <nav className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:underline font-bold text-primary">
                        Home
                    </Link>
                    <span>/</span>
                    <Link
                        href="/mock-books"
                        className="hover:underline font-medium text-primary"
                    >
                        Mock Books
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600 font-medium">{book.category}</span>
                    <span>/</span>
                    <span className="text-gray-600 truncate max-w-[200px]">{book.title}</span>
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
                      text-xs font-bold font-hanken-grotesk text-white
                      rounded-md
                      transition-transform duration-200 hover:scale-110
                      cursor-pointer"
                                >
                                    {calculateDiscount(book.price, book.finalPrice)}%Off
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {bookImage.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border 
                    transition-all duration-300 ${selectedImage === index
                                            ? "ring-2 ring-blue-500 scale-105"
                                            : "hover:scale-105 border-gray-200"
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

                    {/** Book Details Section */}
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{book.title}</h1>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Released {formatDate(book.createdAt)} • <span className="text-indigo-600">Curated Select</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <ShareButton
                                    url={typeof window !== "undefined" ? window.location.href : ""}
                                    title={`Check out this curated book: ${book.title}`}
                                    text={`I found this amazing classic on Book Shop: ${book.title}`}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg shadow-sm"
                                    onClick={() => handleAddToWishlist(book._id)}
                                >
                                    <Heart
                                        className={`size-5 mr-1 ${wishlist.some((w) => w.products.includes(book._id))
                                            ? "fill-red-500 text-red-500 border-red-500"
                                            : "text-gray-400"
                                            }`}
                                    />
                                    <span className="hidden md:inline cursor-pointer font-bold">
                                        {wishlist.some((w) => w.products.includes(book._id))
                                            ? "Saved"
                                            : "Save"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-gray-900 tracking-tight">
                                    <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.finalPrice}
                                </span>
                                {book.price && (
                                    <span className="text-xl text-muted-foreground line-through font-medium">
                                        <i className="fa-solid fa-bangladeshi-taka-sign"></i>{book.price}
                                    </span>
                                )}
                                <Badge variant="secondary" className="bg-green-100 text-green-700 font-bold border-green-200 px-3 py-1 ml-2">
                                    Stock Available
                                </Badge>
                            </div>

                            <Button
                                className="w-full md:w-64 py-7 rounded-2xl font-black text-lg group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                onClick={handleAddToCart}
                                disabled={isAddToCart}
                            >
                                {isAddToCart ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-3 h-6 w-6" />
                                        Buy Now
                                    </>
                                )}
                            </Button>

                            <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                                    <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-widest">
                                        Specifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Edition</span>
                                            <span className="font-bold text-gray-800">{book.edition || "1st Edition"}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Class</span>
                                            <span className="font-bold text-gray-800">{book.classType || "General"}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Genre</span>
                                            <span className="font-bold text-gray-800">{book.genre}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Author</span>
                                            <span className="font-bold text-indigo-600">{book.author}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Condition</span>
                                            <Badge variant="outline" className="w-fit border-indigo-200 text-indigo-600 font-black text-[10px] uppercase">{book.condition}</Badge>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Subject</span>
                                            <span className="font-bold text-gray-800">{book.subject || "N/A"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    <Card className="border-none shadow-md rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="px-8 pt-8">
                            <CardTitle className="text-2xl font-black text-gray-900 uppercase">Description</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-6">
                            <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                                {book.description || "A masterfully curated selection from our community of book enthusiasts. This volume has been meticulously inspected for quality and impact."}
                            </p>
                            <div className="border-t border-dashed border-gray-200 pt-6">
                                <h3 className="font-black text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                    The Collection
                                </h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                    Join our community of book lovers discovering timeless classics and modern masterpieces. This book is part of our "Curated Picks" series.
                                </p>
                            </div>
                            <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4">
                                <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> MOCK ID: {book._id}</div>
                                <div className="flex items-center gap-1.5"><ShoppingCart className="w-3 h-3" /> REGISTERED: {formatDate(book.createdAt)}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* book seller details */}
                    <Card className="border-none shadow-md rounded-[2.5rem] overflow-hidden min-h-[350px]">
                        <CardHeader className="px-8 pt-8">
                            <CardTitle className="text-2xl font-black text-gray-900 uppercase">Curator Info</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-8">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-3xl bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden relative border-2 border-white shadow-lg">
                                        <User2 className="h-8 w-8 text-indigo-500" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-xl text-gray-900">
                                                {book.seller?.name || "Community Curator"}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full text-[10px] font-black uppercase"
                                            >
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                                            <MapPin className="h-4 w-4 text-indigo-400" />
                                            Dhaka, Bangladesh (Community)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 pt-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Smartphone className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect</span>
                                        <span className="font-bold text-gray-700">{book.seller?.contact || "+880 1XXX-XXXXXX"}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Score</span>
                                        <span className="font-bold text-gray-700 uppercase tracking-tighter">Gold Member</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Working Proccess */}
                <section className="mt-24 mb-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                            How It <span className="text-indigo-600">Works</span>
                        </h2>
                        <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-4 rounded-full" />
                        <p className="text-gray-500 mt-6 font-bold max-w-lg mx-auto leading-relaxed">
                            Simple, secure steps to add these curated classics to your library.
                        </p>
                    </div>
                    <div className="grid gap-10 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Select & Cart",
                                description: "Choose your favorite mock classic and add it to your secure digital cart.",
                                image: { src: "/icons/ads.png", alt: "Select" },
                                color: "from-indigo-400 to-indigo-600",
                            },
                            {
                                step: "02",
                                title: "Mock Checkout",
                                description: "Experience our premium SSLCommerz flow with mock transaction details.",
                                image: { src: "/icons/pay_online.png", alt: "Checkout" },
                                color: "from-purple-500 to-purple-700",
                            },
                            {
                                step: "03",
                                title: "Curated Delivery",
                                description: "We handle the logistics to bring the book right to your doorstep.",
                                image: { src: "/icons/fast-delivery.png", alt: "Delivery" },
                                color: "from-blue-500 to-blue-700",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-[3rem] p-10 pt-16 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-gray-100"
                            >
                                <div className="absolute -top-8 left-10">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                                        {item.step}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-28 flex items-center justify-start">
                                        <Image
                                            src={item.image.src}
                                            alt={item.image.alt}
                                            width={100}
                                            height={100}
                                            className="object-contain transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MockBookDetailsPage;
