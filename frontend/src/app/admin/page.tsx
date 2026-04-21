"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import { useGetDashboardStatsQuery } from '@/store/adminApi'
import BookLoader from '@/lib/BookLoader'
import { color } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Currency, ShoppingCart, TrendingDown, TrendingUp, Users, X } from 'lucide-react'
import { GrStakeholder } from 'react-icons/gr'
import { BiMoney } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Pagination from '../components/Pagination'

import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const page = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  const { data: realData, isLoading, isError } = useGetDashboardStatsQuery({});
  const realStats = realData?.data;

  const [dummyStats, setDummyStats] = useState<any>(null);

  useEffect(() => {
    fetch('/dashboardStats.json')
      .then((res) => res.json())
      .then((d) => setDummyStats(d.data))
      .catch((err) => console.error("Error fetching dummy stats", err));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const stats = {
    counts: {
      orders: (realStats?.counts?.orders || 0) + (dummyStats?.counts?.orders || 0),
      users: (realStats?.counts?.users || 0) + (dummyStats?.counts?.users || 0),
      products: (realStats?.counts?.products || 0) + (dummyStats?.counts?.products || 0),
      revenue: (realStats?.counts?.revenue || 0) + (dummyStats?.counts?.revenue || 0),
    },
    ordersByStatus: {
      pending: (realStats?.ordersByStatus?.pending || 0) + (dummyStats?.ordersByStatus?.pending || 0),
      processing: (realStats?.ordersByStatus?.processing || 0) + (dummyStats?.ordersByStatus?.processing || 0),
      shipped: (realStats?.ordersByStatus?.shipped || 0) + (dummyStats?.ordersByStatus?.shipped || 0),
      delivered: (realStats?.ordersByStatus?.delivered || 0) + (dummyStats?.ordersByStatus?.delivered || 0),
      cancelled: (realStats?.ordersByStatus?.cancelled || 0) + (dummyStats?.ordersByStatus?.cancelled || 0),
    },
    monthlySales: [...(realStats?.monthlySales || []), ...(dummyStats?.monthlySales || [])],
    recentOrders: [...(realStats?.recentOrders || []), ...(dummyStats?.recentOrders || [])],
  };

  const totalPages = Math.ceil((stats.recentOrders?.length || 0) / itemsPerPage);

  const currentRecentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return stats.recentOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [stats.recentOrders, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  useEffect(() => {
    // You cannot `router.push("/admin")` while you are ALREADY on the `/admin` page!
    // That creates an infinite loop that crashes the page. 
    // If you want to bypass the security check, just leave this empty:
    
    // if (user && user.role !== "admin") {
    //   router.push("/");
    // }
     
  }, [user, router]);

  if(isLoading){
    return( 
    <AdminLayout>
      <div className="flex items-center justify-center h-96">
        <BookLoader/> 
      </div>
    </AdminLayout>
    ) 
  }

  if(isError){
    return( 
    <AdminLayout>
      <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 mb-6">
          <X className="h-12 w-12 text-red-500" />
        </div>
        <h2 className='text-3xl font-black text-white tracking-tight'>Failed to load dashboard</h2>
        <p className='text-gray-400 mt-2 max-w-md'>We couldn't retrieve the latest statistics. Please check your connection or try again later.</p>
        <Button onClick={() => window.location.reload()} className="mt-8 bg-white text-black hover:bg-gray-200 rounded-full px-8">Retry</Button>
      </div>
    </AdminLayout>
    ) 
  }

  //prepare data for charts
  const orderStatsData = stats ? [
    {
      name:"Processing",
      value: stats.ordersByStatus?.processing,
      color:"#FF6B6B"
    },
    {
      name:"Shipped",
      value: stats.ordersByStatus?.shipped,
      color:"#FFD93D"
    },
    {
      name:"Delivered",
      value: stats.ordersByStatus?.delivered,
      color:"#6BCB77"
    },
    {
      name:"Cancelled",
      value: stats.ordersByStatus?.cancelled,
      color:"#FF6B6B"
    }
  ] : [];

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const salesData = stats?.monthlySales?.map((item: any) => ({
    name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    sales: item.totalSales,
    orders: item.orderCount,
  }));

  const dashboardStats = [
    { label: "Total Orders", value: stats?.counts?.orders ?? 0, delta: "+15% this month", up: true, icon: ShoppingCart, accent: "violet" },
    { label: "Total Users",  value: stats?.counts?.users ?? 0, delta: "+8% vs last",    up: true, icon: Users,        accent: "blue"   },
    { label: "Total Products",value: stats?.counts?.products ?? 0, delta: "+12% since today",up: true, icon: BookOpen,     accent: "pink"   },
    { label: "Total Revenue", value: `৳${stats?.counts?.revenue?.toLocaleString() ?? 0}`, delta: "+22% vs last",  up: true, icon: BiMoney,      accent: "orange" },
  ];

  const accentMap: Record<string, string> = {
    violet: "bg-violet-500/[0.12] border-violet-400/[0.15]",
    blue:   "bg-blue-500/[0.1]   border-blue-400/[0.12]",
    pink:   "bg-pink-500/[0.1]   border-pink-400/[0.12]",
    orange: "bg-orange-500/[0.1]  border-orange-400/[0.12]",
  };
  const iconMap: Record<string, string> = {
    violet: "bg-violet-400/20 text-violet-300",
    blue:   "bg-blue-400/20   text-blue-300",
    pink:   "bg-pink-400/20   text-pink-300",
    orange: "bg-orange-400/20  text-orange-300",
  };

  return (  
    <AdminLayout>
      <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className="flex items-center justify-between">
          <div>
            <h1 className='text-4xl font-black text-white tracking-tight uppercase'>Dashboard <span className="text-purple-500">Overview</span></h1>
            <p className="text-gray-500 mt-1 font-medium">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-[#1a1a1a] p-1 rounded-2xl border border-white/5">
            <Button variant="ghost" className="rounded-xl text-white bg-white/5 shadow-sm px-6">Real-time</Button>
            <Button variant="ghost" className="rounded-xl text-gray-500 hover:text-white px-6">Analytics</Button>
          </div>
        </div>
        
        {/* displaying stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((s, i) => (
            <div key={i} className={cn("rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 hover:bg-opacity-20", accentMap[s.accent])}>
              <span className={cn("absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg", iconMap[s.accent])}>
                <s.icon size={18} />
              </span>
              <p className="text-[11px] font-bold tracking-widest uppercase text-white/30 mb-3">{s.label}</p>
              <p className="text-4xl font-medium text-white tracking-tight mb-2">{s.value}</p>
              <div className={cn("flex items-center gap-1.5 text-xs font-bold", s.up ? "text-green-400/80" : "text-red-400/80")}>
                <span className="text-[10px]">{s.up ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}</span> {s.delta}
              </div>
            </div>
          ))}
        </div>


        {/* Shoing Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status */}
          <Card className="bg-[#1a1a1a] border-white/5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="text-purple-500" size={20} />
                Monthly Sales & Orders
              </CardTitle>
              <CardDescription className="text-gray-500">
                Current month sales and orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}
                  margin={{
                    top:20,
                    right:30,
                    left:0,
                    bottom:5,
                  }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="sales (৳)" fill="#8884d8"  radius={[4,4,0,0]}/>
                    <Bar dataKey="orders" name="orders" fill="#82ca9d"  radius={[4,4,0,0]}/>

                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>


          {/* Order Status Distribution */}
          <Card className="bg-[#1a1a1a] border-white/5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="text-purple-500" size={20} />
                Order Status Distribution
              </CardTitle>
              <CardDescription className="text-gray-500">
                Current status breakdown of all orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart data={orderStatsData}>
                    <Pie
                    data={orderStatsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}: any) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                    >
                       {orderStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-[#1a1a1a] border-white/5 rounded-2xl shadow-none">
          <CardHeader className="border-b border-white/5 pb-4 mb-4">
            <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
              <ShoppingCart className="text-purple-500" size={20} />
              Recent Orders
            </CardTitle>
            <CardDescription className="text-gray-500">
              Latest transactions across all statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="w-full text-xs text-gray-500 uppercase bg-transparent border-b border-white/5">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecentOrders.map((order: any) => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white/90">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {order.user?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-400">
                        ৳{order.totalAmount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase",
                          order.status === "pending" && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
                          order.status === "processing" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                          order.status === "shipped" && "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                          order.status === "delivered" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                          order.status === "cancelled" && "bg-red-500/10 text-red-400 border border-red-500/20"
                        )}>
                          {order?.status ? order.status : 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stats.recentOrders.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default page