import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// PUT: Update customer profile details
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized. Token missing." }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Unauthorized. Invalid token." }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, phone } = body;

    if (!fullName || !email) {
      return NextResponse.json({ success: false, message: "Full Name and Email are required." }, { status: 400 });
    }

    await connectDB();

    // Check if the new email is already in use by someone else
    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower, _id: { $ne: decoded.id } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "This email address is already in use." }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        $set: {
          fullName,
          email: emailLower,
          phone: phone || "",
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Sign a new token with updated email in case it changed
    const newToken = jwt.sign(
      { id: updatedUser._id, email: updatedUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set updated cookie
    cookieStore.set("user_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}
