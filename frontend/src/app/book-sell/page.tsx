"use client";
import { Bookdetails } from "@/lib/types/type";
import { useAddProductsMutation } from "@/store/api";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
// import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Book,
  ChevronRight,
  CloudUpload,
  Info,
  Loader2,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filters } from "@/lib/Constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LuSwatchBook } from "react-icons/lu";
import { SiGitbook } from "react-icons/si";
import { Description } from "@radix-ui/react-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const page = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [addProducts, { isLoading }] = useAddProductsMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<Bookdetails & { agreeToTerms: boolean; discount: number }>({
    defaultValues: {
      images: [],
      agreeToTerms: false,
      discount: 0,
    },
  });

  // Cover Image Handlers
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImageFile(null);
  };

  //for image upload with a popup preview using event handler and watch current images & new images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const currentFiles = watch("images") || [];

      setUploadedImages((prevImage) =>
        [
          ...prevImage,
          ...newFiles.map((file) => URL.createObjectURL(file)),
        ].slice(0, 4)
      );
      setValue(
        "images",
        [...currentFiles, ...newFiles].slice(0, 4) as string[]
      );
    }
  };

  //remove image from the uploaded images with the help of index
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index)); // ! = =
    const currentFiles = watch("images") || []; //used to store if any changes made
    const uploadFiles = currentFiles.filter((_, i) => i !== index);
    setValue("images", uploadFiles); // update the form value
  };

  const price = watch("price");
  const shippingCharge = watch("shippingCharge");
  const finalPrice = watch("finalPrice");

  // Calculate discount based on Final Price
  useEffect(() => {
    const priceVal = parseFloat(price?.toString() || "0");
    const shippingVal =
      shippingCharge === "free"
        ? 0
        : parseFloat(shippingCharge?.toString() || "0");
    const finalPriceVal = parseFloat(finalPrice?.toString() || "0");

    // Formula: Discount = (Price + Shipping) - Final Price
    const totalBeforeDiscount = priceVal + shippingVal;
    const calculatedDiscount = totalBeforeDiscount - finalPriceVal;

    // Only set discount if Final Price is entered and valid
    if (finalPriceVal > 0) {
      setValue("discount", calculatedDiscount > 0 ? calculatedDiscount : 0);
    } else {
      setValue("discount", 0);
    }
  }, [price, shippingCharge, finalPrice, setValue]);

  const onSubmit = async (data: Bookdetails & { discount: number }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "images" &&
          key !== "paymentDetails" &&
          key !== "price" &&
          key !== "finalPrice" &&
          key !== "shippingCharge"
        ) {
          // Skip empty strings or null/undefined values to avoid Mongoose casting errors
          if (value !== "" && value !== null && value !== undefined) {
            formData.append(key, value as string);
          }
        }
      });

      if (data.paymentMode === "SSLCommerz") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ sessionId: data.paymentDetails.sessionId })
        );
      } else if (data.paymentMode === "Bank Account") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ bankDetails: data.paymentDetails.bankDetails })
        );
      }

      // Validate Cover Image
      if (!coverImageFile) {
        toast.error("Please upload a cover photo");
        return;
      }

      // Ensure Price and FinalPrice are present (default to 0 if empty)
      const submitPrice = data.price ? data.price.toString() : "0";

      // If price wasn't added by the loop (because it was empty string), add it now
      if (!formData.has("price")) {
        formData.append("price", submitPrice);
      }

      // Add finalPrice from form data (calculated)
      formData.append(
        "finalPrice",
        data.finalPrice ? data.finalPrice.toString() : submitPrice
      );

      // Add shippingCharge from form data
      formData.append(
        "shippingCharge",
        data.shippingCharge ? data.shippingCharge : "50"
      );

      // Append Cover Image FIRST (if exists)
      if (coverImageFile) {
        formData.append("images", coverImageFile);
      }

      //if images exist, append them to formData
      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append("images", image));
      }

      const result = await addProducts(formData).unwrap();
      if (result.success) {
        // Redirect using title-slug logic
        const slug = result.data.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-");
        router.push(`/books/${slug}`);
        toast.success("Your Book has been added successfully");
        reset();
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to add the book. Please try again.";
      toast.error(errorMessage);
      console.error("Failed to add book:", error);
    }
  };

  const paymentMode = watch("paymentMode");

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };
  if (!user) {
    return (
      <NoData
        message="Please log in to sell your books."
        description="You need to be logged in to list your books for sale."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl mb-4 font-black font-poppins text-[#7a19ea]">
            Sell Your Used Books Here
          </h1>
          <p className="text-md text-gray-400 mb-4 font-semibold">
            Turn your old books into cash! List them here and find new readers.
          </p>
          <Link
            href="#"
            className="text-[#7a19ea] font-poppins font-bold hover:underline inline-flex items-center"
          >
            Learn How It Works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.error("Validation Errors:", errors);
            toast.error("Please fill in all required fields correctly.");
          })}
          className="space-y-8"
        >
          {/* Title and Description */}
          <Card className="border-t-10 pt-0 border-t-indigo-500 shadow-lg">
            <CardHeader className="top-0 mt-0 py-4 bg-gradient-to-r from-blue-100 to-indigo-100">
              <CardTitle className="flex text-2xl font-black font-poppins text-indigo-500 items-center">
                <LuSwatchBook className="mr-2 h-8 w-8" />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Form Fields for Book Details */}
              {/* Title */}
              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="title"
                  className="md:w-1/4 text-md font-black font-poppins text-gray-700 mt-3"
                >
                  Add Title & Subtitle
                </Label>
                <div className="md:w-3/4 space-y-4">
                  <div>
                    <Input
                      {...register("title", {
                        required: "Title is required",
                      })}
                      type="text"
                      placeholder="Title Of Your Book"
                      className="pl-10 placeholder:text-gray-400 font-poppins font-semibold w-full"
                    />
                    {errors.title && (
                      <p className="text-indigo-300 text-sm font-normal">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register("subtitle", {
                        required: "Subtitle is required",
                      })}
                      type="text"
                      placeholder="Subtitle Of Your Book"
                      className="pl-10 placeholder:text-gray-400 font-poppins font-semibold w-full"
                    />
                    {errors.subtitle && (
                      <p className="text-indigo-300 text-sm font-normal">
                        {errors.subtitle.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="category"
                  className="md:w-1/4 text-md font-black text-gray-700"
                >
                  Book Type
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Book type is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="font-poppins font-bold w-full justify-between text-left pl-10 data-[placeholder]:text-gray-400 ">
                          <SelectValue placeholder="select your book category" />
                        </SelectTrigger>
                        <SelectContent className="font-poppins font-semibold">
                          {filters.category.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-indigo-300 text-sm font-normal">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="condition"
                  className="md:w-1/4 text-md font-black text-gray-700"
                >
                  Book Condition
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Book condition is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center space-x-4"
                      >
                        {filters.condition.map((condition) => (
                          <div
                            key={condition}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={condition.toLowerCase()}
                              id={condition.toLowerCase()}
                              className="peer"
                            />
                            <Label
                              htmlFor={condition.toLowerCase()}
                              className="text-gray-400 font-poppins font-semibold peer-data-[state=checked]:text-indigo-400 peer-data-[state=checked]:font-semibold cursor-pointer"
                            >
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.condition && (
                    <p className="text-indigo-300 text-sm font-formal">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>

              {/* For Class */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="classType"
                  className="md:w-1/4 text-md font-black text-gray-700"
                >
                  For class
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("classType", {
                      required: "Class type is required",
                    })}
                    type="text"
                    placeholder="Enter Class (Class 1 to 12, B.Sc, Master, Ph.D, etc...)"
                    className="pl-10 placeholder:text-gray-400 font-poppins font-semibold w-full"
                  />
                  {errors.classType && (
                    <p className="text-indigo-300 text-sm font-normal">
                      {errors.classType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Genre Field */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="genre"
                  className="md:w-1/4 text-md font-black text-gray-700"
                >
                  Genre
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="genre"
                    control={control}
                    rules={{ required: "Genre is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="font-poppins font-bold w-full justify-between text-left pl-10 data-[placeholder]:text-gray-400">
                          <SelectValue placeholder="Select Genre" />
                        </SelectTrigger>
                        <SelectContent className="font-poppins font-semibold h-60">
                          {[
                            "Fiction",
                            "Non-Fiction",
                            "Detective",
                            "Mystery",
                            "Thriller",
                            "Romance",
                            "Science Fiction",
                            "Fantasy",
                            "Biography",
                            "History",
                            "Self-Help",
                            "Business",
                            "Children",
                            "Young Adult",
                            "Crime",
                            "Action",
                            "Adventure",
                            "Horror",
                            "Poetry",
                            "Comics",
                            "Art",
                            "Cookbooks",
                            "Food & Drinks",
                            "Journals",
                            "Religion",
                            "Science",
                            "Travel",
                            "True Crime",
                            "Classic",
                            "Motivational",
                            "Graphic Novel",
                            "Humanities & Social Sciences",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.genre && (
                    <p className="text-indigo-300 text-sm font-normal">
                      {errors.genre.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Year Field */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="year"
                  className="md:w-1/4 text-md font-black text-gray-700"
                >
                  Year
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="year"
                    control={control}
                    rules={{ required: "Year is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="font-poppins font-bold w-full justify-between text-left pl-10 data-[placeholder]:text-gray-400">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="font-poppins font-semibold h-60">
                          {Array.from(
                            { length: new Date().getFullYear() - 1980 + 1 },
                            (_, i) => (new Date().getFullYear() - i).toString()
                          ).map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.year && (
                    <p className="text-indigo-300 text-sm font-normal">
                      {errors.year?.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Writer Field */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="author"
                  className="md:w-1/4 text-md font-black text-gray-700"
                >
                  Writer
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("author", {
                      required: "Writer name is required",
                    })}
                    type="text"
                    placeholder="Enter writer's name"
                    className="pl-10 placeholder:text-gray-400 font-poppins font-semibold w-full"
                  />
                  {errors.author && (
                    <p className="text-indigo-300 text-sm font-normal">
                      {errors.author.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Cover Image Section */}
              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 text-md font-black text-gray-700 mt-2">
                  Cover Photo
                </Label>
                <div className="md:w-3/4 space-y-4">
                  <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl p-4 hover:border-indigo-500 hover:bg-indigo-50 transition-all group min-h-[200px] flex flex-col items-center justify-center relative">
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
                      className="hidden"
                      onChange={handleCoverImageUpload}
                    />

                    {coverImage ? (
                      <div className="relative group w-full h-[300px] rounded-xl overflow-hidden shadow-md">
                        <Image
                          src={coverImage}
                          alt="Cover Photo"
                          fill
                          className="object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeCoverImage();
                            }}
                            className="bg-white/90 text-red-500 hover:text-red-600 rounded-full p-3 transform scale-90 hover:scale-100 transition-all shadow-lg"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          Cover Photo
                        </div>
                      </div>
                    ) : (
                      <Label
                        htmlFor="coverImage"
                        className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-10"
                      >
                        <div className="bg-indigo-100 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-inner">
                          <Book className="h-10 w-10 text-indigo-600" />
                        </div>
                        <p className="text-xl font-black text-gray-700 mb-2">
                          Upload Cover Photo
                        </p>
                        <p className="text-sm font-medium text-gray-400 mb-6 text-center max-w-xs">
                          This will be the main image displayed for your book.
                        </p>
                        <div className="flex gap-4 text-xs font-poppins font-medium text-gray-400">
                          <span className="flex items-center">
                            <Info className="w-3 h-3 mr-1" /> Max size: 5MB
                          </span>
                        </div>
                      </Label>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Images */}
              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 text-md font-black font-poppins text-gray-700 mt-2">
                  Additional Images
                </Label>
                <div className="md:w-3/4 space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group min-h-[200px] flex flex-col items-center justify-center">
                    <Input
                      id="images"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadedImages.length >= 4}
                    />

                    {uploadedImages.length === 0 ? (
                      <Label
                        htmlFor="images"
                        className="cursor-pointer flex flex-col items-center justify-center w-full py-6"
                      >
                        <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                          <CloudUpload className="h-8 w-8 text-indigo-600" />
                        </div>
                        <p className="text-lg font-black text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm font-medium text-gray-500 mb-4">
                          PNG, JPG or JPEG (max. 800x400px)
                        </p>
                        <div className="flex gap-4 text-xs font-poppins font-medium text-gray-400">
                          <span className="flex items-center">
                            <Info className="w-3 h-3 mr-1" /> Max size: 5MB
                          </span>
                          <span className="flex items-center">
                            <Info className="w-3 h-3 mr-1" /> Max images: 4
                          </span>
                        </div>
                      </Label>
                    ) : (
                      <div className="w-full space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {uploadedImages.map((img, index) => (
                            <div
                              key={index}
                              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white"
                            >
                              <Image
                                src={img}
                                alt={`Uploaded ${index + 1}`}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeImage(index);
                                  }}
                                  className="bg-white/90 text-red-500 hover:text-red-600 rounded-full p-2 transform scale-90 hover:scale-100 transition-all shadow-lg"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {uploadedImages.length < 4 && (
                            <Label
                              htmlFor="images"
                              className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-all bg-white"
                            >
                              <CloudUpload className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                              <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                Add More
                              </span>
                            </Label>
                          )}
                        </div>
                        <div className="flex justify-center border-t border-gray-100 pt-3">
                          <p className="text-[10px] font-medium text-gray-400 flex items-center">
                            <Info className="w-3 h-3 mr-1" />{" "}
                            {uploadedImages.length} of 4 images uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-t-10 pt-0 border-t-purple-600 shadow-lg">
            <CardHeader className="top-0 mt-0 py-4 bg-gradient-to-r from-purple-100 to-pink-100">
              <CardTitle className="flex text-2xl font-black font-poppins text-purple-600 items-center">
                <SiGitbook className="mr-2 h-8 w-8" />
                Additional Information
              </CardTitle>
              <CardDescription className="font-poppins font-semibold text-purple-400 tracking-[3px]">
                ( Author, Description, BDT, etc...)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-md font-black font-poppins">
                    Book Details
                  </AccordionTrigger>
                  <AccordionContent className="py-4 px-1 md:space-y-0 md:space-x-4">
                    <div className="space-y-4">
                      <div className="space-y-0">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                          <Label
                            htmlFor="price"
                            className="md:w-1/4 text-md font-black font-poppins text-gray-700"
                          >
                            Price in BDT
                          </Label>
                          <Input
                            {...register("price")}
                            type="text"
                            placeholder="Price Of Your Book in BDT"
                            className="md:w-3/4 font-semibold placeholder:text-gray-400"
                          />
                          {errors.price && (
                            <p className="text-indigo-300 text-sm font-normal">
                              {errors.price.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                          <Label
                            htmlFor="pageCount"
                            className="md:w-1/4 text-md font-black font-poppins text-gray-700"
                          >
                            Page Count
                          </Label>
                          <Input
                            {...register("pageCount")}
                            type="number"
                            placeholder="Number of pages"
                            className="md:w-3/4 font-poppins font-semibold placeholder:text-gray-400"
                          />
                          {errors.pageCount && (
                            <p className="text-indigo-300 text-sm font-normal">
                              {errors.pageCount.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                          <Label
                            htmlFor="releaseDate"
                            className="md:w-1/4 text-md font-black font-poppins text-gray-700"
                          >
                            Release Date
                          </Label>
                          <Input
                            {...register("releaseDate")}
                            type="date"
                            className="md:w-3/4 font-poppins font-semibold placeholder:text-gray-400"
                          />
                          {errors.releaseDate && (
                            <p className="text-indigo-300 text-sm font-normal">
                              {errors.releaseDate.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-md font-black font-poppins">
                    Add Description
                  </AccordionTrigger>
                  <AccordionContent className="py-4 px-1">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Label
                          htmlFor="aboutAuthor"
                          className="md:w-1/4 text-md font-black font-poppins text-gray-700 md:mt-2"
                        >
                          About the Author
                        </Label>
                        <Textarea
                          id="aboutAuthor"
                          {...register("aboutAuthor")}
                          placeholder="Short bio about the author"
                          className="md:w-3/4 font-poppins placeholder:text-gray-400 font-semibold h-32 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:border-transparent transition-all"
                          rows={4}
                        />
                        {errors.aboutAuthor && (
                          <p className="text-indigo-300 text-sm font-normal">
                            {errors.aboutAuthor.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Label
                          htmlFor="description"
                          className="md:w-1/4 text-md font-black font-poppins text-gray-700 md:mt-2"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          {...register("description")}
                          placeholder="Description of the book"
                          className="md:w-3/4 font-poppins placeholder:text-gray-400 font-semibold h-52 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:border-transparent transition-all"
                          rows={9}
                        // className='pl-10 placeholder:text-gray-400 font-hanken-grotesk font-semibold w-full'
                        />
                        {errors.description && (
                          <p className="text-indigo-300 text-sm font-normal">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Price Details with Negotiation */}
          <Card className="border-t-10 pt-0 border-t-amber-500 shadow-lg">
            <CardHeader className="top-0 mt-0 py-4 bg-gradient-to-r from-amber-50 to-yellow-50">
              <CardTitle className="flex text-2xl font-black font-poppins text-amber-500 items-center">
                <i className="fa-solid fa-bangladeshi-taka-sign mr-2 text-xl"></i>
                Price Informations
              </CardTitle>
              <CardDescription className="font-poppins font-semibold text-amber-400 tracking-[3px]">
                ( Author, Description, BDT, etc...)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-0">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label
                      htmlFor="shippingCharge"
                      className="md:w-1/4 text-md font-black font-poppins text-gray-700"
                    >
                      Shipping Charge
                    </Label>
                    <div className="space-y-3 md:w-3/4">
                      <div className="flex items-center gap-4">
                        <Input
                          id="shippingCharge"
                          {...register("shippingCharge")}
                          type="text"
                          placeholder="Enter your shipping charges"
                          className="w-full md:w-1/2 font-semibold placeholder:text-gray-400"
                          disabled={watch("shippingCharge") === "free"}
                        />
                        <span className="text-gray-400 font-semibold text-sm">
                          Or,
                        </span>
                        <div className="flex items-center space-x-2">
                          <Controller
                            name="shippingCharge"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id="freeShipping"
                                checked={field.value === "free"}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? "free" : "50");
                                }}
                              />
                            )}
                          />
                          <Label
                            htmlFor="freeShipping"
                            className="font-semibold text-gray-400"
                          >
                            Free shipping
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-0">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label
                      htmlFor="finalPrice"
                      className="md:w-1/4 text-md font-black font-poppins text-gray-700"
                    >
                      Final Price(৳)
                    </Label>
                    <div className="flex items-center space-x-2 w-full md:w-3/4">
                      <Input
                        id="finalPrice"
                        {...register("finalPrice")}
                        type="text"
                        placeholder="What's your negotiation offer"
                        className="font-poppins font-semibold placeholder:text-gray-400 w-full"
                      />
                      {watch("discount") > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 whitespace-nowrap px-3 py-1 text-md"
                        >
                          -{" "}
                          {Math.round(
                            (watch("discount") /
                              (parseFloat(watch("price")?.toString() || "0") +
                                (watch("shippingCharge") === "free"
                                  ? 0
                                  : parseFloat(
                                    watch("shippingCharge")?.toString() || "0"
                                  )))) *
                            100
                          )}
                          %
                          <span className="ml-1 text-xs">
                            ({watch("discount")}৳)
                          </span>
                        </Badge>
                      )}
                    </div>
                    {errors.finalPrice && (
                      <p className="text-indigo-300 text-sm font-normal">
                        {errors.finalPrice.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank details */}
          <Card className="border-t-10 pt-0 border-t-[#ce1241] shadow-lg">
            <CardHeader className="top-0 mt-0 py-4 bg-gradient-to-r from-red-100 to-pink-100">
              <CardTitle className="flex text-2xl font-black font-poppins text-[#ea023c] items-center">
                <i className="fa-solid fa-vault mr-2 text-xl"></i>
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Form Fields for Book Details */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 text-md font-black font-poppins text-gray-700">
                  Payment Mode
                </Label>
                <div className="md:w-3/4 space-y-2">
                  <p className="text-sm text-muted-foreground mb-2 font-semibold">
                    In which payment mode, Do you want to recieve payment?
                  </p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    rules={{ required: "Payment mode is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center font-poppins text-gray-400 space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="SSLCommerz"
                            id="ssl"
                            {...register("paymentMode")}
                          />
                          <Label htmlFor="ssl" className="font-semibold">
                            SSLCommerz
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Bank Account"
                            id="bank account"
                            {...register("paymentMode")}
                          />
                          <Label
                            htmlFor="bank account"
                            className="font-semibold"
                          >
                            Bank Account
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.paymentMode && (
                    <p className="text-indigo-300 text-sm font-normal">
                      {errors.paymentMode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment detals */}
              {/* {paymentMode ==='SSLCommerz' && (
                                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                        <Label htmlFor='sslId' className='md:w-1/4 text-md font-bold text-gray-700'>
                                            SSL ID/Number
                                        </Label>
                                            <Input
                                                {...register("paymentDetails.sessionId", {
                                                    required: "SSL ID is required",
                                                    pattern:{
                                                        value: /[a-zA-Z0-9,\-_]{2,256}@[a-zA-Z]{2,64}/,
                                                        message: "Invalid SSL number format", 
                                                    }
                                                })}
                                                type="text"
                                                placeholder="Enter your SSL ID"
                                                className='md:w-3/4 placeholder:text-gray-400 font-hanken-grotesk font-semibold w-full'
                                            />
                                            {errors.paymentDetails?.sessionId && (
                                                <p className='text-indigo-300 text-sm font-normal'>{errors.paymentDetails.sessionId.message}</p>
                                            )}
                                        </div>
                                )} */}

              {paymentMode === "SSLCommerz" && (
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <Label
                    htmlFor="sslId"
                    className="md:w-1/4 text-md font-black font-poppins text-gray-700"
                  >
                    SSL ID/Transaction ID
                  </Label>
                  <div className="w-full md:w-3/4 flex flex-col">
                    <Input
                      {...register("paymentDetails.sessionId", {
                        required: "Transaction ID is required",
                        pattern: {
                          value: /^[a-zA-Z0-9\-_]{8,35}$/, // Allow letters, numbers, hyphens, and underscores.  Typical length is 10-35 characters.
                          message:
                            "Invalid ID format (Alphanumeric only, no special chars like '@')",
                        },
                      })}
                      type="text"
                      placeholder="sample: 646c5b69c6762"
                      className="placeholder:text-gray-400 font-poppins font-semibold w-full"
                    />
                    {errors.paymentDetails?.sessionId && (
                      <p className="text-indigo-500 text-sm font-normal mt-1">
                        {errors.paymentDetails.sessionId.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {paymentMode === "Bank Account" && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label
                      htmlFor="accountNumber"
                      className="md:w-1/4 text-md font-bold text-gray-700"
                    >
                      Account ID/Number
                    </Label>
                    <Input
                      {...register("paymentDetails.bankDetails.accountNumber", {
                        required: "Acocunt Number is required",
                        pattern: {
                          value: /^[0-9]{9,18}$/,
                          message: "Invalid account number format",
                        },
                      })}
                      type="text"
                      placeholder="Enter your account number"
                      className="md:w-3/4 placeholder:text-gray-400 font-poppins font-semibold w-full"
                    />
                    {errors.paymentDetails?.bankDetails?.accountNumber && (
                      <p className="text-indigo-300 text-sm font-normal">
                        {
                          errors.paymentDetails.bankDetails.accountNumber
                            .message
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label
                      htmlFor="bicCode"
                      className="md:w-1/4 text-md font-bold text-gray-700"
                    >
                      BIC code
                    </Label>
                    <Input
                      {...register("paymentDetails.bankDetails.bicCode", {
                        required: "BIC code is required",
                        pattern: {
                          value: /^[A-Z]{4}BD[A-Z0-9]{2}([A-Z0-9]{3})?$/,
                          message:
                            "Invalid Bangladesh BIC/SWIFT code format. Example: IBBLBDDH213",
                        },
                      })}
                      type="text"
                      placeholder="Enter your BIC code"
                      className="md:w-3/4 placeholder:text-gray-400 font-poppins font-semibold w-full"
                    />
                    {errors.paymentDetails?.bankDetails?.bicCode && (
                      <p className="text-indigo-300 text-sm font-normal">
                        {errors.paymentDetails.bankDetails.bicCode.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label
                      htmlFor="bankName"
                      className="md:w-1/4 text-md font-bold text-gray-700"
                    >
                      Bank Name
                    </Label>
                    <Input
                      {...register("paymentDetails.bankDetails.bankName", {
                        required: "Bank name is required",
                      })}
                      type="text"
                      placeholder="Enter your Bank name"
                      className="md:w-3/4 placeholder:text-gray-400 font-poppins font-semibold w-full"
                    />
                    {errors.paymentDetails?.bankDetails?.bankName && (
                      <p className="text-indigo-300 text-sm font-normal">
                        {errors.paymentDetails.bankDetails.bankName.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-64 text-lg bg-gradient-to-r font-black font-poppins from-blue-700 to-indigo-400 text-white hover:from-orange-500 hover:to-yellow-600 py-6 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-100 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving The Processing
              </>
            ) : (
              "Post the book"
            )}
          </Button>

          <div className="flex flex-col space-y-2 pt-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="agreeToTerms"
                control={control}
                rules={{
                  required: "You must agree to the terms and privacy policy",
                }}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-indigo-300 data-[state=checked]:bg-indigo-500"
                  />
                )}
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-600 font-medium cursor-pointer"
              >
                By clicking this button, I agree to the{" "}
                <Link
                  href="/terms-of-use"
                  className="text-indigo-400 hover:underline font-bold"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-indigo-400 hover:underline font-bold"
                >
                  Privacy Policy
                </Link>
                .
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs font-semibold">
                {errors.agreeToTerms.message as string}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default page;
