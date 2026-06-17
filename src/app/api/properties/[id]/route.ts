import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// GET: Fetch a single property details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error: any) {
    console.error("GET Property details error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch property", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update property details (Admin Only)
export async function PUT(
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

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Property updated successfully!",
      property: updatedProperty,
    });
  } catch (error: any) {
    console.error("PUT Property update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update property", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a property listing (Admin Only)
export async function DELETE(
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

    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully!",
    });
  } catch (error: any) {
    console.error("DELETE Property error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete property", error: error.message },
      { status: 500 }
    );
  }
}
