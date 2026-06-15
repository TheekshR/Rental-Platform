import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET() {
  try {
    await connectDB();

    const property = await Property.create({
      title: "Luxury Villa",
      category: "Villa",
      price: 2500,
      available: true,
    });

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}