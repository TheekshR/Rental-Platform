import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// GET: Fetch applications for the logged-in customer
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Token missing." },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid token." },
        { status: 401 }
      );
    }

    await connectDB();

    // Find applications linked to this user's ID, or failing that, matching their email
    const applications = await Application.find({
      $or: [
        { userId: decoded.id },
        { email: decoded.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error("GET my applications error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications", error: error.message },
      { status: 500 }
    );
  }
}
