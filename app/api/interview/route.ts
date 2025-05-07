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
