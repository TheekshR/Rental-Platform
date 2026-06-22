"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Popup from "@/components/Popup";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface ApplicationData {
  _id: string;
  fullName: string;
  email: string;
  employmentStatus: string;
  annualIncome: number;
  moveInDate: string;
  propertyName: string;
  propertyPrice: number;
  status: "Under Review" | "Approved" | "Rejected";
  applicationId: string;
  createdAt: string;
}

// Custom Inline SVGs to remove react-icons dependency and align with rest of the app
interface IconProps {
  className?: string;
}

const UserIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const EnvelopeIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const PhoneIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.145-3.878-6.698-6.702l1.294-.97c.362-.272.528-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const BuildingIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21h10.5V3.75c0-.621-.504-1.125-1.125-1.125H7.875c-.621 0-1.125.504-1.125 1.125V21z" />
  </svg>
);

const CheckCircleIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const TimesCircleIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const SignOutIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const EditIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const FileIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const ChevronIcon = ({ isOpen, className = "h-4 w-4 transition-transform duration-200" }: { isOpen: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className={`${className} ${isOpen ? "rotate-180" : ""}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();

  // Authentication & Profile State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Custom Popup States
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"success" | "warning" | "confirm">("success");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupOnConfirm, setPopupOnConfirm] = useState<() => void>(() => {});

  // Applications State
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  // 1. Check Auth Status on Mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        const data = await res.json();
        
        if (data.authenticated && data.user) {
          setUser(data.user);
          setEditName(data.user.fullName);
          setEditEmail(data.user.email);
          setEditPhone(data.user.phone || "");
          setCheckingAuth(false);
          // Fetch user's applications
          fetchApplications();
        } else {
          router.push("/login?redirect=/profile");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login?redirect=/profile");
      }
    }

    verifyAuth();
  }, [router]);

  // 2. Fetch Applications
  async function fetchApplications() {
    try {
      setAppsLoading(true);
      const res = await fetch("/api/applications/my");
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setAppsLoading(false);
    }
  }

  // 3. Handle Logout Trigger Confirmation
  const triggerLogoutConfirm = () => {
    setPopupType("confirm");
    setPopupTitle("Sign Out");
    setPopupMessage("Are you sure you want to sign out of your Rentora account?");
    setPopupOnConfirm(() => async () => {
      setPopupOpen(false);
      try {
        const res = await fetch("/api/auth/verify", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          router.refresh();
          router.push("/");
        }
      } catch (err) {
        console.error("Logout failed:", err);
      }
    });
    setPopupOpen(true);
  };

  // 4. Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setUpdateLoading(true);

    try {
      const res = await fetch("/api/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: editName,
          email: editEmail,
          phone: editPhone,
        }),
      });

      const data = await res.json();
      setUpdateLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
        setIsEditing(false);
        setPopupType("success");
        setPopupTitle("Profile Updated");
        setPopupMessage("Your account profile details have been saved successfully.");
        setPopupOnConfirm(() => () => {
          setPopupOpen(false);
        });
        setPopupOpen(true);
        router.refresh();
      } else {
        setUpdateError(data.message || "Failed to update profile details.");
      }
    } catch (err) {
      console.error("Update profile connection error:", err);
      setUpdateLoading(false);
      setUpdateError("Failed to connect to the server.");
    }
  };

  const toggleApp = (id: string) => {
    if (activeAppId === id) {
      setActiveAppId(null);
    } else {
      setActiveAppId(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircleIcon className="text-emerald-500 dark:text-emerald-400 h-3.5 w-3.5" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
            <TimesCircleIcon className="text-rose-500 dark:text-rose-400 h-3.5 w-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-400"></span>
            </span>
            Under Review
          </span>
        );
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-12">
      {/* Page Title & Subtitle (Help Page Pattern) */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white sm:text-4xl tracking-tight">
          Account Profile
        </h1>
        <p className="text-zinc-500 text-sm sm:text-base">
          Manage your tenant credentials, contact details, and track submitted lease documents.
        </p>
      </div>

      {/* Success Alert */}
      {updateSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5 animate-fadeIn shadow-sm max-w-7xl mx-auto">
          <CheckCircleIcon className="text-emerald-500 dark:text-emerald-400 h-4 w-4 flex-shrink-0" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Two Column Layout (Help Page Pattern: Left is Profile Summary, Right is Application History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Profile Summary / Edit Credentials (5 Columns) - Matches Inquiry form pattern */}
        <div className="lg:col-span-5">
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
            
            {/* Bio Card Top */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm flex items-center justify-center text-xl font-black uppercase select-none mx-auto mb-4">
                {user?.fullName.slice(0, 2)}
              </div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">{user?.fullName}</h2>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mt-2 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-full">
                <UserIcon className="h-2.5 w-2.5" /> Registered Client
              </span>
            </div>

            {!isEditing ? (
              // View Details Mode (Formatted like read-only input elements to match inquiry forms pattern)
              <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
                
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-555">
                      <EnvelopeIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={user?.email || ""}
                      readOnly
                      className="w-full bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-555">
                      <PhoneIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={user?.phone || "Not provided"}
                      readOnly
                      className={`w-full bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm dark:bg-zinc-900 cursor-not-allowed focus:outline-none ${
                        user?.phone ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-405 dark:text-zinc-550 italic"
                      }`}
                    />
                  </div>
                </div>

                {/* Operation Buttons */}
                <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 space-y-3">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setUpdateError("");
                      setUpdateSuccess("");
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white font-bold py-3.5 text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    <EditIcon className="h-3.5 w-3.5" /> Update Profile Details
                  </button>

                  <button
                    onClick={triggerLogoutConfirm}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold py-3.5 text-xs transition-colors cursor-pointer"
                  >
                    <SignOutIcon className="h-3.5 w-3.5 text-zinc-450 dark:text-zinc-500" /> Sign Out of Account
                  </button>
                </div>
              </div>
            ) : (
              // Inline Edit Form Mode
              <form onSubmit={handleUpdateProfile} className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
                <h3 className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-450 tracking-wider mb-2">Edit Account Info</h3>
                
                {updateError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-[10px] font-semibold text-rose-700 dark:text-rose-400 flex items-start gap-1">
                    <span>⚠️</span>
                    <span>{updateError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-455">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-zinc-50 focus:bg-white border border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3 text-sm text-zinc-950 dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-650 dark:text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-zinc-50 focus:bg-white border border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3 text-sm text-zinc-950 dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-655 dark:text-zinc-400">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    placeholder="e.g. +1 (555) 000-0000"
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-zinc-50 focus:bg-white border border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3 text-sm text-zinc-950 dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 font-bold py-3 text-xs transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 text-xs transition-all hover:shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
                  >
                    {updateLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right: Application History Feed (7 Columns) - Matches FAQ accordion pattern */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 bg-white dark:bg-zinc-950 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-5 mb-6">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2.5">
                <FileIcon className="text-amber-500 h-5 w-5" />
                Application History
              </h2>
              <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-3 py-1 rounded-full border border-zinc-200/40 dark:border-zinc-800/50">
                {applications.length} submitted
              </span>
            </div>

            {appsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold tracking-wider uppercase">Fetching lease documents...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 px-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10">
                <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 flex items-center justify-center mx-auto mb-4 text-xl">
                  <BuildingIcon className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-extrabold text-zinc-800 dark:text-white">No Rental Filings Logged</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-2 leading-relaxed">
                  It looks like you haven't filed any lease applications yet. Search our inventory of spaces and submit your tenancy papers to start.
                </p>
                <Link
                  href="/listings"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Explore Active Properties
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const isOpen = activeAppId === app._id;
                  return (
                    <div 
                      key={app._id} 
                      className="border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm"
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleApp(app._id)}
                        className="w-full flex justify-between items-center px-6 py-4.5 text-left text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-amber-600 transition-colors cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 px-2 py-0.5 rounded uppercase">
                              {app.applicationId}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                              Filed {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <BuildingIcon className="text-zinc-450 dark:text-zinc-500 h-3.5 w-3.5" />
                            {app.propertyName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3">
                          {getStatusBadge(app.status)}
                          <ChevronIcon isOpen={isOpen} className="h-4 w-4 text-zinc-450 dark:text-zinc-500" />
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {isOpen && (
                        <div className="px-6 pb-5 border-t border-zinc-50 dark:border-zinc-900 pt-4 bg-zinc-50/20 dark:bg-zinc-900/5">
                          {/* detailed key-value breakdown formatted like success screen in Apply page */}
                          <div className="py-2 text-xs space-y-3 font-semibold">
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
                              <span className="text-zinc-500 dark:text-zinc-450 font-semibold">Applicant Name</span>
                              <span className="text-zinc-900 dark:text-white font-bold">{app.fullName}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
                              <span className="text-zinc-500 dark:text-zinc-455 font-semibold">Contact Email</span>
                              <span className="text-zinc-900 dark:text-white font-bold">{app.email}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
                              <span className="text-zinc-500 dark:text-zinc-450 font-semibold">Employment Status</span>
                              <span className="text-zinc-900 dark:text-white font-bold">{app.employmentStatus}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
                              <span className="text-zinc-500 dark:text-zinc-450 font-semibold">Gross Annual Income</span>
                              <span className="text-zinc-900 dark:text-white font-bold">${app.annualIncome.toLocaleString()}/yr</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
                              <span className="text-zinc-500 dark:text-zinc-450 font-semibold">Proposed Move-in</span>
                              <span className="text-zinc-900 dark:text-white font-bold">
                                {new Date(app.moveInDate).toLocaleDateString(undefined, { dateStyle: "long" })}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
                              <span className="text-zinc-500 dark:text-zinc-450 font-semibold">Monthly Rate</span>
                              <span className="text-zinc-900 dark:text-white font-bold">${app.propertyPrice.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between pb-1">
                              <span className="text-zinc-500 dark:text-zinc-450 font-semibold">Application ID</span>
                              <span className="text-amber-600 font-bold uppercase">{app.applicationId}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Popup
        isOpen={popupOpen}
        type={popupType}
        title={popupTitle}
        message={popupMessage}
        onConfirm={popupOnConfirm}
        onCancel={() => setPopupOpen(false)}
        confirmText={popupType === "confirm" ? "Yes, Sign Out" : "Okay"}
        cancelText="Cancel"
      />
    </div>
  );
}
