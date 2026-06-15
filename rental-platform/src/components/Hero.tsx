"use client";

import { useState } from "react";

export default function Hero() {
  // States to manage the search tab and dropdown filters
  const [activeTab, setActiveTab] = useState("rent");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Prompt search settings to the user
    alert(`Searching for ${activeTab === "rent" ? "rentals" : "properties to buy"} in ${location || "Anywhere"} (${propertyType || "All types"}, ${priceRange || "Any price"})`);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat transition-transform duration-7000 hover:scale-105"
        style={{ transformOrigin: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />

      {/* Hero Content Panel */}
      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:pt-40 md:pb-28 w-full z-10">
        <div className="max-w-3xl">


          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Find Your Perfect <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Rental Property
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-300 mb-10 max-w-xl leading-relaxed">
            Browse premium apartments, modern studios, sleek offices, and luxury villas. Handpicked listings with verified landlords and secure leases.
          </p>

          {/* Search / Filter Box */}
          <div className="bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl max-w-2xl">
            {/* Search Option Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab("rent")}
                className={`px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "rent"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Rent Property
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("buy")}
                className={`px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "buy"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Buy / Invest
              </button>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Location Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Location
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Property Type
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12" />
                    </svg>
                  </span>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl pl-10 pr-10 py-3.5 text-sm text-white focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-950 text-white">All Properties</option>
                    <option value="Villa" className="bg-zinc-950 text-white">Luxury Villa</option>
                    <option value="Apartment" className="bg-zinc-950 text-white">Apartment</option>
                    <option value="Studio" className="bg-zinc-950 text-white">Studio Apartment</option>
                    <option value="Office" className="bg-zinc-950 text-white">Office Space</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Price Budget Dropdown */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Monthly Price
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl pl-10 pr-10 py-3.5 text-sm text-white focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-950 text-white">Any Price</option>
                    <option value="0-1000" className="bg-zinc-950 text-white">Under $1,000 / mo</option>
                    <option value="1000-2500" className="bg-zinc-950 text-white">$1,000 - $2,500 / mo</option>
                    <option value="2500-5000" className="bg-zinc-950 text-white">$2,500 - $5,000 / mo</option>
                    <option value="5000+" className="bg-zinc-950 text-white">$5,000+ / mo</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                  </svg>
                  Search Perfect Spaces
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
