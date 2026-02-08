"use client"
import NoData from '@/app/components/NoData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import BookLoader from '@/lib/BookLoader'
import { useAddToCartMutation, useGetCartQuery, useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/store/api'
import { Check, Layers, Loader2, Package, ShoppingCart, Tag, User } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const page = () => {
  const user = useSelector((state: any) => state.user.user)
  const router = useRouter();
  const { data: wishlistData, isLoading } = useGetWishlistQuery(user?._id, {
    skip: !user?._id
  })
  // Fetch cart data to check if items are in cart
  const { data: cartData } = useGetCartQuery(user?._id, {
    skip: !user?._id
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const [addToCart, { isLoading: isAddToCart }] = useAddToCartMutation();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (wishlistData?.success) {
      // Handle potentially different response structures
      let items = [];
      if (Array.isArray(wishlistData.data)) {
        items = wishlistData.data;
      } else if (wishlistData.data?.products && Array.isArray(wishlistData.data.products)) {
        items = wishlistData.data.products;
      } else if (wishlistData.data?.items && Array.isArray(wishlistData.data.items)) {
        items = wishlistData.data.items;
      }
      setWishlistItems(items);
    }
  }, [wishlistData])

  const isItemInCart = (productId: string) => {
    if (!cartData?.data?.items) return false;
    return cartData.data.items.some((item: any) => item.product._id === productId);
  }

  const handleAddToCart = async (productId: string) => {
    try {
      if (!user?._id) {
        toast.error("Please login to add items to cart");
        router.push('/login');
        return;
      }

      await addToCart({
        userId: user._id,
        productId,
        quantity: 1
      }).unwrap();
      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  }

  const toggleWishlist = async (productId: string) => {
    try {
      await removeFromWishlist({ productId }).unwrap();
      toast.success("Removed from wishlist");
      // Optimistic update or refetch will happen automatically via tags
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  }

  if (isLoading) {
    return <BookLoader />
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
        <NoData
          imageUrl="/images/no-wishlist.png" // Assuming you might have a different image or reuse standard one
          message="Your wishlist is empty"
          description="Explore our collection and add books to your wishlist to verify them later."
          onClick={() => router.push("/books")}
          buttonText="Explore Books"
        />
      </div>
    );
  }

  return (
    <div className='space-y-4 p-0 -mt-[3px] sm:p-4 lg:p-2'>
      {/* Header Section */}
      <div className="bg-gradient-to-tl from-gray-600/20 via-white/10 to-gray-600/20 border-0 p-8 rounded-xl text-white shadow-lg">
        <h1 className='text-3xl sm:text-4xl font-bold font-poppins mb-2'>My Wishlist</h1>
        <p className='text-base font-medium text-gray-400'>Save items you want to buy later. Review them here anytime.</p>
      </div>

      {/* Wishlist Grid Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        {wishlistItems.map((item: any) => {
          // Verify structure of item. Assuming item matches product structure or is nested.
          // Adjust if wishlist API returns { product: {...} } structure
          const product = item;

          return (
            <Card
              key={product?._id}
              className="flex flex-col bg-gradient-to-tl px-0 py-4 w-[395px] h-[520px] gap-0 from-slate-800/80 via-white/15 to-slate-800/80 shadow-lg backdrop-blur-lg border-0 rounded-lg text-white group hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-300"
            >
              <CardHeader className="min-h-[110px] flex flex-col justify-center pb-0 pt-2 -mt-4">
                <div className="flex items-start gap-2">
                  <Package className='size-5 mx-auto items-center text-white shrink-0' />
                  <CardTitle className='h-[50px] -mt-1 flex items-center gap-2 text-[15px] sm:text-[16px] text-white font-black font-poppins line-clamp-2 mb-0'>
                    {product.title}
                  </CardTitle>
                </div>
                <CardDescription className='flex mt-1 items-center gap-3 text-sm font-semibold text-white/70 truncate'>
                  <User className='text-white size-5 shrink-0' />{product.author}
                </CardDescription>
              </CardHeader>

              <CardContent className='flex-grow space-y-4 pt-0'>
                {/* Tags Section */}
                <div className="flex flex-wrap justify-between gap-2 h-[50px] py-0 items-center border-b border-white/20">
                  <div className="flex gap-2">
                    <span title="Genre" className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 text-[10px] uppercase tracking-wider font-extrabold">
                      <Tag className="size-3" />
                      {product.genre || "N/A"}
                    </span>
                    <span title="Condition" className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 text-[10px] uppercase tracking-wider font-extrabold">
                      <Layers className="size-3" />
                      {product.type || "N/A"}
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(item._id)}
                      className="delete-button" // Reusing the same CSS class likely defined globally or in imported module
                      title="Remove from wishlist"
                    >
                      <svg className="delete-svgIcon" viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Image Section */}
                <div
                  className="relative h-[200px] w-full bg-black/20 rounded-xl overflow-hidden border border-white/5 group-hover:border-purple-500/30 transition-colors duration-300 cursor-pointer"
                  onClick={() => router.push(`/books/${product?._id}`)}
                >
                  <Image
                    src={product?.images?.[0] || '/images/book-placeholder.png'}
                    alt={product?.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info Section */}
                <div className="flex items-center justify-between h-[60px] border-t border-white/5 pt-1">
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest mb-0.5">
                      Price
                    </span>
                    <div className="flex items-center gap-2 text-white font-black text-xl">
                      <span className="text-green-500 text-sm mr-1"><i className='fa-solid fa-bangladeshi-taka-sign'></i>{product.finalPrice}</span>
                      {product.price > product.finalPrice && (
                        <span className="text-gray-400 font-normal text-xs line-through mr-1"><i className='fa-solid fa-bangladeshi-taka-sign'></i>{product.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest mb-0.5">
                      Category
                    </span>
                    <span className="text-xs font-bold text-gray-300 bg-white/5 px-2 py-1 rounded-full border border-white/10 truncate max-w-[120px]">
                      {product?.category?.split('(')[0].trim()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-end items-center mt-1'>
                {isItemInCart(item?._id) ? (
                  <Button disabled>
                    <Check className="mr-2 h-4 w-4" />
                    Item in Cart
                  </Button>
                ) : (
                  <Button
                    className='w-40 py-6 bg-indigo-600 hover:bg-indigo-700 text-white'
                    onClick={() => handleAddToCart(item?._id)} disabled={isAddToCart}
                    title="Add to cart"
                  >
                    {isAddToCart ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default page