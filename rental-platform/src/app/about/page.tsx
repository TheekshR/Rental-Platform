import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      title: "Handpicked Listings",
      description: "We physically and legally inspect every apartment, studio, villa, and office space before adding it to our registry.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    {
      title: "No Middleman Friction",
      description: "Direct lease signing, digital application reviews, and transparent landlord communications mean no agency markups.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.771m.002 3.197c.025-.22.036-.44.036-.662v-.03a3.245 3.245 0 00-3.245-3.245h-.055a3 3 0 00-2.08 5.006 12.002 12.002 0 008.38 4.148M12 12.75a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z" />
        </svg>
      ),
    },
    {
      title: "Absolute Pricing Transparency",
      description: "We display pricing down to local service fees, security deposits, and amenities, giving you complete clarity.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.22a2.25 2.25 0 003.182 0l2.909-2.909m-6.364-3.181l.22-.22a2.25 2.25 0 013.182 0l2.909 2.909m-6.364 0L12 12m0 0L8.25 8.25m3.75 3.75L15.75 12" />
        </svg>
      ),
    },
    {
      title: "Custom Zoning Search",
      description: "We are the first platform that categorizes properties by precise zoning demands: live, collaborate, or scale.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 00.75 12m18.75 0a3 3 0 00-8.78 4.122m0 0A3 3 0 0012 21a3 3 0 003.47-4.878m0 0A3 3 0 0019.25 12a3 3 0 00-3.47-4.878m0 0A3 3 0 0012 3a3 3 0 00-3.47 4.878m0 0A3 3 0 008.25 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pt-36 pb-16 space-y-16 md:pt-44 md:pb-24 md:space-y-24">
      {/* 1. Hero / Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3.5xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-none">
          Redefining the Premium <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Rental Experience</span>
        </h1>
        <p className="text-md sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Rentora is built on the belief that finding your perfect space should be clean, straightforward, and direct. We connect renters to vetted landlords in major metropolitan hubs.
        </p>
      </div>

      {/* 2. Brand Story / Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Story copy */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            How Rentora Started
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
            Founded in 2021, Rentora arose from the sheer frustration of traditional rental markets: complex application loops, unverified listings, hidden commission fees, and lack of direct tenant-to-landlord communication.
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
            We wanted a platform where property verification is standard, and zoning types correspond to contemporary needs. Whether you want a high-rise downtown studio, a scaling corporate office, or a peaceful luxury villa, Rentora guarantees security, ease of booking, and digital contract signing.
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
            Today, we host thousands of premium properties across the country, serving scaling teams, creators, families, and professionals seeking premium comfort.
          </p>
        </div>

        {/* Story Image */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-25 blur-xl group-hover:opacity-35 transition-opacity duration-500" />
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-xl aspect-4/3 sm:aspect-16/10 lg:aspect-square">
            <Image
              src="/about-us-page-v2.png"
              alt="Rentora professional team in action"
              fill
              sizes="(max-w-1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* 3. Core Values Grid */}
      <div className="space-y-8 md:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Our Core Values
          </h2>
          <p className="text-sm text-zinc-400">
            These four foundational pillars guide every feature we ship and list.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {values.map((val, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 hover:border-amber-500/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all duration-300 group"
            >
              <div className="flex-none flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white transition-all duration-300">
                {val.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-md font-bold text-zinc-950 dark:text-white">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CTA Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-lg mx-auto leading-tight">
          Ready to Find Your Perfect Living Space?
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
          Filter through our curated zoning highlights and find the property matching your style, speed, and budget.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 font-bold text-xs transition-all shadow-lg active:scale-95 w-full sm:w-auto"
          >
            Explore Listings
          </Link>
          <Link
            href="/help"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 px-6 py-3 font-bold text-xs hover:text-white hover:bg-zinc-850 transition-all active:scale-95 w-full sm:w-auto"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
