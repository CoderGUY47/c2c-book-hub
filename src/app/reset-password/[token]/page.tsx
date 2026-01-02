'use client';
import { useResetPasswordMutation } from '@/store/api';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {motion} from 'framer-motion';
import { Input } from '@/components/ui/input';
import { CircleCheck, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResetPasswordFromData{
    token:string;
    newPassword:string;
    confirmPassword:string;
}

const page:React.FC = () => {
  const {token} = useParams<{token:string}>()
  const router = useRouter();
  const dispatch = useDispatch();
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPassword] = useResetPasswordMutation();
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFromData>();

    const onSubmit = async (data: ResetPasswordFromData) => {

        setResetPasswordLoading(true);
        if(data.newPassword !== data.confirmPassword){
         toast.error("Passwords do not match");
        return;
        }
        try {
            await resetPassword({token:token!, newPassword:data.newPassword}).unwrap();
            setResetPasswordSuccess(true);
            toast.success("Password reset successfully! Redirecting to login...");
        } catch (error) {
            toast.error("Failed to reset password. Please try again.");
        }
        finally{
            setResetPasswordLoading(false);
        }
    }

  return (
    <div className='p-20 flex items-center justify-center bg-gradient-to-b from-blue-200 to-purple-300 min-h-screen'>
      <div className="bg-gray-300/70 max-w-[460px] p-3 w-full rounded-lg border border-white/10 shadow-md flex items-center justify-center">
        <motion.div
          className='bg-white backdrop-filter backdrop-blur-lg shadow-xl rounded-lg p-6 text-center max-w-md w-full'
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.5}}
        >
            <h2 className='text-2xl font-bold text-gray-700 mb-6 text-center'>
                 Reset your password
            </h2>
            {!resetPasswordSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className="relative">
                        <Input
                            {...register("newPassword", {
                                required: "New Password is Required"
                            })}
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            className='pl-10 placeholder:text-gray-500'
                        />
                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                            size={20} />
                            {showPassword ?(
                            <EyeOff className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
                            size={20}
                            onClick={() => setShowPassword(false)} />
                        ) : (
                            <Eye className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
                            size={20}
                            onClick={() => setShowPassword(true)} />
                        )}
                    </div>
                    {errors.newPassword && (
                        <p className='text-red-500 text-sm'>{errors.newPassword.message}</p>
                    )}

                    <div className="relative">
                        <Input
                            {...register("confirmPassword", {
                                required: "Please, Confirm Your New Password"
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            className='pl-10 placeholder:text-gray-500'
                        />
                        <Eye
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
                            size={20}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>
                    )}

                    <Button
                        type="submit"
                        className='w-full bg-gradient-to-t from-indigo-400 to-blue-500 hover:from-blue-500 hover:to-purple-300 text-white px-6 py-5 rounded-full transition duration-500 ease-in-out transform hover:scale-105'
                    >
                        {resetPasswordLoading ? (
                            <>
                                <Loader2 className='animate-spin mr-2' size={20} />
                                Reset Password
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            ) : (
                <motion.div
                    className='p-6 text-center max-w-md w-full'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <CircleCheck className='h-18 w-18 text-green-500 mx-auto mb-4' />
                    <h2 className='text-2xl font-semibold text-gray-800'>Password Reset Successfully</h2>
                    <p className='text-gray-500'>Password Reset Successfully, you can now use .</p>
                    <Button
                        onClick={() => router.push("/")}
                        className='mt-2 bg-gradient-to-t from-indigo-400 to-blue-500 hover:from-blue-500 hover:to-purple-300 text-white font-semibold px-6 py-5 rounded-full transition duration-500 ease-in-out transform hover:scale-105'
                    >
                        Go to Login
                    </Button>
                </motion.div>
            )}
        </motion.div>
      </div>
    </div>
  )
}

export default page
