"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Predefined listings data (simulating a database fallback)
const fallbackProperties = [
  {
    id: "1",
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
  },
  {
    id: "2",
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
  },
  {
    id: "3",
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
  },
  {
    id: "4",
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
  },
  {
    id: "5",
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
  },
  {
    id: "6",
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
  }
];

function ListingsContent() {
  const searchParams = useSearchParams();
  
  // States to hold the current selected filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState(fallbackProperties);

  // Sync state with URL category and search parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("All");
    }

    const locationParam = searchParams.get("location");
    if (locationParam) {
      setSearchQuery(locationParam);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  // Attempt to fetch listings from local DB API, falling back to mock listings if it fails
  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        if (data.success && data.properties && data.properties.length > 0) {
          const apiMapped = data.properties.map((prop: any) => ({
            id: prop._id,
            title: prop.title,
            category: prop.category,
            price: prop.price,
            location: prop.location || "Metro City",
            available: prop.available ?? true,
            availableDays: prop.availableDays ?? (prop.available ? 0 : 7),
            beds: prop.beds ?? 0,
            baths: prop.baths ?? 0,
            sqft: prop.sqft ?? 0,
            image: prop.image || "/urban-apartments.png",
            description: prop.description || ""
          }));
          setProperties(apiMapped);
        }
      } catch (err) {
        console.log("Using local mock properties instead", err);
      }
    }
    loadProperties();
  }, []);

  const priceRangeQuery = searchParams.get("priceRange") || "";

  // Filter listings based on active pills and queries
  const filteredProperties = properties.filter((prop) => {
    // 1. Category Filter
    const categoryMatch = selectedCategory === "All" || prop.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // 2. Availability Filter
    const availabilityMatch = !showOnlyAvailable || prop.available;

    // 3. Search Query Filter (Matches title, location, or description)
    const matchesSearch = !searchQuery || 
      (prop as any).location?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prop.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 4. Price Filter
    let matchesPrice = true;
    if (priceRangeQuery === "0-1000") {
      matchesPrice = prop.price < 1000;
    } else if (priceRangeQuery === "1000-2500") {
      matchesPrice = prop.price >= 1000 && prop.price <= 2500;
    } else if (priceRangeQuery === "2500-5000") {
      matchesPrice = prop.price >= 2500 && prop.price <= 5000;
    } else if (priceRangeQuery === "5000+") {
      matchesPrice = prop.price >= 5005;
    }

    return categoryMatch && availabilityMatch && matchesSearch && matchesPrice;
  });

  // Unique list of categories for filter pills
  const categories = ["All", "Apartment", "Studio", "Office", "Villa"];

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-12">
      {/* Title */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white sm:text-4xl tracking-tight">
          Property Directory
        </h1>
        <p className="text-zinc-500 text-sm sm:text-base">
          Browse our active real estate database. Filter by tags or availability status to find your ideal lease.
        </p>
      </div>

      {/* Filter Matrix Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {cat}s
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-405 dark:text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search properties by title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-zinc-805 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-450 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Availability Toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer accent-amber-500"
          />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Show Available Now Only
          </span>
        </label>
      </div>

      {/* Property Inventory Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/10 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 text-sm">No properties found matching your filter selection.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setShowOnlyAvailable(false);
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-zinc-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
            >
              {/* Photo Area */}
              <div className="relative h-56 w-full overflow-hidden bg-zinc-100">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${
                    prop.available
                      ? "bg-emerald-600"
                      : "bg-amber-600"
                  }`}>
                    {prop.available ? "Available Now" : "Rented Out"}
                  </span>
                </div>
              </div>

              {/* Info Area */}
              <div className="flex flex-1 flex-col p-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                      {prop.category}
                    </span>
                    {/* Rate Display */}
                    <p className="text-lg font-bold text-zinc-950 dark:text-white">
                      ${prop.price}
                      <span className="text-xs text-zinc-500 font-normal">/mo</span>
                    </p>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:text-amber-500 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-550 flex items-center gap-1 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0 text-zinc-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {(prop as any).location || "Metro City"}
                  </p>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {prop.description}
                </p>

                {/* Listing Features */}
                <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 border-t border-b border-zinc-50 dark:border-zinc-900 py-3">
                  <span className="flex items-center gap-1">
                    {prop.beds} {prop.beds === 1 ? "Bed" : "Beds"}
                  </span>
                  <span className="flex items-center gap-1">
                    {prop.baths} {prop.baths === 1 ? "Bath" : "Baths"}
                  </span>
                  <span className="flex items-center gap-1">
                    {prop.sqft} sqft
                  </span>
                </div>

                {/* Countdown & CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs">
                    <p className="text-zinc-400 font-medium">Availability</p>
                    <p className={`font-bold ${prop.available ? "text-emerald-500" : "text-amber-500"}`}>
                      {prop.available ? "Immediate Move-in" : `Available in ${prop.availableDays} days`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/listings/${prop.id}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/apply?propertyId=${prop.id}&name=${encodeURIComponent(prop.title)}&price=${prop.price}`}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
