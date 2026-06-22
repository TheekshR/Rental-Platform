export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

const propertiesData = [
  {
    title: "Skyline Premium Suite",
    category: "Apartment",
    price: 1850,
    location: "Downtown, Metro City",
    available: true,
    availableDays: 0,
    beds: 2,
    baths: 2,
    sqft: 1100,
    image: "/urban-apartments.png",
    description: "Modern downtown apartment overlooking the city skyline, equipped with high-speed internet and high-end styling.",
    dimensions: {
      bedrooms: "2 rooms (12' x 14' & 10' x 12')",
      bathrooms: "2 full baths with modern fixtures",
      totalArea: "1,100 sqft total indoor space",
      ceilings: "9.5 ft high plaster ceilings",
      balcony: "120 sqft private glass balcony",
    },
    utilities: [
      "High-speed fiber-optic Wi-Fi: Included in lease",
      "Electricity: Sub-metered (pay per monthly consumption)",
      "Water & Trash disposal: Fixed $35/month fee",
      "Air Conditioning: Smart thermostat-controlled central HVAC",
    ],
    petPolicy: "Cats allowed. Small dogs under 20 lbs welcome. $250 pet security deposit required.",
  },
  {
    title: "Urban Loft Studio",
    category: "Studio",
    price: 950,
    location: "Brooklyn, New York",
    available: true,
    availableDays: 0,
    beds: 1,
    baths: 1,
    sqft: 550,
    image: "/shared-studios.png",
    description: "Cozy brick-walled studio apartment with dedicated study workspace and laundry service included.",
    dimensions: {
      bedrooms: "Open floor plan loft layout",
      bathrooms: "1 full bath with standing shower",
      totalArea: "550 sqft optimized living space",
      ceilings: "11 ft industrial brick-exposed ceiling",
      balcony: "No private balcony (access to shared rooftop)",
    },
    utilities: [
      "Wi-Fi: Shared high-speed mesh network included",
      "Electricity & Water: Flat $75/month utilities package",
      "Laundry: In-building laundry machines (free of charge)",
      "Heating: Central radiator steam heating",
    ],
    petPolicy: "Cats and aquarium fish welcome. Dogs are unfortunately not permitted due to building zoning restrictions.",
  },
  {
    title: "Metro Hub Headquarters",
    category: "Office",
    price: 3400,
    location: "Downtown, Chicago",
    available: false,
    availableDays: 14,
    beds: 0,
    baths: 2,
    sqft: 2400,
    image: "/executive-offices.png",
    description: "Sleek, corporate office with high-end glass partitions and open layout. Perfect for small and medium teams.",
    dimensions: {
      bedrooms: "0 (Commercial office zone layout)",
      bathrooms: "2 communal restrooms inside suite",
      totalArea: "2,400 sqft open-plan corporate space",
      ceilings: "10 ft drop ceilings with LED panels",
      balcony: "Executive patio corner (180 sqft)",
    },
    utilities: [
      "Telecom: Fiber-optic backbone wiring ready to plug-in",
      "Power: Back-up generator connection integrated",
      "Cleaning: Daily cleaning crew services included in lease",
      "AC/Heat: Independent climate control zone settings",
    ],
    petPolicy: "Commercial office zone. Service animals only. General pets are prohibited.",
  },
  {
    title: "Oakwood Heights Villa",
    category: "Villa",
    price: 4900,
    location: "Beverly Hills, California",
    available: true,
    availableDays: 0,
    beds: 4,
    baths: 4,
    sqft: 3800,
    image: "/luxury-villas.png",
    description: "A gorgeous, private luxury villa featuring a private heated pool, automated electronics, and stunning garden.",
    dimensions: {
      bedrooms: "4 suites (Master suite has walk-in closet)",
      bathrooms: "4.5 baths (Master bathroom has soaking tub)",
      totalArea: "3,800 sqft masterfully crafted home",
      ceilings: "14 ft high vaulted cedar ceilings",
      balcony: "Wrap-around wooden deck and garden patio",
    },
    utilities: [
      "Wi-Fi: Custom home-automation network included",
      "Electricity & Gas: Billed directly by regional utility",
      "Pool Service: Weekly pool cleaning and chemical checks included",
      "Gardening: Bi-weekly lawn maintenance included",
    ],
    petPolicy: "All domestic pets welcome (dogs, cats, rabbits). No breed or weight restrictions. Garden is fully fenced.",
  },
  {
    title: "Waterfront Vista Apartment",
    category: "Apartment",
    price: 2200,
    location: "Riverfront, Seattle",
    available: true,
    availableDays: 0,
    beds: 3,
    baths: 2.5,
    sqft: 1450,
    image: "/urban-apartments.png",
    description: "Spacious riverside apartment with open layout kitchen and close proximity to public transit hubs.",
    dimensions: {
      bedrooms: "3 rooms (1 Master suite & 2 standard bedrooms)",
      bathrooms: "2.5 baths with contemporary stone floors",
      totalArea: "1,450 sqft riverfront views layout",
      ceilings: "9 ft ceilings with recessed lighting",
      balcony: "80 sqft private balcony overlooking the river",
    },
    utilities: [
      "Wi-Fi: Premium router setup (billed at $45/mo or opt-out)",
      "Electricity & Heat: Billed monthly by building management",
      "Water: Unlimited tap water included in rent",
      "AC: Living area has wall split-unit cooling",
    ],
    petPolicy: "Cats welcome. Dogs under 45 lbs accepted with an additional monthly pet fee of $25.",
  },
  {
    title: "Silicon Square Tech Suite",
    category: "Office",
    price: 2800,
    location: "Silicon Valley, California",
    available: true,
    availableDays: 0,
    beds: 0,
    baths: 1.5,
    sqft: 1800,
    image: "/executive-offices.png",
    description: "Modern professional co-working style office space equipped with full fiber-optic connection and utilities.",
    dimensions: {
      bedrooms: "0 (Commercial zoning layout)",
      bathrooms: "1 private restroom and kitchen sink",
      totalArea: "1,800 sqft functional modern workshop",
      ceilings: "12 ft industrial loft height ceilings",
      balcony: "Rooftop terrace shared lounge access",
    },
    utilities: [
      "Wi-Fi: Managed corporate fiber connection included",
      "Electricity: Sub-metered and billed at commercial rates",
      "Security: 24/7 keycard door access and security monitoring",
      "Heating: Smart infrared radiators installed",
    ],
    petPolicy: "Subject to commercial building guidelines. Friendly dogs allowed in private office on designated weekdays.",
  }
];

export async function GET() {
  try {
    await connectDB();

    // 1. Seed Properties
    await Property.deleteMany({});
    const seededProperties = await Property.insertMany(propertiesData);

    // 2. Seed Admin User
    await Admin.deleteMany({});
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const seededAdmin = await Admin.create({
      username: "admin@rentora.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: {
        manageProperties: true,
        manageApplications: true,
        viewInquiries: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seeded database successfully!",
      propertiesCount: seededProperties.length,
      admin: {
        username: seededAdmin.username,
      },
    });
  } catch (error: any) {
    console.error("Database seeding failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}