import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {

    const { conversation } = await req.json();
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

    try {
        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
        });
    
        const completion = await openai.chat.completions.create({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [{ role: "user", content: FINAL_PROMPT }]
        });
    
        if (!completion.choices || completion.choices.length === 0) {
            console.error("No choices returned from AI completion");
            return NextResponse.json({ error: "No choices returned from AI" });
        }
    
        console.log(completion.choices[0].message);
    
        return NextResponse.json(completion.choices[0].message);
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
      }
}