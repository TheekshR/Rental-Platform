"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

// Mock database matching the directory listings (used as fallback)
const propertiesDatabase = [
  {
    id: "1",
    title: "Skyline Premium Suite",
    category: "Apartment",
    price: 1850,
    location: "Downtown, Metro City",
    available: true,
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
    id: "2",
    title: "Urban Loft Studio",
    category: "Studio",
    price: 950,
    location: "Brooklyn, New York",
    available: true,
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
    id: "3",
    title: "Metro Hub Headquarters",
    category: "Office",
    price: 3400,
    location: "Downtown, Chicago",
    available: false,
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
    id: "4",
    title: "Oakwood Heights Villa",
    category: "Villa",
    price: 4900,
    location: "Beverly Hills, California",
    available: true,
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
    id: "5",
    title: "Waterfront Vista Apartment",
    category: "Apartment",
    price: 2200,
    location: "Riverfront, Seattle",
    available: true,
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
    id: "6",
    title: "Silicon Square Tech Suite",
    category: "Office",
    price: 2800,
    location: "Silicon Valley, California",
    available: true,
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

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const propertyId = resolvedParams.id;

  const [property, setProperty] = useState<typeof propertiesDatabase[0] | null>(null);
  const [activeTab, setActiveTab] = useState("dimensions"); // tabs: dimensions, utilities, policies
  const [loading, setLoading] = useState(true);

  // Upfront Moving Cost Calculator States
  const [depositMultiplier, setDepositMultiplier] = useState(1); // 1x, 1.5x, 2x
  const [hasPet, setHasPet] = useState(false);
  const [extraKeys, setExtraKeys] = useState(1);
  const [movingDistance, setMovingDistance] = useState(10); // in miles

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      const startTime = Date.now();
      let fetchedProperty = null;
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        const data = await res.json();
        if (data.success && data.property) {
          const prop = data.property;
          fetchedProperty = {
            id: prop._id,
            title: prop.title,
            category: prop.category,
            price: prop.price,
            location: prop.location || "Metro City",
            available: prop.available,
            beds: prop.beds ?? 0,
            baths: prop.baths ?? 0,
            sqft: prop.sqft ?? 0,
            image: prop.image || "/urban-apartments.png",
            description: prop.description || "",
            dimensions: prop.dimensions || {
              bedrooms: "1 Bed",
              bathrooms: "1 Bath",
              totalArea: `${prop.sqft ?? 0} sqft`,
              ceilings: "9 ft",
              balcony: "N/A"
            },
            utilities: prop.utilities && prop.utilities.length > 0 ? prop.utilities : [
              "High-speed Wi-Fi: Included",
              "Electricity: Sub-metered",
              "Water: Fixed rate $30/mo"
            ],
            petPolicy: prop.petPolicy || "Pets allowed under general terms."
          };
        }
      } catch (err) {
        console.log("Failed to fetch property details, trying fallback", err);
      }

      if (fetchedProperty) {
        setProperty(fetchedProperty);
      } else {
        // Try local fallback
        const found = propertiesDatabase.find((p) => p.id === propertyId);
        if (found) {
          setProperty(found);
        }
      }

      // Enforce a minimum 600ms loading delay for animation smoothness
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 600 - elapsedTime);
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
    loadProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <LoadingSpinner message="Loading property details..." />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-950">Property Not Found</h2>
        <p className="text-zinc-500 text-sm">The property you are looking for does not exist or has been removed.</p>
        <Link
          href="/listings"
          className="inline-block px-5 py-2.5 bg-amber-500 text-white rounded-full text-xs font-semibold hover:bg-amber-600"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  // Financial calculations based on state and database properties
  const monthlyRent = property.price;
  const securityDeposit = monthlyRent * depositMultiplier;
  const cleaningFee = Math.round(property.sqft * 0.15); // $0.15 per sqft
  const keysDeposit = extraKeys * 25; // $25 deposit per key
  const petDeposit = hasPet ? 250 : 0; // $250 pet deposit
  const logisticsBase = 50; // $50 flat truck rental base
  const logisticsDistanceCost = movingDistance * 2.5; // $2.50 per mile
  const totalLogistics = logisticsBase + logisticsDistanceCost;

  // Upfront Total = Rent + Deposit + Cleaning + Keys + Pet + Logistics
  const totalUpfrontCost = monthlyRent + securityDeposit + cleaningFee + keysDeposit + petDeposit + totalLogistics;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-12">
      {/* Back Button */}
      <Link
        href="/listings"
        className="inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-amber-500 mb-8 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to listings directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery & Main info (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Image */}
          <div className="overflow-hidden rounded-3xl bg-zinc-100 shadow-sm aspect-[16/10]">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Heading and details */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {property.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white ${
                property.available ? "bg-emerald-600" : "bg-amber-600"
              }`}>
                {property.available ? "Available Now" : "Currently Occupied"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white sm:text-4xl tracking-tight">
              {property.title}
            </h1>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 flex items-center gap-1 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {(property as any).location || "Metro City"}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Tabbed Info Panel */}
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm">
            {/* Tabs Selector Bar */}
            <div className="flex border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
              <button
                onClick={() => setActiveTab("dimensions")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === "dimensions"
                    ? "border-amber-500 text-amber-500 bg-white dark:bg-zinc-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Structure Dimensions
              </button>
              <button
                onClick={() => setActiveTab("utilities")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === "utilities"
                    ? "border-amber-500 text-amber-500 bg-white dark:bg-zinc-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Utility List
              </button>
              <button
                onClick={() => setActiveTab("policies")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === "policies"
                    ? "border-amber-500 text-amber-500 bg-white dark:bg-zinc-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Pet Policies
              </button>
            </div>

            {/* Tabs Content Panel */}
            <div className="p-6">
              {/* Tab 1: Dimensions */}
              {activeTab === "dimensions" && property.dimensions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl space-y-1">
                    <p className="text-zinc-400 font-semibold uppercase">Bedrooms</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-200">{property.dimensions.bedrooms}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl space-y-1">
                    <p className="text-zinc-400 font-semibold uppercase">Bathrooms</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-200">{property.dimensions.bathrooms}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl space-y-1">
                    <p className="text-zinc-400 font-semibold uppercase">Total Area</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-200">{property.dimensions.totalArea}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl space-y-1">
                    <p className="text-zinc-400 font-semibold uppercase">Ceiling Height</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-200">{property.dimensions.ceilings}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl sm:col-span-2 space-y-1">
                    <p className="text-zinc-400 font-semibold uppercase">Balcony / Outdoor Area</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-200">{property.dimensions.balcony}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Utilities */}
              {activeTab === "utilities" && property.utilities && (
                <ul className="space-y-3">
                  {property.utilities.map((util, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      <span className="text-amber-500 font-bold">✓</span>
                      {util}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tab 3: Pet Policies */}
              {activeTab === "policies" && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-200">
                    🐾 <p>Standard Tenancy Agreement Rules</p>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {property.petPolicy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Price, Quick Apply & Upfront Moving Cost Calculator (5 Columns) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Apply Box */}
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lease Pricing</span>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-zinc-950 dark:text-white">
                  ${property.price}
                </p>
                <p className="text-zinc-500 text-sm font-semibold">/ month</p>
              </div>
            </div>

            <div className="border-t border-zinc-50 dark:border-zinc-900 pt-6 space-y-4 text-xs font-semibold">
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Property Size</span>
                <span>{property.sqft} sqft</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Rooms layout</span>
                <span>{property.beds} Bed / {property.baths} Bath</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Lock-in Period</span>
                <span>Minimum 6 Months</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Security Deposit</span>
                <span>{depositMultiplier}x Rent (${securityDeposit.toLocaleString()})</span>
              </div>
            </div>

            <Link
              href={`/apply?propertyId=${property.id}&name=${encodeURIComponent(property.title)}&price=${property.price}`}
              className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm shadow-amber-500/10 active:scale-98 transition-all text-xs cursor-pointer"
            >
              Apply to Rent Immediately
            </Link>

            <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900/30 text-[10px] text-zinc-500 leading-relaxed font-medium">
              ⚠️ By submitting an application, you agree to undergo credit evaluation and reference screening as outlined in our general rental terms.
            </div>
          </div>

          {/* Upfront & Moving Cost Calculator Widget */}
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
            <div>
              <h3 className="text-md font-bold text-zinc-950 dark:text-white tracking-tight">
                Upfront & Moving Cost Calculator
              </h3>
              <p className="text-[11px] text-zinc-400">
                Estimate signing fees and logistics costs in real-time.
              </p>
            </div>

            <div className="space-y-4 border-t border-zinc-50 dark:border-zinc-900 pt-4 text-xs">
              {/* Security Deposit Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                  Security Deposit Term
                </label>
                <div className="flex gap-2">
                  {[1, 1.5, 2].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDepositMultiplier(val)}
                      className={`flex-1 py-2 rounded-xl border font-bold transition-all text-center cursor-pointer ${
                        depositMultiplier === val
                          ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {val}x Rent
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Keys & Pets Checkboxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                    Extra Keys (+$25/ea)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={extraKeys}
                    onChange={(e) => setExtraKeys(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-end pb-2.5">
                  <label className="inline-flex items-center gap-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPet}
                      onChange={(e) => setHasPet(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-zinc-300 text-amber-500 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Has Pets? (+$250)
                    </span>
                  </label>
                </div>
              </div>

              {/* Moving Distance Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-zinc-700 dark:text-zinc-300">
                  <span>Moving Distance</span>
                  <span className="text-amber-500 font-extrabold">{movingDistance} miles</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={movingDistance}
                  onChange={(e) => setMovingDistance(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-100 rounded-lg appearance-none dark:bg-zinc-800"
                />
                <p className="text-[10px] text-zinc-400">
                  Truck lease calculated at $50 base + $2.50 per mile.
                </p>
              </div>

              {/* Costs Breakdown */}
              <div className="border-t border-dashed border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-zinc-500">
                <div className="flex justify-between items-center text-[11px]">
                  <span>First Month's Rent</span>
                  <span className="text-zinc-900 dark:text-zinc-300 font-semibold">${monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Refundable Security Deposit</span>
                  <span className="text-zinc-900 dark:text-zinc-300 font-semibold">${securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Cleaning Setup Fee ($0.15/sqft)</span>
                  <span className="text-zinc-900 dark:text-zinc-300 font-semibold">${cleaningFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Key / Fob deposit (x{extraKeys})</span>
                  <span className="text-zinc-900 dark:text-zinc-300 font-semibold">${keysDeposit.toLocaleString()}</span>
                </div>
                {hasPet && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Pet Safety Deposit</span>
                    <span className="text-zinc-900 dark:text-zinc-300 font-semibold">${petDeposit.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[11px]">
                  <span>Moving Logistics (Truck + fuel)</span>
                  <span className="text-zinc-900 dark:text-zinc-300 font-semibold">${totalLogistics.toLocaleString()}</span>
                </div>

                {/* Total Upfront Costs display */}
                <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-3 text-xs font-bold text-zinc-950 dark:text-white bg-amber-500/5 dark:bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                  <div className="space-y-0.5">
                    <span>Estimated Upfront Cost</span>
                    <p className="text-[9px] text-zinc-400 font-normal leading-none">
                      Includes deposits, logistics, and cleaning.
                    </p>
                  </div>
                  <span className="text-lg font-extrabold text-amber-500">${totalUpfrontCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
