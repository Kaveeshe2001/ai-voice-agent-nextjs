import { connectDB } from '@/lib/db';
import Interview from '@/models/interviews';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      jobPosition,
      jobDescription,
      duration,
      type,
      questionsList,
      userEmail 
    } = body;

    const newInterview = await Interview.create({
      jobPosition,
      jobDescription,
      duration,
      type,
      questionsList,
      userEmail 
    });

    return NextResponse.json({ success: true, interview: newInterview }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { interview_id: string } }) {
  try {
    console.log("Received interview_id:", params.interview_id);
    await connectDB();

    const interview = await Interview.findById(params.interview_id);

    console.log("MongoDB interview found:", interview);

    if (!interview) {
      return NextResponse.json({ success: false, message: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, interview }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
