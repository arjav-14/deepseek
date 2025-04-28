import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Chat from '@/model/Chat';

export async function POST(req) {
    try {
        const { userId } = auth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: "user not authenticated" });
        }

        const { chatId, messages } = await req.json();

        await connectDB();
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { messages },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: "Chat updated",
            chat: updatedChat,
        });
    } catch (error) {
        console.error('Chat update error:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
} 