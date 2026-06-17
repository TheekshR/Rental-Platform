import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// PATCH: Update application status (Admin Only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

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

    const body = await req.json();
    const { status } = body;

    if (!status || !["Under Review", "Approved", "Rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid application status. Must be 'Under Review', 'Approved', or 'Rejected'." },
        { status: 400 }
      );
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Application status updated to '${status}' successfully!`,
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error("PATCH Application error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update application status", error: error.message },
      { status: 500 }
    );
  }
}
