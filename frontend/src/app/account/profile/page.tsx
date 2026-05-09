"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { UserData } from '@/lib/types/type';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Map, Phone, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateUserMutation } from '@/store/api';
import { useDispatch } from 'react-redux';
import { TbBrandDatabricks } from "react-icons/tb";
import { FcReading } from "react-icons/fc";
import { FcReadingEbook } from "react-icons/fc";
import { FaPenToSquare } from "react-icons/fa6";
import { setUser } from '@/store/slice/userSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';

const page = () => {
    const [isEditing,setIsEditing] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);
    const [updateUser, {isLoading}] = useUpdateUserMutation();
    const dispatch = useDispatch();
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

    const {register,handleSubmit,reset} = useForm<UserData>({
        defaultValues:{
            name:user?.name || "",
            email:user?.email || "",
            phoneNumber:user?.phoneNumber || "",
        },
    });
    
    useEffect(()=>{
        reset({
            name:user?.name || "",
            email:user?.email || "",
            phoneNumber:user?.phoneNumber || "",
        });
        setProfileImagePreview(user?.profilePicture || null);
        setProfileImageFile(null);
    },[user, isEditing, reset])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadToImgBB = async (file: File): Promise<string> => {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!apiKey) throw new Error("ImgBB API key not configured.");

        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Strip the data:image/...;base64, prefix
                resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const formData = new FormData();
        formData.append('key', apiKey);
        formData.append('image', base64);

        const res = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });
        const json = await res.json();
        if (!json.success) throw new Error("ImgBB upload failed");
        return json.data.url as string;
    };

    const handleProfileEdit = async(data: UserData) => {
        const { name, phoneNumber } = data;
        try {
            let profilePictureUrl: string | undefined;

            const uploadAndSave = async () => {
                // Step 1: Upload to ImgBB if a new image was selected
                if (profileImageFile) {
                    profilePictureUrl = await uploadToImgBB(profileImageFile);
                }

                // Step 2: Send JSON (not FormData) to backend
                const payload: Record<string, string> = {};
                if (name && name.trim()) payload.name = name;
                if (phoneNumber !== undefined) payload.phoneNumber = phoneNumber;
                if (profilePictureUrl) payload.profilePicture = profilePictureUrl;

                const result = await updateUser({ userId: user?._id, userData: payload }).unwrap();
                return result;
            };

            const result = await toast.promise(uploadAndSave(), {
                pending: profileImageFile ? 'Uploading image...' : 'Saving profile...',
                success: 'Profile updated successfully!',
                error: 'Profile update failed',
            });

            if (result?.data) {
                dispatch(setUser(result.data));
            } else if (result && !result.success) {
                dispatch(setUser(result));
            }
            setIsEditing(false);
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <div className='space-y-3 -mt-1'>
            <div className="bg-gradient-to-tl from-gray-600/20 via-white/10 to-gray-600/20 border-0 p-8 rounded-xl text-white shadow-lg">
                <h1 className='flex items-center gap-2 text-3xl font-extrabold font-poppins mb-2'>My Profile<FcReading className='size-10 mr-1 bg-white text-indigo-600/80 p-1 rounded-full'/></h1>
                <p className='text-base font-medium'>Manage your profile information & preferences</p>
            </div>

            <Card className='bg-gradient-to-tl from-gray-900/90 via-white/10 to-gray-900/90 shadow-md backdrop-blur-lg border-0'>
                <CardHeader className='border-0'>
                    <CardTitle className='flex items-center gap-2 py-3 text-2xl font-extrabold -mt-0 font-poppins text-white'>
                        Personal Information <FcReadingEbook className='size-10 mr-1 bg-white text-indigo-600/80 p-1 rounded-full'/>
                    </CardTitle>
                    <CardDescription className='-mt-2 mb-2 text-white/70'>
                        Update your personal & contact information
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4 -mt-3 pt-0'>
                    <form onSubmit={handleSubmit(handleProfileEdit)}>
                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative size-24 rounded-full overflow-hidden border-2 border-white/20 bg-gray-800">
                                    {profileImagePreview ? (
                                        <Image
                                            src={profileImagePreview}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-full h-full p-4 text-gray-400" />
                                    )}
                                    {isEditing && (
                                        <label htmlFor="profilePicture" className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                                            <Camera className="size-6 text-white mb-1" />
                                            <span className="text-[10px] text-white font-bold">Change</span>
                                        </label>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={!isEditing}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="flex flex-col justify-center space-y-1">
                                <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                                <p className="text-sm text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className='font-semibold font-poppins text-gray-50'>Username</Label>
                                <div className="relative">
                                <User className='absolute size-5 left-3 top-1/2 -translate-y-1/2 text-gray-400'/>
                                    <input
                                        id="username"
                                        placeholder="jhon doe"
                                        readOnly={!isEditing}
                                        {...register("name")}
                                        className={`w-full pl-10 pr-4 py-2 font-bold bg-white/5 text-gray-400 text-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                            <Label htmlFor="email" className ='font-semibold font-poppins text-gray-50'>Email</Label>
                                <div className="relative">
                                <Mail className='absolute size-5 left-3 top-1/2 -translate-y-1/2 text-gray-400'/>
                                    <input
                                        id="email"
                                        placeholder="jhon.doe@example.com"
                                        readOnly={true} // email cannot be changed
                                        {...register("email")}
                                        className="w-full pl-10 pr-4 py-2 font-bold bg-white/5 text-gray-400 text-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 opacity-70 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className='font-semibold font-poppins text-gray-50'>Phone Number</Label>
                                <div className="relative">
                                <Phone className='absolute size-5 left-3 top-1/2 -translate-y-1/2 text-gray-400'/>
                                    <input
                                        id="phoneNumber"
                                        placeholder="+country-code-1234567890"
                                        readOnly={!isEditing}
                                        {...register("phoneNumber")}
                                        className={`w-full pl-10 pr-4 py-2 font-bold bg-white/5 text-gray-400 text-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* <div className="space-y-2">
                            <Label htmlFor="name" className='font-bold font-poppins'>Address</Label>
                            <div className="relative">
                                <Map className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'/>
                                <input
                                id="addresses"
                                placeholder="address"
                                disabled={!isEditing}
                                {...register("addresses")}
                                className="w-full pl-10 pr-4 py-2 text-gray-400 font-semibold text-md border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                                />
                            </div>
                        </div>                     */}
                        </div>
                        <CardFooter className='flex justify-between mt-2 px-0'>
                            {isEditing ? (
                                <>
                                    <Button
                                        type='button'
                                        variant='default'
                                        className='mt-2 bg-gray-600/50 border-0 text-white font-bold font-poppins'
                                        onClick={()=> {
                                            setIsEditing(false);
                                            reset();
                                        }}>
                                        Discard Changes
                                    </Button>
                                    <Button
                                        type='submit'
                                        className='bg-violet-600 border-0 text-white mt-2 font-bold font-poppins'
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        type='button'
                                        variant='default'
                                        className='mt-2 bg-violet-700 border-0 text-white font-bold font-poppins'
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default page
