import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET() {
  try {
    await connectDB();

    const properties = await Property.find();

    return NextResponse.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
      },
      {
        status: 500,
      }
    );
  }
}