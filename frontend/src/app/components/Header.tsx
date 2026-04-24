"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Lock, Package, ShoppingCart, Search, Heart, User, User2, LogOut, ChevronRight,
  FileTerminal, HelpCircle, BookLock, Menu, BookOpen,
  ShoppingBag, 
} from "lucide-react";

import { SlBag } from "react-icons/sl";
import { MdOutlineShoppingCart } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdSell } from "react-icons/md";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import AuthPage from "./AuthPage";
import { setCart } from "@/store/slice/cartSlice";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";

const getOptimizedUrl = (url: string, width = 40, height = 40) => {
  if (!url) return "";
  if (url.includes("res.cloudinary.com")) {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},h_${height},c_fill,q_auto,f_auto/${parts[1]}`;
    }
  }
  return url;
};

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );
  const user = useSelector((state: RootState) => state.user.user); 
  const [logoutMutation] = useLogoutMutation();
  const cartItemCount = useSelector(
    (state: RootState) => state.cart.items.length
  );
  const { data: cartData } = useGetCartQuery(user?._id, { skip: !user });
  const [searchTerms, setSearchTerms] = useState("");

  const handleSearch = () => {
    if (searchTerms.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchTerms)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData?.data));
    }
  }, [cartData, dispatch]);

  const handleProtectNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("User logged out successfully");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };
  const userPlaceholder = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");

  const menuItems = [
    ...(user && user
      ? [
        {
          href: "/account/profile",
          className: "hover:bg-white/10 backdrop-blur-md shadow-md",
          content: (
            <div className="flex gap-x-4 items-center p-0 pb-3 border-b border-white/10">
              <Avatar className="w-12 h-12 -ml-2 rounded-full overflow-hidden relative">
                <AvatarImage 
                    src={getOptimizedUrl(user?.profilePicture || user?.image, 48, 48)} 
                    className="object-cover"
                />
                <AvatarFallback className="bg-gray-700 text-white font-normal text-lg uppercase">
                    {userPlaceholder}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-md text-white tracking-wide">{user.name || "Guest User"}</span>
                <span className="text-xs text-white/60">{user.email || "No email found"}</span>
              </div>
            </div>
          ),
        },
      ]
      : [
        {
          icon: <Lock className="h-4 w-4" />,
          lable: "Sign In / Join",
          onclick: handleLoginClick,
          className: "hover:bg-indigo-600/20 text-white border border-indigo-500/20",
        },
      ]),
    {
      icon: <User className="h-4 w-4 text-indigo-400" />,
      lable: "My Profile",
      onclick: () => handleProtectNavigation("/account/profile"),
      href: user ? "/account/profile" : undefined,
    },
    {
      icon: <Package className="h-4 w-4 text-orange-400" />,
      lable: "My Orders",
      onclick: () => handleProtectNavigation("/account/orders"),
      href: user ? "/account/orders" : undefined,
    },
    {
      icon: <SlBag className="h-4 w-4 text-emerald-400" />,
      lable: "Selling Products",
      onclick: () => handleProtectNavigation("/account/selling-products"),
      href: user ? "/account/selling-products" : undefined,
    },
    {
      icon: <ShoppingCart className="h-4 w-4 text-sky-400" />,
      lable: "Carts",
      onclick: () => handleProtectNavigation("/checkout/cart"),
      href: user ? "/checkout/cart" : undefined,
    },
    {
      icon: <Heart className="h-4 w-4 text-rose-400" />,
      lable: "Wishlist",
      onclick: () => handleProtectNavigation("/account/wishlist"),
      href: user ? "/account/wishlist" : undefined,
    },
    {
      icon: <User2 className="h-4 w-4 text-white/40" />,
      lable: "About us",
      href: "/about-us",
    },
    {
      icon: <FileTerminal className="h-4 w-4 text-white/40" />,
      lable: "Terms & Conditions",
      href: "/terms-of-use",
    },
    {
      icon: <BookLock className="h-4 w-4 text-white/40" />,
      lable: "Privacy & Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className="h-4 w-4 text-white/40" />,
      lable: "Helps",
      href: "/how-it-works",
    },
    ...(user?.role === "admin"
      ? [
        {
          icon: <Lock className="h-4 w-4 text-emerald-400" />,
          lable: "Admin Dashboard",
          href: "/admin",
          className: "mt-2 pt-2 border-t border-white/5 hover:bg-emerald-500/10 text-emerald-400/90",
        },
      ]
      : []),
    ...(user
      ? [
        {
          icon: <LogOut className="h-4 w-4 text-red-400/80" />,
          lable: "Logout Session",
          onclick: handleLogout,
          className: "mt-2 pt-2 border-t border-white/5 hover:bg-red-500/10 text-red-400/90",
        },
      ]
      : []),
  ];

  const MenuItems = ({ className = "", isMobile = false }) => (
    <div className={className}>
      {menuItems?.map((item: any, index: number) => {
        const itemContent = (
            <div className="flex items-center gap-x-3 w-full group">
                <div className="flex items-center justify-center">
                    {item.icon}
                </div>
                <span className="font-medium text-sm text-white/70 group-hover:text-white transition-colors">
                    {item?.lable}
                </span>
                {item?.content && <div className="w-full">{item?.content}</div>}
                {!item?.content && <ChevronRight className="w-4 h-4 ml-auto text-white/20 group-hover:text-white/40 transition-all" />}
            </div>
        );

        if (isMobile) {
            return item?.href ? (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${item.className || "hover:bg-white/5"}`}
              >
                {itemContent}
              </Link>
            ) : (
              <button
                key={index}
                className={`flex w-full items-center px-4 py-2 rounded-xl transition-all duration-300 ${item.className || "hover:bg-white/5"}`}
                onClick={item.onclick}
              >
                {itemContent}
              </button>
            );
        }

        return (
            <DropdownMenuItem key={index} asChild>
                {item?.href ? (
                    <Link
                        href={item.href}
                        className={`flex items-center w-full px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${item.className || "hover:bg-white/5"} focus:bg-white/10 outline-none active:scale-[0.98]`}
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        {itemContent}
                    </Link>
                ) : (
                    <button
                        className={`flex w-full items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${item.className || "hover:bg-white/5"} focus:bg-white/10 outline-none active:scale-[0.98]`}
                        onClick={item.onclick}
                    >
                        {itemContent}
                    </button>
                )}
            </DropdownMenuItem>
        );
      })}
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 py-4 ${
        isScrolled 
        ? "bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
        : "bg-black/95 border-b border-transparent"
      }`}
    >
      <div className="container w-[94%] lg:w-[88%] mx-auto flex items-center justify-between px-4">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/oxpecker-bookhub.png"
              width={160}
              height={50}
              alt="brand-logo"
              className="h-8 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </Link>
          <div className="hidden lg:flex space-x-8 text-xs font-poppins font-semibold tracking-[0.1em] uppercase text-white/50">
            <Link href="/books" className="text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-indigo-500 after:scale-x-100 transition-all">Explore Books</Link>
            <Link href="/book-sell" className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 inline-block">Sell Books</Link>
            <Link href="/blog" className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 inline-block">Blog</Link>
            <Link href="/about-us" className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 inline-block">About Us</Link>
          </div>
        </div>

        {/* Search, Auth & Cart */}
        <div className="flex items-center space-x-6 text-white">
          {/* New Search Input Style (Desktop) */}
          <div className="relative hidden md:flex items-center group">
            <div className={`flex items-center bg-white/[0.03] border-2 border-white/60 rounded-full px-4 h-9 transition-all duration-500 focus-within:bg-white/[0.08] focus-within:border-indigo-500/30 focus-within:w-64 w-48 group-hover:border-white/20 shadow-inner`}>
                <Search className="w-3.5 h-3.5 text-white mr-2 group-focus-within:text-indigo-400 transition-colors" />
                <input
                type="text"
                placeholder="Search lLbrary..."
                className="bg-transparent outline-none w-full text-xs placeholder:text-white/30 text-white font-semibold font-poppins tracking-wide"
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
                onKeyDown={handleKeyDown}
                />
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-2">
            {/* User Dropdown */}
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center group focus:outline-none transition-all duration-300 active:scale-95">
                  <Avatar className="w-8 h-8 rounded-full overflow-hidden relative border border-white/10 group-hover:border-white/30 transition-all shadow-xl scale-100 group-hover:scale-110">
                    <AvatarImage 
                        src={getOptimizedUrl(user?.profilePicture || user?.image, 32, 32)} 
                        className="object-cover" 
                    />
                    <AvatarFallback className="text-[10px] font-normal bg-violet-700/80 text-white uppercase tracking-tighter">
                        {userPlaceholder || <User className="h-3.5 w-3.5 text-white/60" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2.5 hidden lg:inline text-[11px] font-semibold font-poppins uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-all">
                    {user ? "Account" : "Sign In"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-1.5 mt-4 bg-black/95 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-2xl text-white backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300 ring-1 ring-white/5">
                <MenuItems />
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-white/5 hidden md:block h-4 w-[1.5px] bg-white/60"></span>

            {/* Cart Button */}
            <Link href="/checkout/cart" className="relative group p-2 rounded-full bg-white/20 hover:bg-white/15 transition-all duration-300 hover:rotate-6">
              <ShoppingBag className="w-4.5 h-4.5 text-white/70 group-hover:text-white transition-all duration-500" />
              {cartItemCount > 0 && (
                <span className="absolute top-0.5 right-1 bg-violet-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border-0 shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-full hover:bg-white/5 transition-colors active:scale-90">
                  <Menu className="h-5 w-5 text-white/60 hover:text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-black border-r border-white/5 text-white backdrop-blur-2xl">
                <SheetHeader className="border-b border-white/10 p-6 bg-white/[0.01]">
                  <SheetTitle className="text-xl font-normal text-left text-white tracking-[0.2em] uppercase opacity-80">Book-Shop</SheetTitle>
                </SheetHeader>
                <div className="p-4 overflow-y-auto">
                  {user && (
                    <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-11 h-11 rounded-full ring-1 ring-white/10">
                                <AvatarImage src={getOptimizedUrl(user?.profilePicture || user?.image, 44, 44)} />
                                <AvatarFallback className="bg-indigo-600 font-normal">{userPlaceholder}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <h3 className="font-medium text-sm text-white truncate tracking-tight">{user?.name}</h3>
                                <p className="text-[10px] text-white/30 font-normal uppercase tracking-widest mt-0.5">Verified Account</p>
                            </div>
                        </div>
                    </div>
                  )}
                  <div className="text-[9px] font-normal uppercase tracking-[0.3em] text-white/20 mb-4 px-3 flex items-center">
                      <span className="flex-1 h-[1px] bg-white/5 mr-3"></span>
                      Navigation
                      <span className="flex-1 h-[1px] bg-white/5 ml-3"></span>
                  </div>
                  <MenuItems isMobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
    </header>
  );
};

export default Header;
