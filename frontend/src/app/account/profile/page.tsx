"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { UserData } from '@/lib/types/type';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Map, Phone, User, Camera, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateUserMutation, useRequestEmailChangeMutation } from '@/store/api';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

    const [requestEmailChange, { isLoading: isRequesting }] = useRequestEmailChangeMutation();
    const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        requestType: 'change',
        reason: '',
        otherReasonDetail: ''
    });

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

    // Resize and compress image to base64 using canvas (max 300x300, JPEG 80%)
    const compressToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const MAX = 300;
                let { width, height } = img;
                if (width > height) {
                    if (width > MAX) { height = (height * MAX) / width; width = MAX; }
                } else {
                    if (height > MAX) { width = (width * MAX) / height; height = MAX; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas not supported'));
                ctx.drawImage(img, 0, 0, width, height);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const handleProfileEdit = async(data: UserData) => {
        const { name, phoneNumber } = data;
        try {
            const uploadAndSave = async () => {
                const payload: Record<string, string> = {};
                if (name && name.trim()) payload.name = name;
                if (phoneNumber !== undefined) payload.phoneNumber = phoneNumber;

                // Compress image to base64 and send directly — stored in MongoDB
                if (profileImageFile) {
                    payload.profilePicture = await compressToBase64(profileImageFile);
                }

                const result = await updateUser({ userId: user?._id, userData: payload }).unwrap();
                return result;
            };

            const result = await toast.promise(uploadAndSave(), {
                pending: profileImageFile ? 'Compressing & saving image...' : 'Saving profile...',
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

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestData.reason || (requestData.reason === 'Other' && !requestData.otherReasonDetail)) {
            toast.error("Please provide a valid reason.");
            return;
        }
        try {
            await requestEmailChange(requestData).unwrap();
            toast.success("Request submitted successfully! Admin will review it soon.");
            setIsChangeDialogOpen(false);
            setRequestData({ requestType: 'change', reason: '', otherReasonDetail: '' });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit request.");
        }
    };

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
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={profileImagePreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
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

                            {/* Educational Email Display & Request Change Logic */}
                            {user?.educationalEmail && user.educationalEmail !== user.email && (
                                <div className="space-y-2 sm:col-span-2 mt-2">
                                    <Label className='font-semibold font-poppins text-gray-50 flex items-center gap-2'>
                                        Educational / Professional Email
                                        <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">VERIFIED</span>
                                    </Label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <GraduationCap className='absolute size-5 left-3 top-1/2 -translate-y-1/2 text-indigo-400'/>
                                            <input
                                                value={user.educationalEmail}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-2 font-bold bg-indigo-500/10 text-indigo-200 text-sm border border-indigo-500/20 rounded-lg focus:outline-none opacity-90 cursor-not-allowed"
                                            />
                                        </div>
                                        
                                        <Dialog open={isChangeDialogOpen} onOpenChange={setIsChangeDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white shrink-0">
                                                    Request Change / Remove
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-gray-900 border border-white/10 text-white sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2"><AlertCircle className="text-orange-500"/> Update Educational Email</DialogTitle>
                                                    <DialogDescription className="text-gray-400 mt-2">
                                                        Educational emails are strictly verified. You cannot change them yourself. Please submit a request to the admin with a valid reason.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 mt-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Request Type</Label>
                                                        <select 
                                                            className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white appearance-none"
                                                            value={requestData.requestType}
                                                            onChange={(e) => setRequestData({...requestData, requestType: e.target.value})}
                                                        >
                                                            <option value="change">Change Educational Email</option>
                                                            <option value="remove">Remove Educational Email</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Reason</Label>
                                                        <select 
                                                            className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white appearance-none"
                                                            value={requestData.reason}
                                                            onChange={(e) => setRequestData({...requestData, reason: e.target.value})}
                                                        >
                                                            <option value="">Select a reason...</option>
                                                            <option value="Graduated / Left Institution">Graduated / Left Institution</option>
                                                            <option value="Changed Institution">Changed Institution</option>
                                                            <option value="Lost Access to Email">Lost Access to Email</option>
                                                            <option value="Used Wrong Email">Used Wrong Email initially</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                    {requestData.reason === 'Other' && (
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Please specify your reason</Label>
                                                            <textarea 
                                                                className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white text-sm min-h-[80px]"
                                                                placeholder="Explain why you need to update your email..."
                                                                value={requestData.otherReasonDetail}
                                                                onChange={(e) => setRequestData({...requestData, otherReasonDetail: e.target.value})}
                                                            />
                                                        </div>
                                                    )}
                                                    <Button type="button" onClick={handleRequestSubmit} disabled={isRequesting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 mt-2">
                                                        {isRequesting ? <Loader2 className="animate-spin size-4 mr-2"/> : null}
                                                        Submit Request
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">This email is strictly hidden from other users and used only for campus verification.</p>
                                </div>
                            )}

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
