'use client';
import React from "react";
import { persistor, store } from '@/store/store';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import BookLoader from "@/lib/BookLoader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthCheck from "@/store/Provider/AuthProvider";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default function LayoutWrapper ({children}: {children: React.ReactNode}){
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');
    return(
        <Provider store={store}>
            <PersistGate loading={<BookLoader/>} persistor={persistor}>
            <ToastContainer 
                position="bottom-right" 
                theme="dark" 
                autoClose={4000} 
                pauseOnHover 
                toastClassName="!bg-black/40 !backdrop-blur-xl !border !border-white/10 !rounded-xl !shadow-2xl"
                bodyClassName="!text-white !font-poppins !text-sm"
            />
                <AuthCheck>
                    {!isAdminRoute && <Header/>}
                    {children}
                    {!isAdminRoute && <Footer/>}
                    {!isAdminRoute && <ScrollToTop/>}
                </AuthCheck>
            </PersistGate>
        </Provider>
    );
}
