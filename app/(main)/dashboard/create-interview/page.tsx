"use client"

import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import { toast } from 'sonner'
import InterviewLink from './_components/InterviewLink'

type FormDataType = {
  [key: string]: string;
};

const CreateInterview = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({});
  const [interviewId, setInterviewId] = useState<string | undefined>(undefined);

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    console.log("FormData", formData);
  }

  const onGoToNext = () => {
    if (!formData.jobPosition || !formData.jobDescription || !formData.duration || !formData.type) {
      toast("Please enter all details!");
      return;
    }
    setStep(step + 1);
  };

  const onCreateLink = async () => {
    try {
      const res = await fetch(`/api/interview?jobPosition=${formData.jobPosition}`); // ✅ query existing interview
      
      if (!res.ok) {
        throw new Error('Failed to fetch interview');
      }
  
      const data = await res.json();
      console.log('Fetched interview:', data);
  
      setInterviewId(data._id); // ✅ set the existing Mongo _id
      setStep(step + 1);
  
    } catch (err) {
      console.error(err);
      toast('Error fetching interview');
    }
  };
  

  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
      <div className='flex items-center gap-3'>
        <ArrowLeft onClick={() => router.back()} className='cursor-pointer' />
        <h2 className='text-2xl font-bold'>Create New Interview</h2>
      </div>
      <Progress value={step * 33.33} className='my-5' />
      {step == 1 ? (
        <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGoToNext} />
      ) : step == 2 ? (
        <QuestionList formData={formData} onCreateLink={onCreateLink} />
      ) : step == 3 && interviewId ? (
        <InterviewLink interviewId={interviewId} formData={formData}/>
      ) : null}
    </div>
  )
}

export default CreateInterview;
