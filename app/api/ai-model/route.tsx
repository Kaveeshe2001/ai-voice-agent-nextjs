import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { jobPosition, jobDescription, duration, type } = await req.json();

  const FINAL_PROMPT = `${QUESTIONS_PROMPT
    .replace('{{jobPosition}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{type}}', type)}
  
  Please reply ONLY in the following strict JSON format:
  {
    "questions": [
      "Question 1 here...",
      "Question 2 here...",
      "Question 3 here..."
    ]
  }`;

  console.log(FINAL_PROMPT);

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: FINAL_PROMPT }]
    });

    if (!completion.choices || completion.choices.length === 0) {
        console.error("❌ No choices returned from AI completion");
        return NextResponse.json({ error: "No choices returned from AI" });
    }

    console.log(completion.choices[0].message);

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
