import { connectDB } from "@/lib/db";
import InterviewFeedback from "@/models/interview-feedback";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const newFeedback = await InterviewFeedback.create(body);
    return NextResponse.json({ success: true, data: newFeedback });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to save feedback" }, { status: 500 });
  }
}
