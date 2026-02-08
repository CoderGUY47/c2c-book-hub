'use client';
import { useVerifyEmailMutation } from '@/store/api';
import { authStatus, setEmailVerified } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {motion} from 'framer-motion';
import { CheckCircle, CircleCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const page:React.FC = () => {  //FC used to define functional component with typescript and it works for type checking

  const {token} = useParams<{token:string}>()
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();
  const isVerifyEmail = useSelector((state: RootState) => state.user.isEmailVerified);

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "alreadyVerified" | "failed">("loading");

  useEffect(() => {
    const verify = async()=>{
      if(isVerifyEmail){
        setVerificationStatus("alreadyVerified");
        return;
      }
      try {
        const result = await verifyEmail(token).unwrap();
        if(result.success){
          dispatch(setEmailVerified(true));
          setVerificationStatus("success");
          dispatch(authStatus()); //to update the auth status in redux store
          toast.success("Email verified successfully!");
          setTimeout(()=>{
            window.location.href = "/"; // Redirect to home page after successful verification
          },3000)
        }
        else{
          throw new Error(result.message || "Email verification failed");
        }

      } 
      catch (error) {
        // toast.error("Failed to verfiy your email.");
        console.log(error);
      }
    }
    if(token){
      verify();
    }
  }, [token, verifyEmail, dispatch, isVerifyEmail]);

  return (
    <div className='p-20 flex items-center justify-center bg-gradient-to-b from-blue-200 to-purple-300 min-h-screen'>
      <div className="bg-gray-100/70 max-w-[460px] p-3 w-full rounded-lg border border-white/10 shadow-md flex items-center justify-center">
      <motion.div
        className='bg-white backdrop-filter backdrop-blur-lg shadow-xl rounded-lg p-8 text-center max-w-md w-full'
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.5}}
      >
        {verificationStatus === "loading" && (
          <div className='flex flex-col items-center'>
            <Loader2 className='h-18 w-18 text-blue-500 animate-spin mb-4'/>
            <h2 className='text-2xl font-semibold text-gray-800'>Verifying your email..</h2>
            <p className='text-gray-500'>Waiting for your email confirmation...</p>
          </div>
        )}
        {verificationStatus === "success" && (
          <motion.div
            // className='bg-white px-10 py-8 rounded-lg shadow-lg text-center max-w-md w-full'
            initial={{scale: 0.8}}
            animate={{scale: 1}}
            transition={{type: 'spring', stiffness: 200, damping: 10}}
          > 
            <CircleCheck className='h-18 w-18 text-green-500 mx-auto mb-4'/>
            <h2 className='text-2xl font-semibold text-gray-800'>Email is Verified...</h2>
            <p className='text-gray-500'>Verified successfully. You'll be redirecting to the homepage shortly.</p>
          </motion.div>
        )}

        {verificationStatus === "alreadyVerified" && (
          <motion.div
            // className='bg-white px-10 py-8 rounded-lg shadow-lg text-center max-w-md w-full'
            initial={{scale: 0.8}}
            animate={{scale: 1}}
            transition={{type: 'spring', stiffness: 200, damping: 10}}
          > 
            <CircleCheck className='h-18 w-18 text-green-500 mx-auto mb-4'/>
            <h2 className='text-2xl font-semibold text-gray-800'>Email is already Verified!</h2>
            <p className='text-gray-500'>Verified successfully, you can now use our services.</p>
            <Button 
              onClick={()=>router.push("/")}
              className='mt-2 bg-gradient-to-t from-indigo-400 to-blue-500 hover:from-blue-500 hover:to-purple-300 text-white font-semibold px-6 py-5 rounded-full transition duration-500 ease-in-out transform hover:scale-105'
            >
              Go to Home
            </Button>
          </motion.div>
        )}
      </motion.div>
      </div>
    </div>
  )
}

export default page
