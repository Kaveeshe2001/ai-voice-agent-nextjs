"use client";

import React, { ReactNode, useState } from 'react';
import InterviewHeader from './_components/InterviewHeader';
import { InterviewDataContext } from '@/context/InterviewDataContext';

interface InterviewLayoutProps {
  children: ReactNode;
}

const InterviewLayout = ({ children }: InterviewLayoutProps) => {
  const [interviewInfo, setInterviewInfo] = useState<any>(null); // added type
  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className="bg-secondary">
        <InterviewHeader />
        {children}
      </div>
    </InterviewDataContext.Provider>
  );
};

export default InterviewLayout;
