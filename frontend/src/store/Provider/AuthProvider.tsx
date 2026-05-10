import React, { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logout, setEmailVerified, setUser } from "../slice/userSlice";
import BookLoader from "@/lib/BookLoader";
import { useRouter, usePathname } from "next/navigation";


export default function AuthCheck({children}:{children:React.ReactNode}) {
    const [verifyAuth, {isLoading}] = useVerifyAuthMutation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    useEffect(() => {
        const checkAuth = async()=>{
            try {
                const response = await verifyAuth({}).unwrap(); 
                if(response.success){
                    dispatch(setUser(response.data));
                    dispatch(setEmailVerified(response.data.isVerified));

                    // Force profile completion for personal Gmail users
                    if (response.data.hasCompletedProfile === false && pathname !== '/institution-info') {
                        router.push('/institution-info');
                    }
                }
                else
                {
                    dispatch(logout());
                }
            } 
            catch (error) {
                dispatch(logout());
            }
            finally{
                setIsCheckingAuth(false);
            }
        }
        checkAuth();
    }, [verifyAuth, dispatch, pathname, router]);

    if(isLoading || isCheckingAuth){
        return <BookLoader/>;
    }
    return <>{children}</>;
}