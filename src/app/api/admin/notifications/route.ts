import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdminNotification from "@/models/AdminNotification";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// GET: Fetch recent admin notifications
export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error: any) {
    console.error("GET admin notifications error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin notifications", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Mark a specific or all admin notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId, all } = body;

    await connectDB();

    if (all) {
      await AdminNotification.updateMany({ read: false }, { $set: { read: true } });
    } else if (notificationId) {
      await AdminNotification.findByIdAndUpdate(notificationId, { $set: { read: true } });
    } else {
      return NextResponse.json(
        { success: false, message: "Missing parameter: notificationId or all." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin notifications updated successfully.",
    });
  } catch (error: any) {
    console.error("PATCH admin notifications error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update admin notifications", error: error.message },
      { status: 500 }
    );
  }
}
