"use client"
import { useLogoutMutation } from '@/store/api';
import { logout, toggleLoginDialog } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { BookOpen, Heart, LogOut, Package, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import NoData from '../components/NoData';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    title: "My Profile",
    href: "/account/profile",
    icon: User,
    color: "bg-black/80 text-white"
  },
  {
    title: "My Orders",
    href: "/account/orders",
    icon: Package,
    color: "bg-black/80 text-white"
  },
  {
    title: "Selling Products",
    href: "/account/selling-products",
    icon: BookOpen,
    color: "bg-black/80 text-white"
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
    color: "bg-black/80 text-white"
  },
]

const layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();
  const userPlaceholder = user?.name?.split(" ")?.map((name: string) => name[0])?.join("");
  const router = useRouter();


  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("User logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.log(error);
    }
  };


  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }


  return (
    <div className="relative min-h-screen container mx-auto overflow-hidden bg-gradient-to-tl from-gray-950 to-gray-900">
      {/* Background decorative elements - Dark theme */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className='relative z-10 w-[83.5%] grid lg:grid-cols-[370px_1fr] p-4 mx-auto'>
        <div className="p-2 m-5 h-[480px] rounded-lg hidden bg-gradient-to-tl from-gray-800/80 via-white/10 to-gray-800/60 shadow-xl border-0 lg:block">
          <div className="flex flex-col gap-2">
            <div className="flex h-60px items-center px-6 mt-2 -mb-4">
              <Link href="/"
                className='flex items-center gap-2 font-bold font-poppins text-white'
              >
                <span className='text-3xl font-extrabold drop-shadow-[0_0_10px_rgogba(255,255,255,0.2)] text-white'>Your Account</span>
              </Link>
            </div>
            <div className="flex-1 space-y-4 py-4">
              <div className="px-6 py-2">
                <div className="flex items-center gap-4 bg-slate-800/50 hover:bg-violet-600/50 transition-all py-4 px-4 rounded-xl border-0 shadow-xl">
                  <Avatar className="w-12 h-12 -ml-2 rounded-full">
                    {user?.profilePicture ? (
                      <AvatarImage
                        src={user?.profilePicture}
                        alt="user_image"
                      ></AvatarImage>
                    ) : (
                      <AvatarFallback className="bg-gray-300 border-transparent">
                        {userPlaceholder}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-bold text-white text-lg">{user.name}</p>
                    <p className="font-medium text-sm text-white">{user.email}</p>
                  </div>
                </div>
              </div>

              <Separator className='bg-gray-700 py-[.9px] rounded-sm' />
              <div className="space-y-1 px-2">
                <nav className='grid items-start px-2 py-2 text-sm font-medium'>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 font-bold px-3 py-3 mb-2 rounded-lg transition-all ${isActive ? `bg-gradient-to-tl ${item.color} text-gray-800` : "text-gray-800 hover:bg-violet-600 hover:text-white"}`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                        <span className='text-white'>{item.title}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
            <div className="-mt-12 flex px-5 py-4">
              <Button variant='default' className='w-full justify-start bg-transparent gap-2 font-semibold text-md hover:bg-violet-600 hover:text-white transition-all duration-300 ease-in-out' onClick={handleLogout}>
                <LogOut className="h-8 w-8" />Logout
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className='flex flex-1 flex-col gap-4 p-3 md:gap-4 md:p-4'>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default layout