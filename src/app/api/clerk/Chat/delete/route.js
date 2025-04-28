import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/model/Chat";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated"
            }, { status: 401 });
        }

        const { chatId } = await req.json();
        if (!chatId) {
            return NextResponse.json({
                success: false,
                message: "Chat ID is required"
            }, { status: 400 });
        }

        await connectDB();

        const deletedChat = await Chat.findOneAndDelete({
            _id: chatId,
            userId
        });

        if (!deletedChat) {
            return NextResponse.json({
                success: false,
                message: "Chat not found or unauthorized"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (error) {
        console.error("Delete chat error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Error deleting chat"
        }, { status: 500 });
    }
}