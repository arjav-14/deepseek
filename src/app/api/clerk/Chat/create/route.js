import connectDB from "@/config/db";
import Chat from "@/model/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated"
            }, { status: 401 });
        }

        await connectDB();
        
        const chat = await Chat.create({
            userId,
            messages: [],
            name: "New Chat",
            updatedAt: new Date()
        });

        return NextResponse.json({
            success: true,
            data: chat,
            message: "Chat created successfully"
        });

    } catch (error) {
        console.error("Create chat error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}