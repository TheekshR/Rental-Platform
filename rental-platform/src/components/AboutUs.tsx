"use client";

import Link from "next/link";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Image with Hover Effect & Decorative Backdrops */}
          <div className="lg:col-span-6 relative group">
            {/* Decorative colored glow behind image */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
            
            {/* Image Wrapper */}
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-xl shadow-amber-500/5 aspect-4/3 sm:aspect-16/10 lg:aspect-square">
              <Image
                src="/about-us-teaser.png"
                alt="Modern luxury architecture representing Rentora"
                fill
                sizes="(max-w-1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            </div>
            
            {/* Floating Decorative Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 p-4 rounded-2xl shadow-xl shadow-zinc-950/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Trusted by</p>
                <p className="text-sm font-bold text-zinc-950 dark:text-white">10,000+ Vetted Tenants</p>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Story */}
          <div className="lg:col-span-6 space-y-6">
            
            <h2 className="text-3.5xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
              Redefining How You Find Premium Rental Environments
            </h2>
            
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
              At Rentora, we believe finding a home, studio, or corporate headquarters should be direct, clean, and inspiring. We bridge the gap between discerning tenants and premium, verified landlords to deliver environments tailored to your success.
            </p>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="flex gap-3.5">
                <div className="flex-none flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Vetted Landlords</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-normal mt-0.5">Every landlord is verified through legal and background checks.</p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="flex-none flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Direct & Fast Apply</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-normal mt-0.5">Apply securely directly through our site, skipping middle agencies.</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3.5 text-xs font-bold transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer text-center"
              >
                Read Our Story
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
