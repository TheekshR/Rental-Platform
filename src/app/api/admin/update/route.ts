import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    // 1. Get session token
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Session token missing." },
        { status: 401 }
      );
    }

    // 2. Decode and verify session token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid or expired session token." },
        { status: 401 }
      );
    }

    const adminId = decoded.id;

    // 3. Parse and validate body
    const body = await req.json();
    const { username, password } = body;

    if (!username || !username.trim()) {
      return NextResponse.json(
        { success: false, message: "Username cannot be empty." },
        { status: 400 }
      );
    }

    // 4. Find the admin in database
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin account not found." },
        { status: 404 }
      );
    }

    // 5. Check if the new username conflicts with another admin account
    const usernameConflict = await Admin.findOne({
      username: username.trim(),
      _id: { $ne: adminId },
    });

    if (usernameConflict) {
      return NextResponse.json(
        { success: false, message: "Username is already taken by another account." },
        { status: 400 }
      );
    }

    // 6. Update fields
    admin.username = username.trim();

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password.trim(), salt);
    }

    await admin.save();

    // 7. Sign a new JWT token with updated credentials
    const newToken = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 8. Set updated session cookie
    cookieStore.set("admin_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Admin credentials updated successfully!",
      username: admin.username,
    });
  } catch (error: any) {
    console.error("Admin credentials update error:", error);
    return NextResponse.json(
      { success: false, message: "Server error updating credentials.", error: error.message },
      { status: 500 }
    );
  }
}
