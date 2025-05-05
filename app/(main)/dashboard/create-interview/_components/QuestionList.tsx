"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FormDataType = {
  jobPosition?: string;
  jobDescription?: string;
  duration?: string;
  type?: string;
  [key: string]: string | undefined;
};

type QuestionListProps = {
  formData: FormDataType;
};

const QuestionList: React.FC<QuestionListProps> = ({ formData }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (
      formData.jobPosition &&
      formData.jobDescription &&
      formData.duration &&
      formData.type
    ) {
      GenerateQuestionList();
    } else {
      console.log("Incomplete formData", formData);
    }
  }, [formData]); 

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', {
        ...formData
      });

      console.log("Generated Questions Response", result.data);

    const Content = result.data.content;
    if (!Content) {
      throw new Error("AI response missing content field");
    }

    const FINAL_CONTENT = Content
      .replace(/```json\n?/, '')
      .replace(/```/, '')
      .trim();

    console.log("Final cleaned JSON string:", FINAL_CONTENT);

    const parsed = JSON.parse(FINAL_CONTENT);

    // Safely check if questions exists and is an array
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Parsed data does not contain a valid 'questions' array");
    }
  
    // Map only when valid
    const questionTexts = parsed.questions.map((q: { question: string, type: string }) => q.question);

    setQuestions(questionTexts);

    } catch (error) {
      console.error(error);
      toast('Server Error, Try Again!');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = () => {}

  return (
    <div>
      {loading ? (
        <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
          <Loader2Icon className='animate-spin' />
          <div>
            <h2 className='font-medium'>Generating Interview Questions</h2>
            <p className='text-primary'>Our AI is crafting personalized questions based on your job position</p>
          </div>
        </div>
      ) : (
        <div className='mt-5'>
          <h2 className='text-xl font-bold mb-3'>Generated Questions</h2>
          {questions?.length>0 && 
          <div className='p-5 border border-gray-300 rounded-xl flex flex-col gap-5'>
            {questions.map((item, index) => (
                <div key={index} className='p-3 border border-gray-200 rounded-xl'>
                    <h2 className='font-medium'>{item}</h2>
                </div>
            ))}
          </div>
          }

        </div>
      )}
      <div className='mt-10 flex justify-end'>
        <Button onClick={() => onFinish()}>Finish</Button>
      </div>
    </div>
  );
};

export default QuestionList;

