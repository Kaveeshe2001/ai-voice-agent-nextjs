"use client"

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InterviewType } from '@/services/Constants';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type FormContainerProps = {
  onHandleInputChange: (field: string, value: string) => void;
};

const FormContainer: React.FC<FormContainerProps> = ({ onHandleInputChange }) => {
  const [interviewType, setInterviewType] = useState<string[]>([]);

  useEffect(() => {
    if (interviewType) {
      onHandleInputChange('type', interviewType.join(', ')); // convert array to string
    }
  }, [interviewType]);

  const AddInterviewType = (type: string) => {
    const isSelected = interviewType.includes(type);
    if (!isSelected) {
      setInterviewType((prev) => [...prev, type]); 
    } else {
      const result = interviewType.filter((item) => item !== type);
      setInterviewType(result);
    }
  };

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm">
      {/* Job Position */}
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          onChange={(event) => onHandleInputChange('jobPosition', event.target.value)}
        />
      </div>

      {/* Job Description */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter detailed job description"
          className="mt-2 h-[200px]"
          onChange={(event) => onHandleInputChange('jobDescription', event.target.value)}
        />
      </div>

      {/* Interview Duration */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 Min</SelectItem>
            <SelectItem value="15 Min">15 Min</SelectItem>
            <SelectItem value="30 Min">30 Min</SelectItem>
            <SelectItem value="45 Min">45 Min</SelectItem>
            <SelectItem value="60 Min">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interview Type */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex gap-3 flex-wrap items-center mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex gap-2 p-1 px-2 bg-white border border-gray-300 rounded-2xl items-center cursor-pointer hover:bg-secondary
                ${interviewType.includes(type.title) ? 'bg-blue-100 text-primary' : ''}`}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <Button>
          Generate Question <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;
