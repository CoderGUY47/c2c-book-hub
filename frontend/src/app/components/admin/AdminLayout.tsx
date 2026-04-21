import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, CreditCard, Home, LayoutDashboard, LogOut, Menu, Settings as SettingsIcon, ShoppingBag, Sidebar, User, X} from 'lucide-react';
import { useLogoutMutation } from '@/store/api';
import toast from 'react-hot-toast';
import { logout } from '@/store/slice/userSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import Image from 'next/image';
import { AvatarImage } from '@/components/ui/avatar';


interface AdminLayoutProps {
  children?: React.ReactNode;
}



const AdminLayout:React.FC<AdminLayoutProps> = ({children}) => {
    const user = useSelector((state:RootState)=>state.user.user)
    const [sidebarOpen,setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter()
    const dispatch = useDispatch()
    const [logoutMutation] = useLogoutMutation()
    const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("User logged out successfully");
    } 
    catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };
  const userPlaceholder = user?.name
  ?.split(" ")
  .map((name: string) => name[0])
  .join("");

  //for giving privacy in account section
  const handleProtectNavigation = (href: string) => {
    if (user) {
      router.push(href);
    } 
    else {
      router.push('/admin/login')
    }
  };


    const navigation =[
      {
        name: "Dashboard",
        onclick: () => router.push("/admin"),
        icon: LayoutDashboard,
        href:"/admin",
        bgColor : "from-purple-500 to-indigo-600",
        textColor : "text-white"
      },
      {
        name: "Orders",
        onclick: () => handleProtectNavigation("/admin/orders"),
        icon: ShoppingBag,
        href: "/admin/orders",
        bgColor : "from-indigo-500 to-blue-600",
        textColor : "text-white"
      },
      {
        name: "Payments",
        onclick: () => handleProtectNavigation("/admin/payments"),
        icon: CreditCard,
        href: "/admin/payments",
        bgColor : "from-red-600 to-pink-500",
        textColor : "text-white"
      },
    ]
  return (
  <div className="min-h-screen bg-[#050505] flex text-white text-opacity-90">

    {/* ── Mobile overlay ── */}
    <div className="lg:hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>

    {/* ── Sidebar ── */}
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 flex flex-col bg-[#0d0d0f] border-r border-white/[0.07]",
        "transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.07] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 mb-1">Admin panel</p>
          <div className="relative h-8 w-32 cursor-pointer" onClick={() => router.push('/')}>
            <Image 
              src="/images/oxpecker-bookhub.png" 
              alt="Logo" 
              fill 
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/30 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 px-3 mb-2">Menu</p>
        {navigation.map((item, i) => {
          const active = pathname === item.href;
          return (
            <button
              key={i}
              onClick={item.onclick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-violet-500/[0.15] border border-violet-400/20 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              )}
            >
              <span
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  active ? "bg-violet-400/20" : "bg-white/[0.05]"
                )}
              >
                <item.icon size={15} className={active ? "text-violet-300" : "text-white/40"} />
              </span>
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Back to Homepage */}
      <div className="px-2 pb-2">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-200"
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.05]">
            <Home size={15} className="text-white/40" />
          </span>
          Back to Homepage
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 pb-8 bg-gray-800/10 pt-4 border-t border-white/5">
        {/* Mobile Logout (Highly Visible) */}
        <Button
          variant="default"
          onClick={handleLogout}
          className="lg:hidden w-full flex items-center justify-center gap-3 h-12 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 border-0"
        >
          <LogOut size={16} className="text-rose-400" />
          Logout
        </Button>

        {/* Desktop Logout (Subtle/Refined) */}
        <Button
          variant="default"
          onClick={handleLogout}
          className="hidden lg:flex w-full items-center justify-start gap-4 px-4 py-6 rounded-2xl text-base font-semibold text-white bg-rose-500/20 border border-white/5 duration-500 transition-all"
        >
          <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5 border-0 group-hover:bg-rose-500 group-hover:text-rose-300">
            <LogOut size={16} className="text-white/60 group-hover:text-rose-300 transition-colors" />
          </span>
          Logout
        </Button>
      </div>
    </aside>

    {/* ── Main content ── */}
    <div className="lg:pl-56 flex flex-col flex-1 min-h-screen">

      {/* Topbar */}
      <header className="sticky top-0 z-40 h-[60px] bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-6 shadow-none">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <h2 className="text-[15px] font-medium text-white">
            {navigation.find((n) => n.href === pathname)?.name ?? "Admin"}
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.09] rounded-full pl-1 pr-3 py-1 focus:outline-none hover:bg-white/[0.07] transition-colors">
              <Avatar className="w-7 h-7 rounded-full overflow-hidden border border-white/20">
                {user?.profilePicture
                  ? <AvatarImage src={user.profilePicture} alt="User" />
                  : <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-500 text-[11px] font-medium text-white">{userPlaceholder ?? <User size={13} />}</AvatarFallback>
                }
              </Avatar>
              <span className="text-[12px] font-medium text-white/75">{user?.name ?? "Guest"}</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 mt-3 bg-[#111] border border-white/10 rounded-2xl shadow-2xl text-white p-1.5">
            <div className="px-3 py-2 mb-1">
              <p className="text-[10px] font-medium tracking-widest uppercase text-white/30">My Account</p>
            </div>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer group">
              <User size={14} className="text-white/40 group-hover:text-violet-400 transition-colors" />
              <span className="text-sm">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer group">
              <SettingsIcon size={14} className="text-white/40 group-hover:text-violet-400 transition-colors" />
              <span className="text-sm">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/')}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-violet-500/10 cursor-pointer group"
            >
              <Home size={14} className="text-white/40 group-hover:text-violet-400 transition-colors" />
              <span className="text-sm">Visit Homepage</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
            {user ? (
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 cursor-pointer text-rose-400 hover:text-rose-300 transition-all duration-200 group"
              >
                <LogOut size={14} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Logout</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => router.push('/admin/login')}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer group"
              >
                <User size={14} className="text-white/40 group-hover:text-violet-400" />
                <span className="text-sm">Login</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Page content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
);
  
}

export default AdminLayout
