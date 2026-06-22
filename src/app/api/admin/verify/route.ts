import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

import { verifyAdminSession } from "@/lib/adminAuth";

// GET: Verify admin token
export async function GET() {
  try {
    const admin = await verifyAdminSession();

    if (!admin) {
      return NextResponse.json({ authenticated: false, message: "Unauthorized or invalid session" }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, message: "Invalid or expired token" }, { status: 401 });
  }
}

// POST: Logout admin (clear cookie)
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
