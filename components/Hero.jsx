import Link from 'next/link';
import React from 'react';

const Hero = () => {
  return (
    // adding gradient background
    // adding blur effect
    <div className='bg-hero-image bg-cover '>
        <div className="  bg-center p-10 h-96  ">
          <h1 className="font-extrabold my-3 p-2 text-transparent text-5xl text-center bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 ">LangSwap</h1>
          <p className="text-xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-600 to-pink-400 ">
            Connect with people from all over the world and practice speaking in a new language through Video Chat and Messages.
          </p>
          {/* adding call to action buttons login or sign up */}
          <div className="flex justify-center m-5">
            <Link href='login' className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 font-bold py-2 px-6 m-2 border-2 border-black rounded text-black">
              Login
            </Link>
            <Link href='register' className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-400  font-bold py-2 px-6 m-2 border-2 border-black rounded text-black">
              Sign Up
            </Link>
          </div>
        </div>
    </div>
  );
};

export default Hero;