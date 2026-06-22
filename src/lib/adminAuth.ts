import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function verifyAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return null;

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }

    if (!decoded || !decoded.id) return null;

    await connectDB();
    const admin = await Admin.findById(decoded.id);
    if (!admin) return null;

    // Fallback for older database records lacking the role or permissions fields (or if admin@rentora.com needs super_admin status forced)
    if (!admin.role || admin.username === "admin@rentora.com") {
      admin.role = admin.username === "admin@rentora.com" ? "super_admin" : "team_member";
    }
    if (!admin.permissions || typeof admin.permissions.manageProperties === "undefined" || admin.username === "admin@rentora.com") {
      admin.permissions = {
        manageProperties: admin.role === "super_admin" || admin.role === "manager",
        manageApplications: admin.role === "super_admin" || admin.role === "manager",
        viewInquiries: true
      };
    }

    return admin;
  } catch (error) {
    console.error("Admin verification helper error:", error);
    return null;
  }
}
