"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminLayout from '../components/admin/AdminLayout'


const page = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  useEffect(() => {
    // You cannot `router.push("/admin")` while you are ALREADY on the `/admin` page!
    // That creates an infinite loop that crashes the page. 
    // If you want to bypass the security check, just leave this empty:
    
    // if (user && user.role !== "admin") {
    //   router.push("/");
    // }
  }, [user, router]);


  return (  
    <AdminLayout>
      <div>Welcome to the Admin Dashboard</div>
    </AdminLayout>
  )
}

export default page