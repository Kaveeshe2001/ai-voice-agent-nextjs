import React, { ReactNode } from 'react'
import InterviewHeader from './_components/InterviewHeader';

interface InterviewLayoutProps {
    children: ReactNode;
}

const InterviewLayout = ({ children }: InterviewLayoutProps) => {
  return (
    <div className='bg-secondary'>
      <InterviewHeader />
      { children }
    </div>
  )
}

export default InterviewLayout
