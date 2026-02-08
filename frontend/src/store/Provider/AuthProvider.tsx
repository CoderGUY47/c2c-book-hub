import React, { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logout, setEmailVerified, setUser } from "../slice/userSlice";
import BookLoader from "@/lib/BookLoader";



export default function AuthCheck({children}:{children:React.ReactNode}) {
    const [verifyAuth, {isLoading}] = useVerifyAuthMutation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    useEffect(() => {
        const checkAuth = async()=>{
            try {
                const response = await verifyAuth({}).unwrap(); //verifyAuth works for checking, then stored cookies, find the id, verify the user and save the data in redux
                //console.log("Auth verification response:", response);
                if(response.success){
                    dispatch(setUser(response.data));
                    dispatch(setEmailVerified(response.data.isVerified));
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
    }, [verifyAuth, dispatch]);

    if(isLoading || isCheckingAuth){
        return <BookLoader/>;
    }
    return <>{children}</>;
}