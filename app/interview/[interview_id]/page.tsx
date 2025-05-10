"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Building, CircleAlert, Clock, Settings, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

interface InterviewProps {
  jobPosition?: string;
  jobDescription?: string;
  duration?: string;
  type?: string;
}

const Interview = () => {
  const { interview_id } = useParams();
  console.log("interview_id: ", interview_id);

  const [interview, setInterview] = useState<InterviewProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interview_id && GetInterviewDetails();
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/interview/${interview_id}`, { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      console.log("Fetched data:", data);
      setInterview(data.interview); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p>Loading interview details...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p>Interview not found.</p>
      </div>
    );
  }

  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-64 mt-16'>
      <div className='flex flex-col gap-2 items-center justify-center border rounded-lg bg-white shadow-md p-10 mb-20 pb-15'>
        <Image
          src={'/logo.png'}
          alt='logo'
          width={200}
          height={100}
          className='w-[140px]'
        />
        <h2 className='text-md'>AI-Powered Interview Platform</h2>

        <div className='flex flex-col items-center gap-5 mt-5'>
          <Image
            src={'/interviewHeader.png'}
            alt='interviewHeader'
            width={500}
            height={500}
            className='w-[300px]'
          />
          <h2 className='font-bold text-2xl mt-3'>{interview?.jobPosition}</h2>
          <div className='flex items-center gap-5'>
            <h2 className='flex items-center gap-2 text-gray-500'><Building className='w-5 h-5' />Google Inc.</h2>
            <h2 className='flex items-center gap-2 text-gray-500'><Clock className='w-5 h-5' />{interview?.duration}</h2>
          </div>

          <div className='flex flex-col gap-1 w-full mt-3'>
            <h2>Enter your full name</h2>
            <Input
              placeholder="e.g. Kaveesha Waduge"
              className="w-full"
            />
          </div>

          <div className='bg-blue-100 flex flex-col gap-2 rounded-md p-5 w-full mt-3'>
            <h2 className='font-bold text-xl text-primary flex gap-2 items-center'><CircleAlert className='w-5 h-5' /> Before you begin</h2>
            <ul className='list-disc text-blue-900 ml-5'>
              <li>Ensure you have a stable internet connection</li>
              <li>Test your camera and microphone</li>
              <li>Find a quiet place for the interview</li>
            </ul>
          </div>

          <div className='flex flex-col gap-2 w-full'>
            <Button className='cursor-pointer font-bold flex items-center'><Video /> Join Interview</Button>
            <Button variant={'outline'} className='cursor-pointer font-bold flex items-center'><Settings /> Test Audio & Video</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interview