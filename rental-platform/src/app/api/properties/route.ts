export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// GET: Fetch all properties
export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      properties,
    });
  } catch (error: any) {
    console.error("GET Properties Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// POST: Create a new property (Admin Only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

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
    const {
      title,
      category,
      price,
      location,
      available,
      availableDays,
      beds,
      baths,
      sqft,
      image,
      description,
      dimensions,
      utilities,
      petPolicy,
    } = body;

    // Simple validation
    if (!title || !category || !price) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: title, category, price." },
        { status: 400 }
      );
    }

    const newProperty = await Property.create({
      title,
      category,
      price: Number(price),
      location: location || "Metro City",
      available: available ?? true,
      availableDays: Number(availableDays || 0),
      beds: Number(beds || 0),
      baths: Number(baths || 0),
      sqft: Number(sqft || 0),
      image: image || "/urban-apartments.png",
      description: description || "",
      dimensions: dimensions || {
        bedrooms: "1 Bed",
        bathrooms: "1 Bath",
        totalArea: `${sqft || 0} sqft`,
        ceilings: "9 ft",
        balcony: "N/A",
      },
      utilities: utilities || [],
      petPolicy: petPolicy || "No pets allowed.",
    });

    return NextResponse.json({
      success: true,
      message: "Property created successfully!",
      property: newProperty,
    });
  } catch (error: any) {
    console.error("POST Property Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create property",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}