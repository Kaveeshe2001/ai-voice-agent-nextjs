"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

type FormDataType = {
  jobPosition?: string;
  jobDescription?: string;
  duration?: string;
  type?: string;
  [key: string]: string | undefined;
};

type QuestionListProps = {
  formData: FormDataType;
  onCreateLink?: () => void;
};

const QuestionList: React.FC<QuestionListProps> = ({ formData, onCreateLink }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const { data: session } = useSession();
  const [saveLoading, setSaveLoading] = useState(false);

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

    const Content = result.data?.content;
    if (!Content) {
      console.error("AI response missing 'content' field. Full response:", result.data);
      toast.error("AI did not return valid content. Try again.");
      return;
    }

    const FINAL_CONTENT = Content
      .replace(/```json\n?/, '')
      .replace(/```/, '')
      .trim();

    console.log("Final cleaned JSON string:", FINAL_CONTENT);

    let parsed;
    try {
      parsed = JSON.parse(FINAL_CONTENT);
    } catch (jsonError) {
      console.error("JSON parsing failed:", jsonError);
      toast.error("Failed to parse AI response. Try again.");
      return;
    }

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

  const onFinish = async () => {
    setSaveLoading(true);
    if (!formData.jobPosition || !formData.jobDescription || !formData.duration || !formData.type) {
      toast.error("Missing job form data.");
      return;
    }

    if (questions.length === 0) {
      toast.error("No questions generated to save.");
      return;
    }

    try {
      setLoading(true);

      // ✅ prepare final data
      const finalData = {
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        duration: formData.duration,
        type: formData.type,
        questionsList: questions,  
        userEmail: session?.user?.email,  
      };

      const response = await fetch("http://localhost:3000/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (response.status === 201) {
        toast.success("Interview saved successfully!");
      } else {
        toast.error("Error occurred while saving interview.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while saving interview.");
    } finally {
      setLoading(false);
    }
    setSaveLoading(false);

    onCreateLink?.();
  };

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
        <Button className='cursor-pointer' onClick={() => onFinish()} disabled={saveLoading}>
          {saveLoading && <Loader2 className='animate-spin'/>}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;

