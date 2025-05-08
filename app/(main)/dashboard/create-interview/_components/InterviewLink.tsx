import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Clock, Copy, List, Mail, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { toast } from 'sonner';

type FormDataType = {
    jobPosition?: string;
    jobDescription?: string;
    duration?: string;
    type?: string;
    questions?: string[];
    [key: string]: string | string[] | undefined;
};

type InterviewLinkProps = {
    interviewId: string;
    formData: FormDataType;
};

const InterviewLink = ({ interviewId, formData }: InterviewLinkProps) => {
  //Expire date calculation
  const getExpiryDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + 30); 
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }; 

  const url = process.env.NEXT_PUBLIC_HOST_URL+'/'+interviewId;

  const GetInterviewUrl = () => {
    return url;
  }

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast('Link Copied');
  }

  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <div className='flex flex-col gap-2 items-center'>
        <Image
          src={'/check.png'}
          alt='check'
          width={200}
          height={200}
          className='w-[50px] h-[50px] mb-5' 
        />
        <h2 className='text-xl font-bold'>Your AI Interview is Ready!</h2>
        <p className='text-sm text-gray-500'>Share this link with your candidates to start the interview process</p>
      </div>

      <div className='flex flex-col gap-5 bg-white shadow-md rounded-md w-full mt-12 p-7'>
        <div className='flex justify-between w-full'>
            <h2 className='text-md font-semibold'>Interview Link</h2>
            <p className='text-sm font-semibold bg-blue-50 px-2 p-1 text-primary'>Valid for 30 days</p>
        </div>
        <div className='flex justify-between items-center gap-8 mt-5'>
            <Input
              defaultValue={GetInterviewUrl()}
              disabled={true}
              className="p-2"
            /> 
            <Button onClick={() => onCopyLink()} className='cursor-pointer'><Copy /> Copy Link</Button>
        </div>
        <div className='flex items-center justify-start gap-5 mt-5'>
            <p className='text-sm text-gray-500 flex items-center gap-2'><Clock />{formData?.duration}</p>
            <p className='text-sm text-gray-500 flex items-center gap-2'><List /> {formData?.questions?.length || 0} questions</p>
            <p className='text-sm text-gray-500 flex items-center gap-2'><Calendar /> Expires: {getExpiryDate()}</p>
        </div>
      </div>

      <div className='flex flex-col gap-5 bg-white shadow-md rounded-md w-full mt-10 p-5'>
        <h2 className='flex justify-start text-md font-semibold'>Share via</h2>
        <div className='flex items-center justify-center gap-8 mt-5 w-full'>
            <Button variant={'outline'} className='p-5 px-10'> <Mail /> Email </Button>
            <Button variant={'outline'} className='p-5 px-10'> <List /> Slack </Button>
            <Button variant={'outline'} className='p-5 px-10'> <Mail /> Whatsapp </Button>
        </div>
      </div>

      <div className='flex justify-between w-full mt-10'>
        <Link href={'/dashboard'}>
          <Button variant={'outline'}><ArrowLeft /> Back to Dashboard</Button>
        </Link>
        <Link href={'/create-interview'}>
          <Button><Plus /> Create New Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewLink
