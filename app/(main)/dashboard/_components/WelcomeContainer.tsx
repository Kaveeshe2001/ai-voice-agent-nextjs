"use client"

import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React from 'react'

const WelcomeContainer = () => {
  const { data: session } = useSession();

  return (
    <div className='bg-white flex justify-between items-center p-5 rounded-xl shadow-md'>
      <div>
        <h2 className='text-lg font-bold'>Welcome Back, {session?.user?.name}</h2>
        <h2 className='text-gray-500'>AI-Driven Interviews, Hassel-Free Hiring</h2>
      </div>
      <div className='flex items-center gap-5'>
        <span><Bell /></span>
        {session?.user?.image && 
          <Image
            src={session?.user?.image} 
            alt='userAvatar'
            width={40}
            height={40}
            className='rounded-full'
          />
        }
      </div>
    </div>
  )
}

export default WelcomeContainer
