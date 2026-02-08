"use client"
import NoData from '@/app/components/NoData'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import BookLoader from '@/lib/BookLoader'
import { Bookdetails } from '@/lib/types/type'
import { useDeleteProductByIdMutation, useGetProductBySellerIdQuery } from '@/store/api'
import { Package, Trash2, Tag, User, CreditCard, Layers } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const page = () => {
  const user = useSelector((state: any) => state.user.user)
  const router = useRouter();
  const { data: products, isLoading } = useGetProductBySellerIdQuery(user?._id)
  const [deleteProductById] = useDeleteProductByIdMutation()
  const [book, setBook] = useState<Bookdetails[]>([]);


  useEffect(() => {
    if (products?.success) {
      setBook(products.data)
    }
  }, [products])

  if (isLoading) {
    return (
      <BookLoader />
    )
  }

  console.log(book)
  if (book?.length === 0) {
    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="You haven't sold any books yet."
          description="Start selling your books to reach potential buyers. List your first book now and make it available to others."
          onClick={() => router.push("/book-sell")}
          buttonText="Sell Your First Book"
        />
      </div>
    );
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductById({ productId }).unwrap();
      toast.success("Book deleted successfully");
    } catch (error) {
      toast.error("Failed to delete book");
    }
  }


  return (
    <div className='space-y-4 p-0 -mt-[3px] sm:p-4 lg:p-2'>
      {/* Header Section */}
      <div className="bg-gradient-to-tl from-gray-600/20 via-white/10 to-gray-600/20 border-0 p-8 rounded-xl text-white shadow-lg">
        <h1 className='text-3xl sm:text-4xl font-bold font-poppins mb-2'>Your Listed Books</h1>
        <p className='text-base font-medium text-gray-400'>Manage and track the books you're currently selling.</p>
      </div>

      {/* Product List Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        {book.map((product: Bookdetails) => (
          <Card
            key={product?._id}
            className="flex flex-col bg-gradient-to-tl px-0 py-4 w-[395px] h-[465px] gap-0 from-slate-800/80 via-white/15 to-slate-800/80 shadow-lg backdrop-blur-lg border-0 rounded-lg text-white group hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-300"
          >
            <CardHeader className="min-h-[110px] flex flex-col justify-center pb-0 pt-2 -mt-4">
              <div className="flex items-start gap-2">
                <Package className='size-5 text-white shrink-0' />
                <CardTitle className='h-[50px] flex items-center gap-2 text-[16px] sm:text-[18px] text-white font-black font-poppins line-clamp-2 mb-0'>
                  {product.title}
                </CardTitle>
              </div>
              <CardDescription className='flex mt-1 items-center gap-3 text-sm font-semibold text-white/70 truncate'>
                <User className='text-white size-5 shrink-0' />{product.author}
              </CardDescription>
            </CardHeader>

            <CardContent className='flex-grow space-y-4 pt-0'>
              {/* Tags Section - Fixed Height */}
              <div className="flex flex-wrap justify-between gap-2 h-[50px] py-0 items-center border-b border-white/20">
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 text-[10px] uppercase tracking-wider font-extrabold">
                    <Tag className="size-3" />
                    {product.genre}
                  </span>
                  <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 text-[10px] uppercase tracking-wider font-extrabold">
                    <Layers className="size-3" />
                    {product.condition}
                  </span>
                </div>
                <div className='flex items-center'>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product?._id)}
                    className="delete-button"
                    title="Delete listing"
                  >
                    <svg className="delete-svgIcon" viewBox="0 0 448 512">
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Section - Fixed Height Container */}
              <div className="relative h-[200px] w-full bg-black/20 rounded-xl overflow-hidden border border-white/5 group-hover:border-purple-500/30 transition-colors duration-300">
                <Image
                  src={product?.images[0]}
                  alt={product?.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info Section - Fixed Height Row */}
              <div className="flex items-center justify-between h-[60px] border-t border-white/5 pt-1">
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest mb-0.5">
                    Selling Price
                  </span>
                  <div className="flex items-center gap-2 text-white font-black text-xl">
                    <span className="text-green-500 text-sm mr-1"><i className='fa-solid fa-bangladeshi-taka-sign'></i>{product.finalPrice}</span>
                    <span className="text-gray-400 font-normal text-xs line-through mr-1"><i className='fa-solid fa-bangladeshi-taka-sign'></i>{product.price}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest mb-0.5">
                    Category
                  </span>
                  <span className="text-xs font-bold text-gray-300 bg-white/5 px-2 py-1 rounded-full border border-white/10 truncate max-w-[120px]">
                    {product.category.split('(')[0].trim()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default page