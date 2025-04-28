import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/model/Chat";

export async function GET(req) {
    try {
        // Get auth token and verify user
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated"
            }, { status: 401 });
        }

        // Connect to database
        await connectDB();

        // Fetch all chats for the user
        const chats = await Chat.find({ userId })
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: chats
        });

    } catch (error) {
        console.error("Fetch chats error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Error fetching chats"
        }, { status: 500 });
    }
}