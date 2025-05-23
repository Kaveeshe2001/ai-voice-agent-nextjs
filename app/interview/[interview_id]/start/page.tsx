"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface InterviewFeedbackProps {
  userName: string;
  userEmail: string;
  interview_id: string;
  feedback: string[];
  recommended: boolean;
}

const StartInterview = () => {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapiRef = useRef<Vapi | null>(null);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState<any>(null);
  const [callActive, setCallActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewFeedbackProps | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { interview_id } = useParams();

  // Initialize Vapi instance
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
    }

    const vapi = vapiRef.current;

    // Vapi Event listeners
    vapi.on("call-start", () => {
      console.log("Call has started.");
      toast.success("Call Connected...");
      setCallActive(true);
    });

    vapi.on("speech-start", () => {
      setActiveUser(false);
    });

    vapi.on("speech-end", () => {
      setActiveUser(true);
    });

    vapi.on("call-end", () => {
      console.log("Call has ended.");
      toast.info("Interview Ended...");
      setCallActive(false);
      GenerateFeedback();
    });

    vapi.on("message", (message) => {
      console.log("Received message:", message);
      setConversation(message?.conversation);
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (callActive) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0); // Reset timer when call ends
    }

    return () => clearInterval(timer);
  }, [callActive]);

  // Convert seconds to HH.MM.SS format
  const formatTime = (totalSeconds: number) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}.${minutes}.${secs}`;
  };

  useEffect(() => {
    if (interviewInfo && vapiRef.current) {
      startCall();
    }
  }, [interviewInfo]);

  const startCall = () => {
    const vapi = vapiRef.current;
    if (!vapi || !interviewInfo) return;

    const questionList = (interviewInfo?.interviewData?.questionsList ?? [])
      .map((item: { question: string }) => item?.question)
      .join(', ');

    vapi.start({
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              You are an AI voice assistant conducting interviews.
              Your job is to ask candidates provided interview questions, assess their responses.
              Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
              "Hey there! I am Tescobit AI Recruiter. Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
              Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are
              the questions ask one by one:
              Questions: ${questionList}
              If the candidate struggles, offer hints or rephrase the question giving away the answer. Example:
              "Need a hint? Think about how React tracks component updates!"
              Provide brief, encouraging feedback after each answer. Example:
              "Nice! That's a solid answer."
              "Hmm, not quite! Want to try again?"
              Keep the conversation natural and engaging-use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
              After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
              "That was great! You handled some tough questions well. Keep sharpening your skills!"
              End on a positive note:
              "Thanks for chatting with Tescobit AI Recruiter! Hope to see you crushing projects soon!"
              Key Guidelines:
                Be friendly, engaging, and witty,
                Keep responses short and natural, like a real conversation,
                Adapt based on the candidate's confidence level,
                Ensure the interview remains focused on React
            `.trim(),
          },
        ],
      },
      clientMessages: [],
      serverMessages: [],
    });
  };

  const stopInterview = () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    // Gracefully end the call
    vapi.say("Thank you for your time. Ending the interview now.", true);
  };

  const GenerateFeedback = async () => {
    if (!conversation) {
      toast.error("No conversation data available to generate feedback.");
      return;
    }

    try {
      const result = await axios.post('/api/ai-feedback', {
        conversation: conversation,
      });

      const Content = result.data?.content;
      if (!Content) {
        toast.error("AI did not return valid content. Try again.");
        return;
      }

      const FINAL_CONTENT = Content.replace(/```json\n?/, '').replace(/```/, '').trim();
      console.log("Final cleaned JSON string:", FINAL_CONTENT);

      const parsedFeedback = JSON.parse(FINAL_CONTENT);

      const feedbackData: InterviewFeedbackProps = {
        interview_id: interview_id as string,
        userName: interviewInfo?.userName || '',
        userEmail: interviewInfo?.userEmail || '',
        feedback: parsedFeedback.feedback,
        recommended: parsedFeedback.recommended,
      };

      setInterviewFeedback(feedbackData);
      console.log("Final feedback stored:", feedbackData);

    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate or parse interview feedback.");
    }
  };

  useEffect(() => {
    GetInterviewFeedbacks();
  }, []);

  const GetInterviewFeedbacks = async () => {
    try {
      const res = await fetch("/api/interview-feedback", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      console.log("Fetched feedback data:", data);

      setInterviewFeedback(data.interviewFeedback);

      if (!data.interviewFeedback) {
        toast.info('No interview feedback found.');
      }
    } catch (error) {
      console.error("Error fetching interview feedback:", error);
      toast.error('Failed to load interview feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
        <span className="flex items-center gap-2">
          <Timer />
          {formatTime(seconds)}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] flex flex-col gap-3 items-center justify-center rounded-lg border">
          <div className="relative">
            {!activeUser && <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />}
            <Image
              src={"/ai.jpg"}
              alt="ai"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </div>
          <h2>AI Recruiter</h2>
        </div>
        <div className="bg-white h-[400px] flex flex-col gap-3 items-center justify-center rounded-lg border">
          <div className="relative">
            {activeUser && <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">
              {interviewInfo?.userName?.[0] || ""}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 mt-7">
        <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
        <AlertConfirmation stopInterview={stopInterview}>
          <Phone className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer" />
        </AlertConfirmation>
      </div>
      <h2 className="mt-5 text-sm text-gray-400 text-center">
        {callActive ? "Interview in progress..." : "Interview ended."}
      </h2>
    </div>
  );
};

export default StartInterview;
