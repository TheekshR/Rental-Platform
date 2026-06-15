"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Array representing the active pages on our website
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Listings", href: "/listings" },
    { name: "Apply to Rent", href: "/apply" },
    { name: "Help & Support", href: "/help" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl border border-zinc-100 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-amber-100/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-950">
            Rent<span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">ora</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            // Check if the current URL path matches the link destination
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-1 text-sm font-medium transition-colors ${
                  isActive ? "text-zinc-950 font-semibold" : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[2px] w-full bg-amber-500 transition-transform duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/apply"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-md active:scale-95"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
