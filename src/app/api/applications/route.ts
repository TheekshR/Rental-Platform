import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";
import Property from "@/models/Property";
import Notification from "@/models/Notification";
import AdminNotification from "@/models/AdminNotification";
import { verifyAdminSession } from "@/lib/adminAuth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// GET: Fetch all tenancy applications (Admin Only)
export async function GET() {
  try {
    await connectDB();

    // Verify Admin session
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session missing or invalid." },
        { status: 401 }
      );
    }

    const applications = await Application.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error("GET Applications error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Submit a tenancy application
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Verify User JWT
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in to submit a tenancy application." },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid session, please log in again." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fullName, email, employmentStatus, annualIncome, moveInDate, propertyId } = body;

    // 1. Check required fields
    if (!fullName || !email || !employmentStatus || !annualIncome || !moveInDate || !propertyId) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // 2. Load property from DB to get correct title and price
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, message: "The selected property was not found in our database." },
        { status: 404 }
      );
    }

    // 3. Validation: Move-in date must be a future date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(moveInDate);
    if (selectedDate <= today) {
      return NextResponse.json(
        { success: false, message: "Move-in date must be a future date." },
        { status: 400 }
      );
    }

    // 4. Validation: Annual income must be at least 30x the monthly rent
    const requiredMinIncome = property.price * 30;
    if (Number(annualIncome) < requiredMinIncome) {
      return NextResponse.json(
        {
          success: false,
          message: `Annual income does not meet constraint. Minimum required is $${requiredMinIncome.toLocaleString()} (30x monthly rent).`,
        },
        { status: 400 }
      );
    }

    // 5. Generate unique applicationId
    const appId = `APP-${Math.floor(100000 + Math.random() * 900000)}`;

    // 6. Create the application
    const newApplication = await Application.create({
      fullName,
      email,
      employmentStatus,
      annualIncome: Number(annualIncome),
      moveInDate: selectedDate,
      propertyId: property._id,
      propertyName: property.title,
      propertyPrice: property.price,
      status: "Under Review",
      applicationId: appId,
      userId: decoded.id,
    });

    // 7. Create a notification for the user
    try {
      await Notification.create({
        userId: decoded.id,
        email: email.toLowerCase(),
        title: "Application Submitted",
        message: `Your tenancy application for "${property.title}" (ID: ${appId}) was submitted successfully and is currently under review.`,
        type: "info",
        link: "/profile",
      });
    } catch (notifErr) {
      console.error("Failed to create notification on application submission:", notifErr);
      // Don't fail the submission if notifications fail
    }

    // Create notification for admin
    try {
      await AdminNotification.create({
        title: "New Tenancy Application",
        message: `A new application (${appId}) was submitted by ${fullName} for property "${property.title}".`,
        type: "info",
        link: "/admin/dashboard",
      });
    } catch (adminNotifErr) {
      console.error("Failed to create admin notification on submission:", adminNotifErr);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      application: newApplication,
    });
  } catch (error: any) {
    console.error("POST Application error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit tenancy application", error: error.message },
      { status: 500 }
    );
  }
}
