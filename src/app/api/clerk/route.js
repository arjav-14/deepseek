// import { Webhook } from "svix";
// import connectDB from "@/config/db";
// import User from "@/model/User";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const wh = new Webhook(process.env.SIGNING_SECRET);
//   const headerPayload = await headers();
//   const svixHeaders = {
//     "svix-id": headerPayload.get("svix-id"),
//     "svix-timestamp": headerPayload.get("svix-timestamp"),
//     "svix-signature": headerPayload.get("svix-signature"),
//   };

//   const payload = await req.json();
//   const body = JSON.stringify(payload);
//   const { data, type } = wh.verify(body, svixHeaders);

//   const userData = {
//     _id: data.id,
//     email: data.email_addresses[0].email_address,
//     name: `${data.first_name} ${data.last_name}`,
//     image: data.image_url,
//   };

//   await connectDB();

//   switch (type) {
//     case "user.created":
//       await User.create(userData);
//       break;
//     case "user.updated":
//       await User.findByIdAndUpdate(data.id, userData);
//       break;
//     case "user.deleted":
//       await User.findByIdAndDelete(data.id);
//       break;
//     default:
//       break;
//   }

//   return NextResponse.json({ message: "event received" });
// }
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/model/User";

export async function POST(req) {
  try {
    // Get the headers
    const headerPayload = headers();
    
    // Get the required SVIX headers
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are missing headers, return error
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Missing required headers", { status: 400 });
    }

    // Create the SVIX headers object
    const svixHeaders = {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    };

    // Get the webhook secret from environment variable
    const wh = new Webhook(process.env.SIGNING_SECRET);

    // Get the payload
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify the payload
    let evt;
    try {
      evt = wh.verify(body, svixHeaders);
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error verifying webhook", { status: 400 });
    }

    const { data, type } = evt;

    // Format user data
    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    // Connect to database
    await connectDB();

    // Handle different webhook events
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log("Unhandled webhook type:", type);
        break;
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}