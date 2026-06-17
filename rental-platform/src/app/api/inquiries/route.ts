import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// GET: Retrieve all support inquiries (Admin Only)
export async function GET() {
  try {
    await connectDB();

    // Verify Admin JWT
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin token missing." },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid token." },
        { status: 401 }
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
