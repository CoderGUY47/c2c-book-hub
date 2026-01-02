import { Card, CardContent } from '@/components/ui/card';
import { books } from '@/lib/Constant'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import DiscountBadge from './DiscountBadge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Bookdetails } from '@/lib/types/type';
import { useGetProductsQuery } from '@/store/api';


const NewBooks = () => {
    const [currentBookSlide, setCurrentBookSlide] = useState(0);
    const {data: apiResponse={}, isLoading} = useGetProductsQuery({})
    const [books, setBooks] = useState<Bookdetails[]>([]);

    useEffect(()=>{
        if(apiResponse.success){
            setBooks(apiResponse.data);
        }
    }, [apiResponse])


      useEffect(() => {
            const timer = setInterval(() => {
                setCurrentBookSlide((prev) => (prev + 1) % 3);
            }, 7000); // Change image every 7 seconds
            return () => clearInterval(timer); // Cleanup the timer on component unmount
      }, []);

      const prevSlide = () => {
        setCurrentBookSlide((prev) => (prev - 1 + 3) % 3); // Loop back to last slide
      };
      const nextSlide = () => {
        setCurrentBookSlide((prev) => (prev + 1) % 3); // Loop back to first slide
      };

      const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price) {    
          const discount = ((price - finalPrice) / price) * 100;
          return Math.round(discount);
        }
        return 0;
      };

  return (
    <section className='py-16 bg-gray-50'>
      <div className="container mx-auto px-4">
        <h2 className='text-4xl font-bold text-gray-700 text-center mb-12'>Newly Arrived</h2>
        <div className="relative">
          {books.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentBookSlide * 100}%)`}}
                >
                  {Array.from({ length: 3 }).map((_, slideIndex) => (
                    <div key={slideIndex} 
                      className="w-full flex-none">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {books.slice(slideIndex * 3, slideIndex * 3 + 3).map((book, idx) => (
                            <Card
                            key={book._id} className='relative'
                            >
                              <CardContent className='p-4'>
                                <Link href={`/books/${book._id}`}>
                                  <div className="relative">
                                    <Image
                                      src={book.images[0]}
                                      alt={book.title}
                                      width={300}
                                      height={400}
                                      className="w-full h-[300px] object-contain rounded-lg mb-4"
                                    />
                                    {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                      <DiscountBadge discount={calculateDiscount(book.price, book.finalPrice)} />
                                    )}
                                  </div>
                                  <h3 className='mb-2 line-clamp-2 text-sm font-medium'>
                                    {book.title}
                                  </h3>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                      <span className='text-lg font-bold'>৳{book.finalPrice}</span>
                                      {book.price && (
                                        <span className='text-sm text-muted-foreground line-through'>৳{book.price}</span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-zinc-400">
                                      <span>{book.condition}</span>
                                    </div>
                                  </div>
                                  <div className="pt-4 ">
                                    <Button className='flex float-end font-black font-mono text-md mb-2 bg-gradient-to-r from-orange-400 to-[#ea5200] text-white hover:from-[#ea5200] hover:to-orange-400'>
                                      Buy now
                                    </Button>
                                  </div>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                    </div>
                  ))}
                </div>
              </div>
              {/*scroll button*/}
              <button className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/40 p-2 rounded-full shadow-lg/30'onClick={prevSlide}>
              <ChevronLeft className='h-6 w-6'/>
              </button>
              <button className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/40 p-2 rounded-full shadow-lg/30'onClick={nextSlide}>
              <ChevronRight className='h-6 w-6'/>
              </button>

              {/* dot design */}
              <div className="flex mt-8 justify-center space-x-2">
                {[0,1,2].map((dot) =>(
                  <button
                  key={dot}
                  onClick={() => setCurrentBookSlide(dot)}
                  className={`h-3 w-3 rounded-full ${currentBookSlide === dot ? 'bg-purple-500' : 'bg-gray-300'}`}
                  >
                  </button>
                ))}
              </div>
            </>
          ):(
            <>
              <p className='text-center text-gray-500'>No Books to show.</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewBooks