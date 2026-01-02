'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { books, filters } from '@/lib/Constant';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import BookLoader from '@/lib/BookLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {motion} from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ghost, Heart } from 'lucide-react';
import Pagination from '../components/Pagination';
import NoData from '../components/NoData';
import { useRouter } from 'next/navigation';
import { useGetProductsQuery } from '@/store/api';
import { Bookdetails } from '@/lib/types/type';


const page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState('newest')
    const bookPerPage = 6;
    // const [isLoading, setIsLoading] = useState(false);
    const {data: apiResponse={}, isLoading} = useGetProductsQuery({})
    const router = useRouter();
    const [books, setBooks] = useState<Bookdetails[]>([]);
    const searchTerms = new URLSearchParams(window.location.search).get('search') || '';

    useEffect(()=>{
        if(apiResponse.success){
            setBooks(apiResponse.data);
        }
    }, [apiResponse])

    console.log(books);



    const toggleFilter = (section: string, item:string)=>{
        const updateFilter = (prev:string[])=>{
           return prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        };
        switch(section){
            case "condition":
                setSelectedCondition(updateFilter);
                break;
            case "classType":
                setSelectedType(updateFilter);
                break;
            case "category":
                setSelectedCategory(updateFilter);
                break;
        }
        setCurrentPage(1);
    }

    const filterBooks = books.filter((book)=>{
        const conditionMatch = selectedCondition.length === 0 || selectedCondition.map(cond => cond.toLowerCase()).includes(book.condition.toLowerCase());
        const typeMatch = selectedType.length === 0 || selectedType.map(cond => cond.toLowerCase()).includes(book.classType.toLowerCase());
        const categoryMatch = selectedCategory.length === 0 || selectedCategory.map(cond => cond.toLowerCase()).includes(book.category.toLowerCase());
        const searchMatch = searchTerms 
        ? book.title.toLowerCase().includes(searchTerms.toLowerCase())  //if searchTerm is matched with anyof this below then show, if not show all books
        ||book.author.toLowerCase().includes(searchTerms.toLowerCase())
        ||book.category.toLowerCase().includes(searchTerms.toLowerCase())
        ||book.subject.toLowerCase().includes(searchTerms.toLowerCase())
        :true; 
        return conditionMatch && typeMatch && categoryMatch && searchMatch; 
    });

    const sortedBooks = [...filterBooks].sort((a,b)=>{
        switch (sortOption) {
            case "newest":
                return (
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            case "oldest":
                return (
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            case "price-low":
                return a.finalPrice - b.finalPrice;
            case "price-high":
                return b.finalPrice - a.finalPrice;
            default :
            return 0;
        }
    });

    const totalPages =Math.ceil(sortedBooks.length / bookPerPage);
    const paginatedBooks = sortedBooks.slice(
        (currentPage - 1) * bookPerPage,
        currentPage * bookPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price) {    
          const discount = ((price - finalPrice) / price) * 100;
          return Math.round(discount);
        }
        return 0;
    };

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true }); 
    };


    return (
    <div className='min-h-screen bg-slate-100 container mx-auto px-9'>
        <div className='container mx-auto px-2 py-6'>
            <nav className='mb-5 flex items-center gap-2 text-sm text-muted-foreground'>
                <Link href='/' className='hover:text-primary'>
                    {""}
                    Home{""}
                </Link>
                <span className='text-muted-foreground'>/</span>
                <span className='text-muted-foreground'>Books</span>
            </nav>
            <h1 className='text-3xl font-bold mb-8'>
                {""}
                Search 1000+ Books in online{" "}
            </h1>
            <div className="grid md:grid-cols-[280px_1fr] gap-8">
                <div className="space-y-6">
                    <Accordion
                    type='multiple'
                    className='bg-white shadow-md rounded-lg p-5 border-2 border-gray-200'
                    >
                        {Object.entries(filters).map(([key, values])=>(
                            <AccordionItem key={key} value={key}>
                                <AccordionTrigger className='text-lg font-semibold text-blue-400'>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </AccordionTrigger>
                                <AccordionContent>                      
                                    <div className='mt-2 space-y-2'>
                                        {values.map((value)=>(
                                            <div 
                                            key={value}
                                            className='flex items-center space-x-2'
                                            >
                                                <Checkbox
                                                id={value}
                                                checked={
                                                key === "condition" ? selectedCondition.includes(value) 
                                                : 
                                                key === "classType" ? selectedType.includes(value) 
                                                : 
                                                selectedCategory.includes(value)}
                                                onCheckedChange={()=>toggleFilter(key, value)}
                                                className='border-gray-600 border-2'
                                                />
                                                <Label 
                                                htmlFor={value}
                                                className='text-sm font-medium leading-none'
                                                >
                                                    {value}
                                                </Label>
                                            </div>
                                        ))}

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <div className="space-y-2">
                    {isLoading ? (
                        <BookLoader />
                    ) : paginatedBooks.length ? (
                        <>
                        <div className="flex justify-between">
                            <div className="mb-8 text-xl font-semibold">
                                Buy used & new books online
                            </div>
                            <Select value={sortOption} onValueChange={setSortOption}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                paginatedBooks.map((book) => (
                                    <motion.div 
                                        key={book._id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className='group relative overflow-hidden h-120 rounded-lg transition-shadow duration-500 hover:shadow-2xl border-0'>
                                            <CardContent className='p-0'>
                                                <Link 
                                                href={`/books/${book._id}`}
                                                >
                                                    <div className="relative -mt-[23px]">
                                                        <Image
                                                            src={book.images[0]}
                                                            alt={book.title}
                                                            width={400}
                                                            height={300}
                                                            className="w-full h-[300px] transition-transform duration-500 group-hover:scale-105 object-cover rounded-t-lg"
                                                        />
                                                        <div className="absolute flex flex-colleft-0 top-0 z-10 gap-2 p-2">
                                                            {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                                                <Badge className='bg-orange-600/90 text-white hover:bg-orange-700'>
                                                                    {calculateDiscount(book.price, book.finalPrice)}%Off                                                                
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            size='icon'
                                                            variant='ghost'
                                                            className='absolute right-2 top-2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm transition-opacity duration-300 hover:bg-white group-hover:opacity-100'
                                                        >
                                                            <Heart className='h-5 w-5 text-gray-600 group-hover:text-red-500' />
                                                        </Button>
                                                    </div>
                                                    <div className="p-6 space-y-2">
                                                        <div className="flex items-start justify-between">
                                                            <h3 className="text-xl font-bold text-indigo-400 line-clamp-2 h-14">{book.title}</h3>
                                                        </div>
                                                        <p className="text-md text-gray-400 font-semibold -mt-[20px]">{book.author}</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className='text-lg font-bold text-gray-900'>৳{book.finalPrice}</span>
                                                            {book.price && (
                                                                <span className='text-sm text-gray-400 line-through'>৳{book.price}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                                            <span>{formatDate(book.createdAt)}</span>
                                                            <span>{book.condition}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </CardContent>
                                            <div className='absolute -right-8 -top-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl'/>
                                            <div className='absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl'/>
                                        </Card>
                                    </motion.div>
                                ))
                            }
                        </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <NoData
                            imageUrl="/images/no-book.jpg"
                            message="No books available please try later."
                            description="Try adjusting your filters or search criteria to find what you're looking for."
                            onClick={() => router.push("/book-sell")}
                            buttonText="Shell Your First Book"
                        />
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default page;

