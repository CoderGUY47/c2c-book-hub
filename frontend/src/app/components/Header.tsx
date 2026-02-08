"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Lock,
  Package,
  ShoppingCart,
  Search,
  Heart,
  User,
  User2,
  LogOut,
  ChevronRight,
  FileTerminal,
  HelpCircle,
  BookLock,
  Menu,
  BookOpen, // Added import
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { RiEBike2Fill } from "react-icons/ri";
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
  const user = useSelector((state: RootState) => state.user.user); //getting user data from redux and ipaste it from the AuthProvider
  const [logoutMutation] = useLogoutMutation();
  const userPlaceholder = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");
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

  // Debug: Check what user data we're receiving
  console.log("User data:", user);
  console.log("Profile picture:", user?.profilePicture);

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData?.data));
    }
  }, [cartData, dispatch]);

  //for giving privacy in account section
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

  const menuItems = [
    ...(user && user
      ? [
        //if user loged in, show this content
        {
          href: "/account/profile",
          className: "hover:bg-white/10 backdrop-blur-md shadow-md",
          content: (
            <div className="flex gap-x-4 items-center p-0 pb-3 border-b">
              <Avatar className="w-12 h-12 -ml-2 rounded-full overflow-hidden relative">
                {user?.profilePicture ? (
                  <Image
                    src={getOptimizedUrl(user.profilePicture, 48, 48)}
                    alt="user_image"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-gray-300 border-transparent">
                    {userPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-md text-white">{user.name}</span>
                <span className="text-xs text-white">{user.email}</span>
              </div>
            </div>
          ),
        },
      ]
      : [
        {
          icon: <Lock className="h-5 w-5" />,
          lable: "Login /Signup",
          onclick: handleLoginClick,
          className: "hover:bg-indigo-500/95",
        },
      ]),
    {
      icon: <User className="h-5 w-5" />,
      lable: "Profile",
      onclick: () => handleProtectNavigation("/account/profile"),
      href: user ? "/account/profile" : undefined,
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <Package className="h-5 w-5" />,
      lable: "My Orders",
      onclick: () => handleProtectNavigation("/account/orders"),
      href: user ? "/account/orders" : undefined,
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <SlBag className="h-5 w-5" />,
      lable: "Selling Products",
      onclick: () => handleProtectNavigation("/account/selling-products"),
      href: user ? "/account/selling-products" : undefined,
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      lable: "Carts",
      onclick: () => handleProtectNavigation("/checkout/cart"),
      href: user ? "/checkout/cart" : undefined,
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      lable: "Wishlist",
      onclick: () => handleProtectNavigation("/account/wishlist"),
      href: user ? "/account/wishlist" : undefined,
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <User2 className="h-5 w-5" />,
      lable: "About us",
      href: "/about-us",
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      lable: "Terms & Conditions",
      href: "/terms-of-use",
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      lable: "Privacy & Policy",
      href: "/privacy-policy",
      className: "hover:bg-indigo-500/95",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      lable: "Helps",
      href: "/how-it-works",
      className: "hover:bg-indigo-500/95",
    },
    ...(user && user
      ? [
        {
          icon: <LogOut className="h-5 w-5" />,
          lable: "Logout",
          onclick: handleLogout,
          className: "hover:bg-indigo-500/95",
        },
      ]
      : []),
  ];

  const MenuItems = ({ className = "" }) => (
    <div className={className}>
      {menuItems?.map((item: any, index: number) =>
        item?.href ? (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-x-3 px-4 py-2 text-sm rounded-md transition-colors ${item.className || "hover:bg-gray-200"}`}
            onClick={() => setIsDropdownOpen(false)}
          >
            {item.icon}
            <span>{item?.lable}</span>
            {item?.content && <div className="mt-1">{item?.content}</div>}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Link>
        ) : (
          <button
            key={index}
            className={`flex w-full items-center font-poppins font-black gap-x-3 px-4 py-2 text-sm rounded-md transition-colors ${item.className || "hover:bg-gray-200"}`}
            onClick={item.onclick}
          >
            {item.icon}
            <span>{item?.lable}</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        )
      )}
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-md ${isScrolled
        ? "bg-gray-950/10 border-b border-white/5 shadow-2xl"
        : "bg-gray-950 border-b border-transparent shadow-none"
        }`}
    >
      <div className="container w-[80%] mx-auto hidden lg:flex items-center justify-between p-5 py-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/oxpecker-bookhub.png"
            width={200}
            height={100}
            alt="desktop-logo"
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex flex-1 items-center justify-center max-w-xl px-10">
          <div className="relative w-full group">
            <Input
              type="text"
              placeholder="Search by Title, Author, or Genre..."
              className="w-full h-12 pl-5 pr-12 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-2xl font-normal"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              size="icon"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-indigo-950/30 text-white shadow-md"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-x-4 mr-0">
          <Link href="/books">
            <button className="retro-button">
              <div>
                <div>
                  <div>
                    <BookOpen className="w-5 h-5" />
                    <span className="text-md font-bold font-hanken-grotesk">
                      Explore
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </Link>
          <Link href="/book-sell">
            <Button className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none relative z-10 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#e8e8e8] px-[15px] py-[15px] text-[16px] font-bold text-[#212121] shadow-md transition-all duration-500 hover:text-[#e8e8e8] before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-0 before:rounded-[15px] before:bg-[#212121] before:transition-all before:duration-250 before:content-[''] hover:before:w-full">
              <MdSell className="w-5 h-5" />
              Sell Books
            </Button>
          </Link>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none relative z-10 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-[15px] py-[15px] text-[16px] font-bold text-[#212121] shadow-md transition-all duration-500 hover:text-white before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-0 before:rounded-[15px] before:bg-[#212121] before:transition-all before:duration-500 before:content-[''] hover:before:w-full">
                <Avatar className="w-7 h-7 rounded-full font-black -mr-0 overflow-hidden relative">
                  {user?.profilePicture ? (
                    <Image
                      src={getOptimizedUrl(user.profilePicture, 30, 30)}
                      alt="user_image"
                      fill
                      className="object-cover"
                    />
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-transparent">
                      <User className="h-5 w-5 -ml-3" />
                    </AvatarFallback>
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-2 mt-6 bg-gray-900/5 backdrop-blur-xl border-[1.25px] border-white/35 shadow-[0_3px_24px_4px_rgba(134,90,196,0.2)] rounded-xl text-white">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/checkout/cart">
            <div className="relative -mr-7">
              <Button
                variant="default"
                className="relative text-base font-bold bg-transparent text-white hover:text-white hover:bg-transparent cursor-pointer"
              >
                Cart
                <MdOutlineShoppingCart className="h-8 w-8 mr-3 text-white" />
              </Button>
              <span
                className="absolute top-2 left-16 bg-red-500 font-semibold text-white text-[12px] rounded-full
                  w-4 h-4 flex items-center justify-center transform -translate-x-1/3 -translate-y-1/2"
              >
                {cartItemCount}
              </span>
            </div>
          </Link>
        </div>
      </div>
      {/* mobile header*/}

      <div className="container mx-auto flex lg:hidden items-center justify-between p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <div className="border-b p-4">
              <Link href="/" className="ml-[30px]">
                <Image
                  src="/images/oxpecker-book-logo-v2.png"
                  width={150}
                  height={40}
                  alt="mobile-logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <MenuItems className="py-2" />
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center ml-[30px]">
          <Image
            src="/images/oxpecker-book-logo-v2.png"
            width={450}
            height={100}
            alt="desktop-logo"
            className="h-8 md:h-10 w-24 md:w-auto"
          />
        </Link>
        <div className="flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search Books..."
              className="w-full pr-[50px]"
              onChange={(e) => setSearchTerms(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Link href="/checkout/cart">
          <div className="relative">
            <Button variant="ghost" className="relative">
              <MdOutlineShoppingCart className="h-5 w-5 mr-3 mt-1" />
            </Button>
            {user && cartItemCount > 0 && (
              <span
                className="absolute top-2 left-7 bg-red-500 text-white text-[10px] font-semibold rounded-full
                w-5 h-5 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
              >
                {cartItemCount}
              </span>
            )}
          </div>
        </Link>
      </div>
      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
    </header>
  );
};

export default Header;
