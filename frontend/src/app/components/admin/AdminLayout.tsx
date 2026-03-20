import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter, usePathname } from 'next/navigation';
import { CreditCard, LayoutDashboard, Menu, ShoppingBag, Sidebar, User, X} from 'lucide-react';
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
    <div className='min-h-screen bg-gray-100'>
      {/* mobile sidebar     */}
      <div className='lg:hidden'>
        <Button variant='ghost' size='icon' className='fixed top-4 left-4 z-50 text-gray-800'
        onClick={()=> setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50"
          onClick={()=> setSidebarOpen(false)}
          ></div>
        )}

        <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-16 items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-indigo-600 border-b border-gray-200">
            <h1 className="text-2xl font-bold">BookShop Admin</h1>
          </div>

          <nav className="h-full overflow-y-auto bg-white shadow-lg">
            <div className="mt-5 px-2 space-y-1">
              {navigation.map((item)=>(
                <Button className={cn("w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href ? `bg-gradient-to-r ${item.bgColor} text-white` : `text-gray-700 hover:bg-gray-100 hover:${item.textColor}`
                )}
                onClick={item.onclick}
                >
                  <item.icon 
                    className={cn("mr-3 h-6 w-6", 
                    pathname === item.href ? "text-white" : `text-gray-500 group-hover:${item.textColor}`)}
                  />
                  {item.name}
                </Button>
              ))}
            </div>

            <div className="absolute bottom-0 w-full p-4 border-t-2">
              <Button
              variant='ghost'
              size='lg'
              className='w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-600'
              onClick={handleLogout}
              >
                <Sidebar className='mr-3 h-6 w-6'/>
                Logout
              </Button>
            </div>
          </nav>
        </aside>
      </div>



       {/* Desktop sidebar */}
        <div className='hidden lg:fixed lg:flex lg:flex-col lg:w-64 lg:inset-y-0 lg:bg-white lg:shadow-lg'>
          <div className="flex flex-col flex-grow overflow-y-auto" >
            <div className="flex h-16 items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-indigo-600 border-b border-gray-200">
              <h1 className="text-2xl font-bold">BookShop Admin</h1>
            </div>

          <nav className="flex-1 bg-white shadow-lg">
            <div className="mt-5 px-2 space-y-1">
              {navigation.map((item)=>(
                <button className={cn("w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href ? `bg-gradient-to-r ${item.bgColor} text-white` : `text-gray-700 hover:bg-gray-100 hover:${item.textColor}`
                )}
                onClick={item.onclick}
                >
                  <item.icon 
                    className={cn("mr-3 h-6 w-6", 
                    pathname === item.href ? "text-white" : `text-gray-500 group-hover:${item.textColor}`)}
                  />
                  {item.name}
                </button>
              ))}
            </div>

            <div className="p-4 mt-auto border-t-2">
              <Button
              variant='ghost'
              size='lg'
              className='w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-600'
              onClick={handleLogout}
              >
                <Sidebar className='mr-3 h-6 w-6'/>
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </div>


      {/* Main content */}
      <div className='lg:pl-64 flex flex-col flex-1'>
        <header className='bg-white shadow-sm z-10'>
          <div className='flex items-center justify-between px-4 h-16 sm:px-6 lg:px-8'>
            <h1 className='text-xl font-semibold ml-10 text-gray-800'>
              {navigation.find((item)=>item.href === pathname)?.name || "Admin"} 
            </h1>
            <div className="flex-end items-center space-x-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none relative z-10 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-[15px] py-[15px] text-[16px] font-bold text-[#212121] shadow-md transition-all duration-500 hover:text-white before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-0 before:rounded-[15px] before:bg-[#212121] before:transition-all before:duration-500 before:content-[''] hover:before:w-full">
                              <Avatar className="w-7 h-7 rounded-full font-black -mr-0 overflow-hidden relative">
                                {user?.profilePicture ? (
                                  <AvatarImage src={user.profilePicture} alt="User"/>
                                ) : userPlaceholder ? (
                                  <AvatarFallback>{userPlaceholder}</AvatarFallback>
                                ) : (
                                  <AvatarFallback className="bg-transparent">
                                    <User className="h-5 w-5 -ml-3" />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              {user ? (
                                <div className="hidden md:block text-left">
                                  <p className="font-medium text-md text-gray-800">{user?.name}</p>
                                  <p className="text-xs text-gray-800">{user?.email}</p>
                                </div>
                              ) : (
                                <p className="font-medium text-md text-gray-800">My Account</p>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-80 p-2 mt-6 bg-gray-900/5 backdrop-blur-xl border-[1.25px] border-white/35 shadow-[0_3px_24px_4px_rgba(134,90,196,0.2)] rounded-xl text-gray-800">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                              <DropdownMenuSeparator>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                              </DropdownMenuSeparator>
                              {user ? (
                                <DropdownMenuItem className='text-red-500' onClick={handleLogout}>Logout</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className='text-red-500' onClick={()=>router.push('/admin/login')}>Login</DropdownMenuItem>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex pb-8">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
