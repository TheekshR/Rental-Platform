"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface UserInfo {
  fullName: string;
  email: string;
}

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  read: boolean;
  createdAt: string;
  link?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Check user auth state
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          fetchNotifications();
        } else {
          setUser(null);
          setNotifications([]);
        }
      } catch (err) {
        setUser(null);
        setNotifications([]);
      }
    }
    checkAuth();
  }, [pathname]);

  // Auto-close dropdowns on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
  }, [pathname]);

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  // Hide public navbar on Admin routes
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Listings", href: "/listings" },
    { name: "About Us", href: "/about" },
    { name: "Apply to Rent", href: "/apply" },
    { name: "Help & Support", href: "/help" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo (Far Left) */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
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
            Rent<span className="text-orange-500">ora</span>
          </span>
        </Link>

        {/* Navigation Links (Center - Desktop Only, Hidden on Tablet & Mobile) */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
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

        {/* Actions Group (Far Right - Desktop Only, Tablet & Mobile use Toggle) */}
        <div className="flex items-center gap-3.5 lg:gap-4.5">
          {user ? (
            <div className="flex items-center gap-3 lg:gap-4.5">
              {/* Notification Icon (Circular Bordered Style) */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:shadow-sm active:scale-95 cursor-pointer ${
                    showNotifications
                      ? "border-amber-500 bg-amber-500/5 text-amber-600"
                      : "border-zinc-200 bg-zinc-50/40 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                  title="Notifications"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-4.5 w-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </button>

                {/* Notification Dropdown (Centers on mobile/tablet viewport, right-aligned absolute on desktop) */}
                {showNotifications && (
                  <div className="fixed top-16 left-1/2 -translate-x-1/2 lg:absolute lg:top-auto lg:left-auto lg:right-0 lg:translate-x-0 z-50 w-[90vw] lg:w-96 rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl shadow-amber-500/5 animate-scale-in">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
                      <h4 className="text-sm font-extrabold text-zinc-950">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-zinc-500 font-semibold">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleMarkAsRead(notif._id)}
                            className={`p-3 rounded-xl border transition-colors cursor-pointer text-left space-y-1 ${
                              notif.read
                                ? "bg-zinc-50/50 border-zinc-50"
                                : "bg-amber-50/20 border-amber-100/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-bold ${
                                notif.type === "success"
                                  ? "text-emerald-700"
                                  : notif.type === "warning"
                                  ? "text-rose-700"
                                  : "text-zinc-800"
                              }`}>
                                {notif.title}
                              </span>
                              <span className="text-[9px] text-zinc-550">
                                {new Date(notif.createdAt).toLocaleDateString(undefined, { dateStyle: "short" })}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-800 leading-relaxed font-semibold">
                              {/* Clean emojis from body if any exist dynamically */}
                              {notif.message.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* My Profile Button Avatar Circle */}
              <Link
                key="/profile"
                href="/profile"
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:shadow-sm active:scale-95 cursor-pointer ${
                  pathname === "/profile"
                    ? "border-amber-500 bg-amber-500/5 text-amber-600"
                    : "border-zinc-200 bg-zinc-50/40 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                }`}
                title="My Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-4.5 w-4.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>

              {/* Apply Now (Desktop Only, Far Right edge) */}
              <Link
                href="/apply"
                className="hidden sm:inline-block rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md active:scale-95"
              >
                Apply Now
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-4 lg:flex">
              {/* Sign In */}
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                Sign In
              </Link>
              {/* Apply Now */}
              <Link
                href="/apply"
                className="rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md active:scale-95"
              >
                Apply Now
              </Link>
            </div>
          )}

          {/* Mobile/Tablet Menu Toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/60 hover:bg-zinc-50 transition-colors lg:hidden text-zinc-700 cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5.5 w-5.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5.5 w-5.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Drawer menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-zinc-100 bg-white px-6 py-5 lg:hidden space-y-4 shadow-lg animate-fade-in">
          {/* Menu Links */}
          <div className="flex flex-col gap-3.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? "text-amber-500 font-bold" : "text-zinc-700 hover:text-zinc-950"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Links */}
          <div className="border-t border-zinc-100 pt-4 flex flex-col gap-3">
            {user ? (
              <>
                {/* Apply Now button (Profile link removed since it is already on Mobile Nav Bar) */}
                <Link
                  href="/apply"
                  className="rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-3 text-center text-xs transition-all"
                >
                  Apply Now
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors text-center py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/apply"
                  className="rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-3 text-center text-xs transition-all"
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
