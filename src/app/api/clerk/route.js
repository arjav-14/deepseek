import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/model/User";

export async function POST(req) {
  try {
    const WEBHOOK_SECRET = process.env.SIGNING_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('Missing SIGNING_SECRET');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return new NextResponse('Missing svix headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new NextResponse('Error verifying webhook', { status: 400 });
    }

    const { data, type } = evt;

    await connectDB();

    // Format user data
    const userData = {
      _id: data.id,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      email: data.email_addresses[0]?.email_address,
      image: data.image_url,
    };

    console.log('Processing webhook:', type, userData);

    try {
      switch (type) {
        case "user.created":
          await User.create(userData);
          console.log('User created:', userData._id);
          break;
        case "user.updated":
          await User.findByIdAndUpdate(data.id, userData, { upsert: true });
          console.log('User updated:', userData._id);
          break;
        case "user.deleted":
          await User.findByIdAndDelete(data.id);
          console.log('User deleted:', data.id);
          break;
        default:
          console.log('Unhandled webhook type:', type);
      }
    } catch (error) {
      console.error('Database operation failed:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Webhook processed: ${type}`
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}