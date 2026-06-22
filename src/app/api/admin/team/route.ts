import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// GET: Retrieve all team member accounts
export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden. Super Admin access required." }, { status: 403 });
    }

    await connectDB();
    const team = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error: any) {
    console.error("GET admin team error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team members", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new team member account
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden. Super Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { username, password, role, permissions } = body;

    if (!username || !password || !role) {
      return NextResponse.json({ success: false, message: "Username, password, and role are required." }, { status: 400 });
    }

    await connectDB();

    // Check if username already exists
    const existing = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, message: "Admin username is already taken." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeamMember = await Admin.create({
      username: username.trim().toLowerCase(),
      password: hashedPassword,
      role,
      permissions: permissions || {
        manageProperties: role === "manager",
        manageApplications: role === "manager",
        viewInquiries: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Team member registered successfully!",
      member: {
        _id: newTeamMember._id,
        username: newTeamMember.username,
        role: newTeamMember.role,
        permissions: newTeamMember.permissions,
        createdAt: newTeamMember.createdAt,
      },
    });
  } catch (error: any) {
    console.error("POST admin team error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register team member", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a team member's role and permissions (or credentials)
export async function PUT(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden. Super Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, username, password, role, permissions } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Team member ID is required." }, { status: 400 });
    }

    await connectDB();

    const member = await Admin.findById(id);
    if (!member) {
      return NextResponse.json({ success: false, message: "Team member not found." }, { status: 404 });
    }

    // Update username if provided and different
    if (username && username.trim().toLowerCase() !== member.username) {
      const existingConflict = await Admin.findOne({
        username: username.trim().toLowerCase(),
        _id: { $ne: id },
      });
      if (existingConflict) {
        return NextResponse.json({ success: false, message: "Username is already taken by another account." }, { status: 400 });
      }
      member.username = username.trim().toLowerCase();
    }

    // Update password if provided
    if (password && password.trim()) {
      member.password = await bcrypt.hash(password.trim(), 10);
    }

    // Update role and permissions (Cannot change own role from super_admin to prevent lockout)
    if (member._id.toString() !== admin._id.toString()) {
      if (role) member.role = role;
      if (permissions) member.permissions = permissions;
    } else {
      // If updating self, role must remain super_admin
      if (role && role !== "super_admin") {
        return NextResponse.json({ success: false, message: "You cannot change your own super admin role." }, { status: 400 });
      }
      if (permissions) member.permissions = permissions;
    }

    await member.save();

    return NextResponse.json({
      success: true,
      message: "Team member account updated successfully!",
      member: {
        _id: member._id,
        username: member.username,
        role: member.role,
        permissions: member.permissions,
        updatedAt: member.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("PUT admin team error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update team member account", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove a team member
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden. Super Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("id");

    if (!memberId) {
      return NextResponse.json({ success: false, message: "Missing parameter: id" }, { status: 400 });
    }

    // Prevent deleting self
    if (memberId === admin._id.toString()) {
      return NextResponse.json({ success: false, message: "You cannot delete your own super admin account." }, { status: 400 });
    }

    await connectDB();
    const deleted = await Admin.findByIdAndDelete(memberId);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Team member not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE admin team error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete team member", error: error.message },
      { status: 500 }
    );
  }
}
