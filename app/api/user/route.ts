import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { name, email, image } = await request.json();
    await connectDB();
    await User.create({ name, email, image });
    return NextResponse.json({ message: "User Registered" }, { status: 201 });
}