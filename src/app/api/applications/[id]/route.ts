import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";
import Notification from "@/models/Notification";
import { verifyAdminSession } from "@/lib/adminAuth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// PATCH: Update application status (Admin Only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Verify Admin session and permissions
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session missing or invalid." },
        { status: 401 }
      );
    }

    if (admin.role !== "super_admin" && !admin.permissions?.manageApplications) {
      return NextResponse.json(
        { success: false, message: "Forbidden. You do not have permission to review applications." },
        { status: 403 }
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

    // Create notification for status update
    try {
      let notifType: "info" | "success" | "warning" | "danger" = "info";
      let notifTitle = "Application Update";
      let notifMessage = `Your tenancy application for "${updatedApplication.propertyName}" (ID: ${updatedApplication.applicationId}) is now under review.`;

      if (status === "Approved") {
        notifType = "success";
        notifTitle = "Application Approved!";
        notifMessage = `Congratulations! Your tenancy application for "${updatedApplication.propertyName}" (ID: ${updatedApplication.applicationId}) has been approved.`;
      } else if (status === "Rejected") {
        notifType = "warning";
        notifTitle = "Application Update";
        notifMessage = `Your tenancy application for "${updatedApplication.propertyName}" (ID: ${updatedApplication.applicationId}) was not approved. Please contact our support team for feedback.`;
      }

      await Notification.create({
        userId: updatedApplication.userId,
        email: updatedApplication.email.toLowerCase(),
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        link: "/profile",
      });
    } catch (notifErr) {
      console.error("Failed to create notification on application status patch:", notifErr);
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
