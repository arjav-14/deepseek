

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
                message: "Unauthorized"
            }, { status: 401 });
        }

        const { chatId, name } = await req.json();

        if (!chatId || !name) {
            return NextResponse.json({
                success: false,
                message: "Chat ID and name are required"
            }, { status: 400 });
        }

        await connectDB();

        const updatedChat = await Chat.findOneAndUpdate(
            { _id: chatId, userId },
            { 
                $set: { 
                    name: name,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updatedChat) {
            return NextResponse.json({
                success: false,
                message: "Chat not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Chat renamed successfully",
            data: updatedChat
        });

    } catch (error) {
        console.error("Rename error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Error renaming chat"
        }, { status: 500 });
    }
}