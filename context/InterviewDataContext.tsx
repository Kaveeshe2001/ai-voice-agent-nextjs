import { createContext } from 'react';

interface InterviewContextType {
  interviewInfo: any;
  setInterviewInfo: React.Dispatch<React.SetStateAction<any>>;
}

export const InterviewDataContext = createContext<InterviewContextType>({
  interviewInfo: null,
  setInterviewInfo: () => {
    throw new Error("setInterviewInfo called outside of Provider");
  },
});
