import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Application from "@/models/Application";
import Notification from "@/models/Notification";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// GET: Retrieve all customer user accounts
export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden. Super Admin access required." }, { status: 403 });
    }

    await connectDB();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error("GET admin users error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user accounts", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a customer user account
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden. Super Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing parameter: id" }, { status: 400 });
    }

    await connectDB();

    // 1. Delete user applications
    await Application.deleteMany({ userId });

    // 2. Delete user notifications
    await Notification.deleteMany({ userId });

    // 3. Delete user account
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Customer user account and all associated applications/notifications deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE admin user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user account", error: error.message },
      { status: 500 }
    );
  }
}
