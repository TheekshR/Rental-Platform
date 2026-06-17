"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide public footer on Admin routes
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4.5 w-4.5"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Rent<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">ora</span>
            </span>
          </Link>
          <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
            Rentora is the premier platform connecting tenants with verified landlords of premium apartments, offices, and luxury villas.
          </p>
          {/* Social Links */}
          <div className="flex gap-4 text-zinc-500">
            <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.139.052 1.9.24 2.502.474a4.741 4.741 0 011.671 1.083 4.731 4.731 0 011.083 1.671c.234.602.422 1.364.474 2.502.044.925.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.052 1.139-.24 1.9-.474 2.502a4.742 4.742 0 01-1.083 1.671 4.731 4.731 0 01-1.671 1.083c-.602.234-1.364.422-2.502.474-.925.044-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.139-.052-1.9-.24-2.502-.474a4.741 4.741 0 01-1.671-1.083 4.73 4.73 0 01-1.083-1.671c-.234-.602-.422-1.364-.474-2.502C2.01 14.836 2 14.481 2 12s.01-2.784.054-3.71c.052-1.139.24-1.9.474-2.502a4.738 4.738 0 011.083-1.671 4.731 4.731 0 011.671-1.083c.602-.234 1.364-.422 2.502-.474.925-.044 1.28-.054 3.71-.054zM12 5.902a6.098 6.098 0 100 12.196 6.098 6.098 0 000-12.196zm0 2.01a4.088 4.088 0 110 8.176 4.088 4.088 0 010-8.176zm5.737-1.272a1.217 1.217 0 100 2.434 1.217 1.217 0 000-2.434z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Rentals</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/listings?category=Villa" className="hover:text-white transition-colors">Villas</Link></li>
            <li><Link href="/listings?category=Apartment" className="hover:text-white transition-colors">Apartments</Link></li>
            <li><Link href="/listings?category=Studio" className="hover:text-white transition-colors">Studios</Link></li>
            <li><Link href="/listings?category=Office" className="hover:text-white transition-colors">Offices</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/help" className="hover:text-white transition-colors">Contact & Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 my-10" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
        <p>© {currentYear} Rentora. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}