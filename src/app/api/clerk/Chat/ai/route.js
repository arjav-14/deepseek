import { generateAIResponse } from '@/services/genai';
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/model/Chat";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }
// Log the userId for debugging
console.log("Authenticated userId:", userId);
        const body = await request.json();
        const { chatId, prompt } = body;

        if (!chatId || !prompt) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        await connectDB();
        const chat = await Chat.findOne({ _id: chatId, userId });

        if (!chat) {
            return NextResponse.json({
                success: false,
                message: "Chat not found"
            }, { status: 404 });
        }

        const aiResponse = await generateAIResponse(prompt);
        if (!aiResponse.success) {
         
            return NextResponse.json({
                success: false,
                message: aiResponse.error
            }, { status: 500 });
        }
        

        chat.messages.push({
            role: 'user',
            content: prompt,
            timeStamp: new Date()
        }, {
            role: 'assistant',
            content: aiResponse.content,
            timeStamp: new Date()
        });

        chat.updatedAt = new Date();
        await chat.save();

        return NextResponse.json({
            success: true,
            data: {
                content: aiResponse.content,
                role: 'assistant',
                timeStamp: new Date()
            }
        });

    } catch (error) {
        console.error("AI response error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to generate response"
        }, { status: 500 });
    }
}