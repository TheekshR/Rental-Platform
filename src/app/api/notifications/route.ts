import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Helper to verify customer token and return decoded payload
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}

// GET: Fetch all notifications for the logged-in customer
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    const notifications = await Notification.find({
      $or: [
        { userId: user.id },
        { email: user.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error: any) {
    console.error("GET notifications error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Mark a specific notification or all notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { notificationId, all } = body;

    await connectDB();

    const query: any = {
      $or: [
        { userId: user.id },
        { email: user.email.toLowerCase() }
      ]
    };

    if (all) {
      await Notification.updateMany(query, { $set: { read: true } });
    } else if (notificationId) {
      query._id = notificationId;
      await Notification.updateOne(query, { $set: { read: true } });
    } else {
      return NextResponse.json(
        { success: false, message: "Missing parameter: notificationId or all." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read successfully.",
    });
  } catch (error: any) {
    console.error("PATCH notifications error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notifications", error: error.message },
      { status: 500 }
    );
  }
}
