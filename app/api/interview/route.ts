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

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const jobPosition = searchParams.get('jobPosition');

  try {
    const existingInterview = await Interview.findOne({ jobPosition });

    if (!existingInterview) {
      return Response.json({ success: false, message: 'Interview not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      _id: existingInterview._id.toString(), 
    });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
