import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import AdminNotification from "@/models/AdminNotification";
import { verifyAdminSession } from "@/lib/adminAuth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// GET: Retrieve all support inquiries (Admin Only)
export async function GET() {
  try {
    await connectDB();

    // Verify Admin session and permissions
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session missing or invalid." },
        { status: 401 }
      );
    }

    if (admin.role !== "super_admin" && !admin.permissions?.viewInquiries) {
      return NextResponse.json(
        { success: false, message: "Forbidden. You do not have permission to view inquiries." },
        { status: 403 }
      );
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error: any) {
    console.error("GET Inquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Log a support inquiry
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, email, inquiryType, message } = body;

    if (!fullName || !email || !inquiryType || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const newInquiry = await Inquiry.create({
      fullName,
      email,
      inquiryType,
      message,
      status: "New",
    });

    // Create admin notification
    try {
      await AdminNotification.create({
        title: "New Support Inquiry",
        message: `New "${inquiryType}" support inquiry received from ${fullName}.`,
        type: "info",
        link: "/admin/dashboard",
      });
    } catch (adminNotifErr) {
      console.error("Failed to create admin notification for inquiry:", adminNotifErr);
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry logged successfully!",
      inquiry: newInquiry,
    });
  } catch (error: any) {
    console.error("POST Inquiry error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to log inquiry", error: error.message },
      { status: 500 }
    );
  }
}
