import { Facebook, Github, Instagram, LucideTwitter, Shield, Youtube, Truck, BookOpen, Headset, Bike } from 'lucide-react'
import { FaBicycle, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-300'>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-x-[35px] p-4 md:grid-cols-4">
          <div className="flex flex-col">
            <h3 className='mb-4 text-xl font-semibold text-white'>About</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/about-us' className='hover:text-white'>About Us</Link>
              </li>
              <li>
                <Link href='/contact-us' className='hover:text-white'>Contact Us</Link>
              </li>
              <li>
                <Link href='/careers' className='hover:text-white'>Careers</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className='mb-4 text-lg font-semibold text-white'>Useful links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/how-it-works' className='hover:text-white'>How it works</Link>
              </li>
              <li>
                <Link href='/' className='hover:text-white'>Blogs</Link>
              </li>
              <li>
                <Link href='/faq' className='hover:text-white'>FAQ</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className='mb-4 text-lg font-semibold text-white'>Policies</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/terms-of-use' className='hover:text-white'>Terms of use</Link>
              </li>
              <li>
                <Link href='/privacy-policy' className='hover:text-white'>Privacy policy</Link>
              </li>
              <li>
                <Link href='/shipping-policy' className='hover:text-white'>Shipping Policy</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className='mb-4 text-lg font-semibold text-white'>Stay connected</h3>
            <div className="mb-4 flex space-x-4">              
              <Link href='#' className='hover:text-white'>
                <Facebook className='h-6 w-6'/>
              </Link>
              <Link href='#' className='hover:text-white transition-colors duration-300 transform hover:scale-110'>
                <Instagram className='h-6 w-6'/>
              </Link>
              <Link href='#' className='hover:text-white transition-colors duration-300 transform hover:scale-110'>
                <Youtube className='h-6 w-6'/>
              </Link>
              <Link href='#' className='hover:text-white transition-colors duration-300 transform hover:scale-110'>
                <FaXTwitter className='h-6 w-6'/>
              </Link>
              <Link href='#' className='hover:text-white transition-colors duration-300 transform hover:scale-110'>
                <FaWhatsapp className='h-6 w-6'/>
              </Link>
            </div>
            <p className='text-sm'>
              Book-Shop is a free platform where you can buy second hand books at
              very cheap prices. Buy used books online like college books,
              school books, much more near you.
            </p>
          </div>
        </div>
        {/* Feature section*/}
        <section className='py-10'>
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="flex items-center gap-4 rounded-xl p-6 bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors duration-300">
                <div className="rounded-full p-3 bg-indigo-500">
                  <Shield className='w-6 h-6 text-white'/>
                </div>
                <div>
                  <h3 className='font-semibold'>Secure Payment</h3>
                  <p className='text-sm text-gray-300'>100% Secure Online Transaction</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl p-6 bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors duration-300">
                <div className="rounded-full p-3 bg-lime-600">
                  <Bike className='w-6 h-6 text-white'/>
                </div>
                <div>
                  <h3 className='font-semibold'>Fast Delivery</h3>
                  <p className='text-sm text-gray-300'>Quick & Reliable Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl p-6 bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors duration-300">
                <div className="rounded-full p-3 bg-orange-400">
                  <BookOpen className='w-6 h-6 text-white'/>
                </div>
                <div>
                  <h3 className='font-semibold'>Quality Books</h3>
                  <p className='text-sm text-gray-300'>Curated Selection of Reads</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl p-6 bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors duration-300">
                <div className="rounded-full p-3 bg-red-500">
                  <Headset className='w-6 h-6 text-white'/>
                </div>
                <div>
                  <h3 className='font-semibold'>24/7 Support</h3>
                  <p className='text-sm text-gray-300'>Dedicated Customer Service</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="container flex flex-col mt-12 border-t border-gray-700 pt-8 md:flex-row gap-4 md:gap-0 justify-between items-center">
          <p className='px-4 text-sm font-medium text-gray-400 tracking-widest'>
            &copy; {new Date().getFullYear()} Book-Shop. All rights reserved.
          </p>
          <div className="flex items-center space-x-8 rounded-sm p-5 mr-[14px] bg-white h-10">
            <Image
            src='/icons/maaster.svg'
            alt='Mastercard'
            height={50}
            width={70}
            />
            <Image
            src='/icons/nagad.svg'
            alt='Nagad'
            height={70}
            width={90}
            />
            <Image
            src='/icons/bikash.svg'
            alt='Bikash'
            height={70}
            width={90}
            />
            <Image
            src='/icons/brac.svg'
            alt='BRAC Bank'
            height={70}
            width={90}
            />
            <Image
            src='/icons/paypal.svg'
            alt='PayPal'
            height={80}
            width={100}
            />
            <Image
            src='/icons/paytm.svg'
            alt='Paytm'
            height={50}
            width={70}
            />
            <Image
            src='/icons/ssl-commerz.png'
            alt='SSLCommerz'
            height={50}
            width={90}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
