import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const Login = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col items-center gap-5 border rounded-2xl p-8 shadow-md'>
        <Image
          src="/logo.png"
          alt='logo'
          width={400}
          height={100} 
          className='w-[180px]'
        />

        <div className='flex flex-col items-center'>
          <Image
            src="/login.jpg"
            alt='login'
            width={600}
            height={400}
            className='w-[400px] h-[250px] rounded-2xl' 
          />
          <div className='flex flex-col items-center gap-2'>
            <h2 className='text-2xl font-bold mt-5'>
              Welcome to Tescobit Voice Agent
            </h2>
            <p className='text-gray-500'>Sign In With Google Authentication</p>
            <Button className='mt-7 w-full'>Login with Google</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
