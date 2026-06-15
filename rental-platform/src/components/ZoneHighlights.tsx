import Link from "next/link";

export default function ZoneHighlights() {
  // 4 Core zoning highlights details
  const zones = [
    {
      title: "Urban Apartments",
      category: "Apartment",
      description: "Modern high-rise flats in downtown city hubs.",
      image: "/urban-apartments.png",
      count: "18 listings",
      color: "from-blue-500 to-orange-600",
    },
    {
      title: "Shared Studios",
      category: "Studio",
      description: "Cozy spaces with shared amenities for creators.",
      image: "/shared-studios.png",
      count: "9 listings",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Executive Offices",
      category: "Office",
      description: "Sleek workspaces to scale your professional team.",
      image: "/executive-offices.png",
      count: "12 listings",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Luxury Villas",
      category: "Villa",
      description: "High-end villas with pools and ultimate privacy.",
      image: "/luxury-villas.png",
      count: "6 listings",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-5xl sm:text-6xl font-extrabold mt-4 text-zinc-950 dark:text-white tracking-tight">
            Curated Property Zoning
          </h2>
          <p className="text-zinc-500 mt-4 text-md sm:text-base">
            Select one of our 4 custom zoning tags to find premium rental environments tailored to your specific demands.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {zones.map((zone, index) => (
            <Link
              key={index}
              href={`/listings?category=${zone.category}`}
              className="group relative flex h-96 flex-col justify-end overflow-hidden rounded-3xl bg-zinc-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer"
            >
              {/* Card Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-85"
                style={{ backgroundImage: `url('${zone.image}')` }}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

              {/* Card Info Content */}
              <div className="relative z-10 space-y-2">
                {/* Badge */}
                <span className={`inline-flex items-center rounded-md bg-gradient-to-r ${zone.color} px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider`}>
                  {zone.count}
                </span>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {zone.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {zone.description}
                </p>

                {/* Call to Action Indicator */}
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Browse Zone
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
