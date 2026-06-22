"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from "@/components/Popup";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  employmentStatus: string;
  annualIncome: number;
  moveInDate: string;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  status: "Under Review" | "Approved" | "Rejected";
  applicationId: string;
  userId?: string;
  createdAt: string;
}

interface Property {
  _id: string;
  title: string;
  category: string;
  price: number;
  location?: string;
  available: boolean;
  availableDays: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  description: string;
  dimensions: {
    bedrooms: string;
    bathrooms: string;
    totalArea: string;
    ceilings: string;
    balcony: string;
  };
  utilities: string[];
  petPolicy: string;
}

interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  inquiryType: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth & General States
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"applications" | "properties" | "inquiries" | "team" | "users">("applications");

  // RBAC States
  const [role, setRole] = useState("team_member");
  const [permissions, setPermissions] = useState({
    manageProperties: false,
    manageApplications: false,
    viewInquiries: true,
  });

  // Data States
  const [applications, setApplications] = useState<Application[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Selected Application Details Modal State
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Custom Popup State
  const [popup, setPopup] = useState<any>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // User list search query
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Team Member Form States
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);
  const [teamUsername, setTeamUsername] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [teamRole, setTeamRole] = useState("team_member");
  const [teamPermProperties, setTeamPermProperties] = useState(false);
  const [teamPermApplications, setTeamPermApplications] = useState(false);
  const [teamPermInquiries, setTeamPermInquiries] = useState(true);
  const [teamError, setTeamError] = useState("");
  const [teamSuccess, setTeamSuccess] = useState("");
  const [teamLoading, setTeamLoading] = useState(false);

  // Mutation Loading States
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Property Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Apartment");
  const [newPrice, setNewPrice] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSqft, setNewSqft] = useState("");
  const [newBeds, setNewBeds] = useState("2");
  const [newBaths, setNewBaths] = useState("2");
  const [newImage, setNewImage] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  // Dimensions subform
  const [dimBedrooms, setDimBedrooms] = useState("");
  const [dimBathrooms, setDimBathrooms] = useState("");
  const [dimCeilings, setDimCeilings] = useState("");
  const [dimBalcony, setDimBalcony] = useState("");

  // Utilities & Policies
  const [newUtilities, setNewUtilities] = useState("");
  const [newPetPolicy, setNewPetPolicy] = useState("");
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Admin credentials update states
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [credError, setCredError] = useState("");
  const [credSuccess, setCredSuccess] = useState("");
  const [credLoading, setCredLoading] = useState(false);

  // 1. Verify Admin Session & Load all data
  useEffect(() => {
    async function checkAndLoad() {
      const startTime = Date.now();
      try {
        const verifyRes = await fetch("/api/admin/verify");
        const verifyData = await verifyRes.json();
        
        if (!verifyData.authenticated) {
          router.push("/admin");
          return;
        }

        setUsername(verifyData.username);
        setRole(verifyData.role || "team_member");
        setPermissions(verifyData.permissions || {
          manageProperties: false,
          manageApplications: false,
          viewInquiries: true
        });

        // Load baseline admin data
        const loadTasks = [fetchProperties(), fetchApplications(), fetchNotifications()];
        if (verifyData.permissions?.viewInquiries || verifyData.role === "super_admin") {
          loadTasks.push(fetchInquiries());
        }
        await Promise.all(loadTasks);

        // Load super-admin specific lists
        if (verifyData.role === "super_admin") {
          await Promise.all([fetchTeam(), fetchUsers()]);
        }

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 600 - elapsedTime);
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      } catch (err) {
        console.error("Dashboard mount error:", err);
        router.push("/admin");
      }
    }
    checkAndLoad();

    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // Data Fetchers
  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } catch (err) {
      console.error("Fetch properties error:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.success) setApplications(data.applications);
    } catch (err) {
      console.error("Fetch applications error:", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries);
    } catch (err) {
      console.error("Fetch inquiries error:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: any) => !n.read).length);
      }
    } catch (err) {
      console.error("Fetch admin notifications error:", err);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) setTeam(data.team);
    } catch (err) {
      console.error("Fetch team error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  // 2. Auth handlers
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/verify", { method: "POST" });
      router.push("/admin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };



  // 3. Application Lifecycle Mutators
  const handleMutateStatus = async (appId: string, newStatus: "Approved" | "Rejected") => {
    if (role !== "super_admin" && !permissions.manageApplications) {
      setPopup({
        isOpen: true,
        type: "warning",
        title: "Permission Denied",
        message: "You do not have permission to approve or reject applications.",
        onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
      });
      return;
    }

    setPopup({
      isOpen: true,
      type: "confirm",
      title: "Confirm Status Change",
      message: `Are you sure you want to mark this application as ${newStatus}?`,
      onConfirm: async () => {
        setPopup((p: any) => ({ ...p, isOpen: false }));
        setActionLoading(appId);
        try {
          const res = await fetch(`/api/applications/${appId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
          });
          const data = await res.json();
          if (data.success) {
            setApplications((prev) =>
              prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
            );
            setSelectedApplication((prev) => prev && prev._id === appId ? { ...prev, status: newStatus } : prev);
            setPopup({
              isOpen: true,
              type: "success",
              title: "Status Updated",
              message: `Application status is now updated to '${newStatus}'.`,
              onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
            });
          } else {
            setPopup({
              isOpen: true,
              type: "warning",
              title: "Update Failed",
              message: data.message || "Failed to update application status.",
              onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
            });
          }
        } catch (err) {
          console.error("Mutation error:", err);
        } finally {
          setActionLoading(null);
        }
      },
      onCancel: () => setPopup((p: any) => ({ ...p, isOpen: false }))
    });
  };

  // 4. Property Status Toggler
  const handleToggleAvailability = async (propId: string, currentAvailable: boolean) => {
    if (role !== "super_admin" && !permissions.manageProperties) {
      setPopup({
        isOpen: true,
        type: "warning",
        title: "Permission Denied",
        message: "You do not have permission to modify properties.",
        onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
      });
      return;
    }

    setActionLoading(propId);
    try {
      const res = await fetch(`/api/properties/${propId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          available: !currentAvailable,
          availableDays: !currentAvailable ? 0 : 30
        })
      });
      const data = await res.json();
      if (data.success && data.property) {
        setProperties((prev) =>
          prev.map((prop) => (prop._id === propId ? data.property : prop))
        );
        setPopup({
          isOpen: true,
          type: "success",
          title: "Status Updated",
          message: `Listing is now marked as ${!currentAvailable ? "Rented Out" : "Available"}.`,
          onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
        });
      } else {
        setPopup({
          isOpen: true,
          type: "warning",
          title: "Failed to Update",
          message: data.message || "Failed to update property status.",
          onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
        });
      }
    } catch (err) {
      console.error("Toggle availability error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // 5. Property Deletion Handler
  const handleDeleteProperty = async (propId: string) => {
    if (role !== "super_admin" && !permissions.manageProperties) {
      setPopup({
        isOpen: true,
        type: "warning",
        title: "Permission Denied",
        message: "You do not have permission to delete properties listings.",
        onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
      });
      return;
    }

    setPopup({
      isOpen: true,
      type: "confirm",
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this property listing permanently?",
      onConfirm: async () => {
        setPopup((p: any) => ({ ...p, isOpen: false }));
        setActionLoading(propId);
        try {
          const res = await fetch(`/api/properties/${propId}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            setProperties((prev) => prev.filter((p) => p._id !== propId));
            setPopup({
              isOpen: true,
              type: "success",
              title: "Property Deleted",
              message: "Listing has been successfully deleted.",
              onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
            });
          } else {
            setPopup({
              isOpen: true,
              type: "warning",
              title: "Deletion Failed",
              message: data.message || "Failed to delete property.",
              onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
            });
          }
        } catch (err) {
          console.error("Delete property error:", err);
        } finally {
          setActionLoading(null);
        }
      },
      onCancel: () => setPopup((p: any) => ({ ...p, isOpen: false }))
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 6. Property Insertion handler
  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newTitle.trim() || !newPrice || !newSqft) {
      setFormError("Title, monthly rate, and structure size are required.");
      return;
    }

    try {
      const imageURL = newImage.trim() || (
        newCategory === "Villa" ? "/luxury-villas.png" :
        newCategory === "Studio" ? "/shared-studios.png" :
        newCategory === "Office" ? "/executive-offices.png" : "/urban-apartments.png"
      );

      const utilitiesList = newUtilities
        .split(",")
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      const body = {
        title: newTitle,
        category: newCategory,
        price: Number(newPrice),
        location: newLocation.trim() || "Metro City",
        available: true,
        availableDays: 0,
        beds: Number(newBeds),
        baths: Number(newBaths),
        sqft: Number(newSqft),
        image: imageURL,
        description: newDescription,
        dimensions: {
          bedrooms: dimBedrooms || `${newBeds} bedrooms`,
          bathrooms: dimBathrooms || `${newBaths} bathrooms`,
          totalArea: `${newSqft} sqft total indoor space`,
          ceilings: dimCeilings || "9.5 ft plaster ceilings",
          balcony: dimBalcony || "Private balcony access"
        },
        utilities: utilitiesList.length > 0 ? utilitiesList : ["High-speed fiber-optic Wi-Fi", "Water supply utility"],
        petPolicy: newPetPolicy || "Pets welcome under tenant agreement."
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success && data.property) {
        setFormSuccess("Property created successfully!");
        setProperties((prev) => [data.property, ...prev]);
        
        // Reset form
        setNewTitle("");
        setNewPrice("");
        setNewLocation("");
        setNewSqft("");
        setNewImage("");
        setNewDescription("");
        setDimBedrooms("");
        setDimBathrooms("");
        setDimCeilings("");
        setDimBalcony("");
        setNewUtilities("");
        setNewPetPolicy("");
        
        setTimeout(() => {
          setShowAddForm(false);
          setFormSuccess("");
        }, 1500);
      } else {
        setFormError(data.message || "Failed to create property.");
      }
    } catch (err) {
      console.error("Create property submit error:", err);
      setFormError("Server connection error. Failed to add property.");
    }
  };

  // Helper metrics calculations
  const totalListings = properties.length;
  const applicationsUnderReview = applications.filter((app) => app.status === "Under Review").length;
  const activeInquiries = inquiries.length;
  const monthlyRevenueCap = properties
    .filter((p) => !p.available)
    .reduce((sum, p) => sum + p.price, 0);

  if (loading) {
    return (
      <LoadingSpinner message="Loading Workspace Data..." fullscreen={true} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-800">
      
      {/* 1. Header Bar */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              Rentora <span className="text-amber-500 font-medium text-sm">Landlord Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-1.5 text-zinc-800 hover:text-zinc-650 transition-colors cursor-pointer relative flex items-center justify-center rounded-xl hover:bg-zinc-50 border border-zinc-200"
                title="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5 text-zinc-900">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-extrabold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3.5 w-80 rounded-3xl border border-zinc-200 bg-white p-4 shadow-xl z-40 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 mb-2.5">
                    <span className="font-bold text-xs text-zinc-900 uppercase tracking-wider">Progress Updates</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/admin/notifications", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ all: true })
                            });
                            const data = await res.json();
                            if (data.success) {
                              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                              setUnreadCount(0);
                            }
                          } catch (err) {
                            console.error("Mark all read error:", err);
                          }
                        }}
                        className="text-[10px] text-amber-500 hover:text-amber-600 font-extrabold uppercase cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-zinc-400 text-center py-6 font-bold uppercase tracking-wider">No updates yet</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/admin/notifications", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ notificationId: notif._id })
                              });
                              const data = await res.json();
                              if (data.success) {
                                setNotifications((prev) =>
                                  prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
                                );
                                setUnreadCount((c) => Math.max(0, c - 1));
                              }
                            } catch (err) {
                              console.error("Mark read error:", err);
                            }
                            setShowNotifDropdown(false);
                            if (notif.title.toLowerCase().includes("application")) {
                              setActiveTab("applications");
                            } else if (notif.title.toLowerCase().includes("inquiry")) {
                              setActiveTab("inquiries");
                            }
                          }}
                          className={`p-2.5 rounded-2xl hover:bg-zinc-50 transition-colors cursor-pointer border text-left flex flex-col gap-0.5 ${
                            notif.read ? "bg-white border-transparent" : "bg-amber-50/20 border-amber-100/50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-[11px] font-bold ${notif.read ? "text-zinc-800" : "text-zinc-950"}`}>
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-550 leading-normal font-semibold">{notif.message}</p>
                          <span className="text-[8px] text-zinc-400 font-mono block mt-1">
                            {new Date(notif.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-zinc-550">
              Logged in:{" "}
              <button
                onClick={() => {
                  setNewAdminUsername(username);
                  setNewAdminPassword("");
                  setConfirmAdminPassword("");
                  setCredError("");
                  setCredSuccess("");
                  setShowCredentialsModal(true);
                }}
                title="Click to edit credentials"
                className="text-amber-500 hover:text-amber-600 font-bold underline transition-colors cursor-pointer"
              >
                {username} ({role === "super_admin" ? "Super Admin" : role === "manager" ? "Manager" : "Staff Member"})
              </button>
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-red-50 hover:text-red-600 text-zinc-700 border border-zinc-200 hover:border-red-200 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>        </div>
      </header>

      {/* 2. Main Content Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-10">
        
        {/* Metrics Overview Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Properties Portfolio</p>
              <h3 className="text-3xl font-extrabold text-zinc-900">{totalListings}</h3>
              <p className="text-[10px] text-zinc-550">Total units listed</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Under Review</p>
              <h3 className="text-3xl font-extrabold text-amber-600">{applicationsUnderReview}</h3>
              <p className="text-[10px] text-zinc-550">Tenancy files screening</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Support Inbox</p>
              <h3 className="text-3xl font-extrabold text-zinc-900">{activeInquiries}</h3>
              <p className="text-[10px] text-zinc-550">Client inquiry logs</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Current Rent Revenue</p>
              <h3 className="text-3xl font-extrabold text-emerald-600">${monthlyRevenueCap.toLocaleString()}</h3>
              <p className="text-[10px] text-zinc-550">Active monthly leases</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-zinc-200 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => { setActiveTab("applications"); setShowAddForm(false); }}
            className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "applications"
                ? "border-amber-500 text-amber-600 bg-white font-extrabold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            📋 Tenancy Applications ({applications.length})
          </button>
          <button
            onClick={() => { setActiveTab("properties"); }}
            className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "properties"
                ? "border-amber-500 text-amber-600 bg-white font-extrabold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            🏠 Properties Editor ({properties.length})
          </button>
          {(role === "super_admin" || permissions.viewInquiries) && (
            <button
              onClick={() => { setActiveTab("inquiries"); setShowAddForm(false); }}
              className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "inquiries"
                  ? "border-amber-500 text-amber-600 bg-white font-extrabold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              📬 General Inquiries ({inquiries.length})
            </button>
          )}
          {role === "super_admin" && (
            <>
              <button
                onClick={() => { setActiveTab("team"); setShowAddForm(false); }}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "team"
                    ? "border-amber-500 text-amber-600 bg-white font-extrabold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                }`}
              >
                👥 Manage Team ({team.length})
              </button>
              <button
                onClick={() => { setActiveTab("users"); setShowAddForm(false); }}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "users"
                    ? "border-amber-500 text-amber-600 bg-white font-extrabold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                }`}
              >
                👤 Manage Users ({users.length})
              </button>
            </>
          )}
        </div>
        {/* Tab 1: Tenancy Applications Screening Matrix */}
        {activeTab === "applications" && (
          <section className="bg-white border border-zinc-200 rounded-3xl overflow-hidden p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Applicant Screening Matrix</h2>
              <p className="text-xs text-zinc-500">Screen background details, income constraints, and toggle approval states.</p>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl">
                <p className="text-xs text-zinc-500">No tenancy applications found inside database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-700">
                  <thead className="text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-100">
                    <tr><th className="py-3.5 px-4">App ID</th><th className="py-3.5 px-4">Applicant</th><th className="py-3.5 px-4">Property</th><th className="py-3.5 px-4">Annual Income</th><th className="py-3.5 px-4">Move-in Date</th><th className="py-3.5 px-4">Status</th><th className="py-3.5 px-4 text-right">Lifecycle Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {applications.map((app) => {
                      const minimumRequired = app.propertyPrice * 30;
                      const ratio = app.annualIncome / (app.propertyPrice * 12);
                      return (
                        <tr key={app._id} className="hover:bg-zinc-50 transition-colors"><td className="py-4 px-4 font-mono font-bold text-zinc-650">{app.applicationId}</td>
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <p className="text-zinc-900 font-bold">{app.fullName}</p>
                              <p className="text-[10px] text-zinc-500">{app.email} • {app.employmentStatus}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-zinc-700">
                            <div className="space-y-0.5">
                              <p className="font-bold text-zinc-900 truncate max-w-[150px]">{app.propertyName}</p>
                              <p className="text-[10px] text-zinc-500">${app.propertyPrice}/mo</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <p className="text-zinc-900 font-bold">${app.annualIncome.toLocaleString()}</p>
                              <p className={`text-[9px] font-extrabold uppercase ${
                                app.annualIncome >= minimumRequired ? "text-emerald-600" : "text-red-600"
                              }`}>
                                {app.annualIncome >= minimumRequired ? "✓ Clears baseline (30x)" : "⚠ Below baseline"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-zinc-700 font-mono">
                            {new Date(app.moveInDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center text-[9px] font-extrabold uppercase tracking-wide ${
                              app.status === "Approved" ? "text-emerald-600" :
                              app.status === "Rejected" ? "text-red-600" : "text-amber-500"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {actionLoading === app._id ? (
                              <span className="text-[10px] font-bold text-zinc-400 animate-pulse uppercase">Updating...</span>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setSelectedApplication(app)}
                                  title="View Details"
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-500 border border-amber-100 text-amber-700 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </button>
                                {(role === "super_admin" || permissions.manageApplications) && (
                                  <>
                                    {app.status !== "Approved" && (
                                      <button
                                        onClick={() => handleMutateStatus(app._id, "Approved")}
                                        title="Approve Application"
                                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 border border-emerald-100 text-emerald-700 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                      </button>
                                    )}
                                    {app.status !== "Rejected" && (
                                      <button
                                        onClick={() => handleMutateStatus(app._id, "Rejected")}
                                        title="Reject Application"
                                        className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-600 border border-zinc-200 text-zinc-700 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </td></tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        
        {/* Tab 2: Properties Portfolio Editor */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            
            {/* Header controls */}
            <div className="flex justify-between items-center bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Properties Manager</h2>
                <p className="text-xs text-zinc-500">Add new rental spaces, toggle availability countdowns, or delete entries.</p>
              </div>
              {(role === "super_admin" || permissions.manageProperties) && (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  {showAddForm ? "Close Add Panel" : "+ Add New Listing"}
                </button>
              )}
            </div>

            {/* Expandable Form to Add Property */}
            {showAddForm && (
              <form onSubmit={handleAddPropertySubmit} className="bg-white border border-zinc-200 p-6 rounded-3xl space-y-6 shadow-md max-w-4xl mx-auto">
                <div className="border-b border-zinc-150 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600">Insert New Listing Details</h3>
                  <p className="text-[11px] text-zinc-500">Provide the structure metrics, price options, utility checks, and custom tags.</p>
                </div>

                {formError && (
                  <p className="p-3 bg-red-50 text-red-655 border border-red-100 rounded-xl text-xs font-semibold">
                    ⚠️ {formError}
                  </p>
                )}

                {formSuccess && (
                  <p className="p-3 bg-emerald-50 text-emerald-650 border border-emerald-100 rounded-xl text-xs font-semibold">
                    ✓ {formSuccess}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 text-xs">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Property Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Paramount Garden Penthouse"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Zoning Tag Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Apartment">Urban Apartment</option>
                      <option value="Studio">Shared Studio</option>
                      <option value="Office">Executive Office</option>
                      <option value="Villa">Luxury Villa</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Location Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Downtown, Metro City"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Monthly Rate ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2100"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Size (Sqft) */}
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Square Footage (sqft)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1350"
                      value={newSqft}
                      onChange={(e) => setNewSqft(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Beds */}
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Bedrooms Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={newBeds}
                      onChange={(e) => setNewBeds(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Baths */}
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Bathrooms Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      value={newBaths}
                      onChange={(e) => setNewBaths(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-xs">
                  <label className="block font-bold uppercase text-zinc-500">Description Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description layout outlining features, location highlights, and styling..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 resize-none transition-all"
                  />
                </div>

                {/* Subform: Dimensions */}
                <div className="space-y-4 border-t border-zinc-150 pt-4 text-xs">
                  <span className="font-bold text-zinc-500 block uppercase">Custom Structure Dimensions Details</span>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-zinc-500">Bedrooms Layout Details</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 rooms (14'x16' Master)"
                        value={dimBedrooms}
                        onChange={(e) => setDimBedrooms(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-zinc-500">Bathrooms layout</label>
                      <input
                        type="text"
                        placeholder="e.g. 2.5 baths with stone tile"
                        value={dimBathrooms}
                        onChange={(e) => setDimBathrooms(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-zinc-500">Ceiling Height</label>
                      <input
                        type="text"
                        placeholder="e.g. 10 ft high ceilings"
                        value={dimCeilings}
                        onChange={(e) => setDimCeilings(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-zinc-500">Balcony / Outdoor Area</label>
                      <input
                        type="text"
                        placeholder="e.g. 100 sqft glass deck"
                        value={dimBalcony}
                        onChange={(e) => setDimBalcony(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Utilities & Pets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-t border-zinc-150 pt-4">
                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Utility List (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Wi-Fi Included, Electricity Sub-metered, Water flat $30/mo"
                      value={newUtilities}
                      onChange={(e) => setNewUtilities(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold uppercase text-zinc-500">Pet Policies Summary</label>
                    <input
                      type="text"
                      placeholder="e.g. Cats allowed. Small dogs under 30 lbs welcome."
                      value={newPetPolicy}
                      onChange={(e) => setNewPetPolicy(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block font-bold uppercase text-zinc-500">Upload Listing Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-black focus:bg-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                    {newImage && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={newImage} alt="Preview" className="h-14 w-24 object-cover rounded-xl border border-zinc-200 bg-zinc-50" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Image selected from device</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 rounded-2xl font-bold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl cursor-pointer"
                  >
                    Publish Property Listing
                  </button>
                </div>
              </form>
            )}

            {/* Properties Matrix table */}
            <section className="bg-white border border-zinc-200 rounded-3xl overflow-hidden p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-700">
                  <thead className="text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-100">
                    <tr><th className="py-3.5 px-4">Listing</th><th className="py-3.5 px-4">Category</th><th className="py-3.5 px-4">Price</th><th className="py-3.5 px-4">Size / Layout</th><th className="py-3.5 px-4">Zoning State</th>{(role === "super_admin" || permissions.manageProperties) && <th className="py-3.5 px-4 text-right">Portfolio Controls</th>}</tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {properties.map((prop) => (
                      <tr key={prop._id} className="hover:bg-zinc-50 transition-colors"><td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img src={prop.image} alt="" className="h-10 w-16 object-cover rounded-xl bg-zinc-100 border border-zinc-200" />
                            <div className="space-y-0.5">
                              <p className="text-zinc-900 font-bold">{prop.title}</p>
                              <p className="text-[10px] text-zinc-550 truncate max-w-[200px] mb-1">{prop.description}</p>
                              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold flex items-center gap-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-zinc-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                {prop.location || "Metro City"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-zinc-600">
                          <span className="bg-zinc-100 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                            {prop.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-zinc-900 font-bold">${prop.price}/mo</td>
                        <td className="py-4 px-4 text-zinc-650">
                          {prop.beds} Bed / {prop.baths} Bath ({prop.sqft} sqft)
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center text-[9px] font-extrabold uppercase tracking-wide ${
                            prop.available 
                              ? "text-emerald-600"
                              : "text-zinc-500"
                          }`}>
                            {prop.available ? "Available" : "Rented Out"}
                          </span>
                        </td>
                        {(role === "super_admin" || permissions.manageProperties) && (
                          <td className="py-4 px-4 text-right">
                            {actionLoading === prop._id ? (
                              <span className="text-[10px] font-bold text-zinc-400 animate-pulse uppercase">Syncing...</span>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleToggleAvailability(prop._id, prop.available)}
                                  className={`px-2.5 py-1.5 rounded-lg border font-bold transition-all text-[10px] cursor-pointer ${
                                    prop.available
                                      ? "bg-amber-50 hover:bg-amber-500 hover:text-white border-amber-100 text-amber-700"
                                      : "bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {prop.available ? "Mark Rented" : "Mark Available"}
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(prop._id)}
                                  title="Delete Property Listing"
                                  className="p-1.5 rounded-lg bg-zinc-50 hover:bg-red-50 hover:text-red-700 border border-zinc-200 hover:border-red-200 transition-all cursor-pointer flex items-center justify-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </td>
                        )}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Tab 3: Inquiry Mailbox Feed */}
        {activeTab === "inquiries" && (
          <section className="bg-white border border-zinc-200 rounded-3xl overflow-hidden p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Inquiry Mailbox Feed</h2>
              <p className="text-xs text-zinc-500">Read general support message inputs logged dynamically by client requests.</p>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl">
                <p className="text-xs text-zinc-500">Your mailbox is empty.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-700">
                  <thead className="text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-100">
                    <tr><th className="py-3.5 px-4">Date Logged</th><th className="py-3.5 px-4">Contact</th><th className="py-3.5 px-4">Type</th><th className="py-3.5 px-4">Message Body</th><th className="py-3.5 px-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {inquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-zinc-50 transition-colors"><td className="py-4 px-4 text-zinc-550 font-mono">
                          {new Date(inq.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <p className="text-zinc-900 font-bold">{inq.fullName}</p>
                            <p className="text-[10px] text-zinc-500">{inq.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase">
                            {inq.inquiryType}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-sm truncate text-zinc-650 font-normal leading-relaxed">
                          {inq.message}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${inq.email}&su=${encodeURIComponent("Re: Rentora Inquiry - " + inq.inquiryType)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                            </svg>
                            Reply
                          </a>
                        </td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Tab 4: Manage Team */}
        {activeTab === "team" && role === "super_admin" && (
          <section className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-zinc-150 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Administrative Team Directory</h2>
                <p className="text-xs text-zinc-500 font-medium">Add, edit permissions, or delete management and support staff accounts.</p>
              </div>
              <button
                onClick={() => {
                  setEditingTeamMember(null);
                  setTeamUsername("");
                  setTeamPassword("");
                  setTeamRole("team_member");
                  setTeamPermProperties(false);
                  setTeamPermApplications(false);
                  setTeamPermInquiries(true);
                  setTeamError("");
                  setTeamSuccess("");
                  setShowAddTeamModal(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                + Add Team Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-700">
                <thead className="text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-100">
                  <tr><th className="py-3.5 px-4">Username</th><th className="py-3.5 px-4">Access Role</th><th className="py-3.5 px-4">Properties Access</th><th className="py-3.5 px-4">Applications Access</th><th className="py-3.5 px-4">Inquiries Access</th><th className="py-3.5 px-4">Joined Date</th><th className="py-3.5 px-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {team.map((member) => (
                    <tr key={member._id} className="hover:bg-zinc-50 transition-colors"><td className="py-4 px-4 text-zinc-900 font-bold">{member.username}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase ${
                          member.role === "super_admin" ? "bg-red-50 text-red-700 border border-red-100" :
                          member.role === "manager" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          "bg-zinc-100 text-zinc-700 border border-zinc-200"
                        }`}>
                          {member.role === "super_admin" ? "Super Admin" : member.role === "manager" ? "Manager" : "Staff Member"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-zinc-550">
                        {member.permissions?.manageProperties ? "Write Access" : "No Access"}
                      </td>
                      <td className="py-4 px-4 text-zinc-550">
                        {member.permissions?.manageApplications ? "Review Access" : "No Access"}
                      </td>
                      <td className="py-4 px-4 text-zinc-550">
                        {member.permissions?.viewInquiries ? "View Access" : "No Access"}
                      </td>
                      <td className="py-4 px-4 text-zinc-550 font-mono">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingTeamMember(member);
                              setTeamUsername(member.username);
                              setTeamPassword("");
                              setTeamRole(member.role);
                              setTeamPermProperties(member.permissions?.manageProperties || false);
                              setTeamPermApplications(member.permissions?.manageApplications || false);
                              setTeamPermInquiries(member.permissions?.viewInquiries || false);
                              setTeamError("");
                              setTeamSuccess("");
                              setShowAddTeamModal(true);
                            }}
                            className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer font-bold"
                          >
                            Edit
                          </button>
                          {member.username !== username && (
                            <button
                              onClick={() => {
                                setPopup({
                                  isOpen: true,
                                  type: "confirm",
                                  title: "Delete Team Member",
                                  message: `Are you sure you want to permanently delete team member "${member.username}"?`,
                                  onConfirm: async () => {
                                    setPopup((p: any) => ({ ...p, isOpen: false }));
                                    try {
                                      const res = await fetch(`/api/admin/team?id=${member._id}`, { method: "DELETE" });
                                      const data = await res.json();
                                      if (data.success) {
                                        setTeam((prev) => prev.filter((m) => m._id !== member._id));
                                        setPopup({
                                          isOpen: true,
                                          type: "success",
                                          title: "Deleted Successfully",
                                          message: "The administrative account was deleted.",
                                          onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
                                        });
                                      } else {
                                        setPopup({
                                          isOpen: true,
                                          type: "warning",
                                          title: "Delete Failed",
                                          message: data.message || "Failed to delete team member.",
                                          onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
                                        });
                                      }
                                    } catch (err) {
                                      console.error("Delete team error:", err);
                                    }
                                  },
                                  onCancel: () => setPopup((p: any) => ({ ...p, isOpen: false }))
                                });
                              }}
                              className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-600 border border-red-100 text-red-700 hover:text-white transition-colors cursor-pointer font-bold"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 5: Manage Users */}
        {activeTab === "users" && role === "super_admin" && (
          <section className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-zinc-150 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Customer Accounts Directory</h2>
                <p className="text-xs text-zinc-500 font-medium">Monitor registered user profiles and manage tenancy records.</p>
              </div>
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-black focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-700">
                <thead className="text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-100">
                  <tr><th className="py-3.5 px-4">Customer Name</th><th className="py-3.5 px-4">Email Address</th><th className="py-3.5 px-4">Contact Phone</th><th className="py-3.5 px-4">Registered Date</th><th className="py-3.5 px-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {users
                    .filter((u) =>
                      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                    )
                    .map((customer) => (
                      <tr key={customer._id} className="hover:bg-zinc-50 transition-colors"><td className="py-4 px-4 text-zinc-900 font-bold">{customer.fullName}</td>
                        <td className="py-4 px-4 text-zinc-650 font-mono">{customer.email}</td>
                        <td className="py-4 px-4 text-zinc-550">{customer.phone || "—"}</td>
                        <td className="py-4 px-4 text-zinc-500 font-mono">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setPopup({
                                isOpen: true,
                                type: "confirm",
                                title: "Confirm Account Deletion",
                                message: `Are you sure you want to permanently delete customer "${customer.fullName}"? This will delete all applications and support notifications associated with this user.`,
                                onConfirm: async () => {
                                  setPopup((p: any) => ({ ...p, isOpen: false }));
                                  try {
                                    const res = await fetch(`/api/admin/users?id=${customer._id}`, { method: "DELETE" });
                                    const data = await res.json();
                                    if (data.success) {
                                      setUsers((prev) => prev.filter((u) => u._id !== customer._id));
                                      setApplications((prev) => prev.filter((a) => a.userId !== customer._id));
                                      setPopup({
                                        isOpen: true,
                                        type: "success",
                                        title: "Account Deleted",
                                        message: "The customer account and all associated applications were deleted.",
                                        onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
                                      });
                                    } else {
                                      setPopup({
                                        isOpen: true,
                                        type: "warning",
                                        title: "Delete Failed",
                                        message: data.message || "Failed to delete user account.",
                                        onConfirm: () => setPopup((p: any) => ({ ...p, isOpen: false }))
                                      });
                                    }
                                  } catch (err) {
                                    console.error("Delete user error:", err);
                                  }
                                },
                                onCancel: () => setPopup((p: any) => ({ ...p, isOpen: false }))
                              });
                            }}
                            className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-600 border border-red-100 text-red-700 hover:text-white transition-colors cursor-pointer text-[10px] font-extrabold uppercase tracking-wider"
                          >
                            Delete Account
                          </button>
                        </td></tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      {/* Credentials Modal Popup */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-fadeIn">
            <div className="border-b border-zinc-150 pb-3">
              <h3 className="text-base font-bold text-zinc-950">Update Landlord Credentials</h3>
              <p className="text-xs text-zinc-500">Edit portal access username and password settings.</p>
            </div>

            {credError && (
              <p className="p-3 bg-red-50 text-red-650 border border-red-150 rounded-xl text-xs font-semibold">
                ⚠️ {credError}
              </p>
            )}

            {credSuccess && (
              <p className="p-3 bg-emerald-50 text-emerald-650 border border-emerald-150 rounded-xl text-xs font-semibold">
                ✓ {credSuccess}
              </p>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCredError("");
                setCredSuccess("");

                if (!newAdminUsername.trim()) {
                  setCredError("Username is required.");
                  return;
                }

                if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
                  setCredError("Passwords do not match.");
                  return;
                }

                setCredLoading(true);
                try {
                  const res = await fetch("/api/admin/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      username: newAdminUsername,
                      password: newAdminPassword || undefined
                    })
                  });

                  const data = await res.json();
                  if (data.success) {
                    setCredSuccess("Credentials updated successfully!");
                    setUsername(data.username);
                    setTimeout(() => {
                      setShowCredentialsModal(false);
                      setCredSuccess("");
                    }, 1500);
                  } else {
                    setCredError(data.message || "Failed to update credentials.");
                  }
                } catch (err) {
                  setCredError("Network error. Failed to save changes.");
                } finally {
                  setCredLoading(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="block font-bold uppercase text-zinc-500">Username</label>
                <input
                  type="text"
                  required
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase text-zinc-500">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase text-zinc-500">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowCredentialsModal(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={credLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {credLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-in relative">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-105 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="border-b border-zinc-150 pb-3 pr-8">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono font-bold text-zinc-550 uppercase tracking-wider text-xs bg-zinc-100 px-2 py-0.5 rounded-lg">
                  {selectedApplication.applicationId}
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${
                  selectedApplication.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  selectedApplication.status === "Rejected" ? "bg-red-50 text-red-700 border-red-100" :
                  "bg-amber-50 text-amber-700 border-amber-100"
                }`}>
                  {selectedApplication.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-955">Tenancy File Assessment</h3>
              <p className="text-xs text-zinc-500 font-semibold">Screen applicant profile parameters and property details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              {/* Applicant Details */}
              <div className="space-y-4">
                <h4 className="font-extrabold uppercase text-amber-600 tracking-wider border-b border-zinc-150 pb-1">Applicant Profile</h4>
                <div className="space-y-2">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Full Name</span>
                    <span className="font-bold text-zinc-900 text-sm">{selectedApplication.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Email Address</span>
                    <span className="font-mono text-zinc-700">{selectedApplication.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Employment Status</span>
                    <span className="font-bold text-zinc-700">{selectedApplication.employmentStatus}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Annual Income</span>
                    <span className="font-bold text-zinc-900 text-sm">${selectedApplication.annualIncome.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Income Baseline Check</span>
                    <span className={`inline-flex items-center text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-lg border mt-1 ${
                      selectedApplication.annualIncome >= selectedApplication.propertyPrice * 30 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {selectedApplication.annualIncome >= selectedApplication.propertyPrice * 30 
                        ? "✓ Clears 30x Rent Baseline" 
                        : "⚠ Below 30x Rent Baseline"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Desired Move-in Date</span>
                    <span className="font-bold text-zinc-700 font-mono">
                      {new Date(selectedApplication.moveInDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h4 className="font-extrabold uppercase text-amber-600 tracking-wider border-b border-zinc-150 pb-1">Property Specifications</h4>
                <div className="space-y-2">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Property Title</span>
                    <span className="font-bold text-zinc-900">{selectedApplication.propertyName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Monthly Lease Price</span>
                    <span className="font-bold text-zinc-900">${selectedApplication.propertyPrice}/month</span>
                  </div>
                  
                  {/* Pull extra info from properties array if matched */}
                  {(() => {
                    const match = properties.find((p) => p._id === selectedApplication.propertyId);
                    if (!match) return null;
                    return (
                      <>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-zinc-400">Layout size</span>
                          <span className="font-bold text-zinc-700">
                            {match.beds} Bed / {match.baths} Bath ({match.sqft} sqft)
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-zinc-400">Location address</span>
                          <span className="font-bold text-zinc-700">{match.location || "Metro City"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-zinc-400">Pet Policy</span>
                          <span className="font-medium text-zinc-650">{match.petPolicy}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-zinc-400">Included Utilities</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.utilities.map((util, index) => (
                              <span key={index} className="bg-zinc-100 text-zinc-750 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                                {util}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Lifecycle Control Buttons inside modal */}
            {(role === "super_admin" || permissions.manageApplications) && selectedApplication.status === "Under Review" && (
              <div className="border-t border-zinc-150 pt-4 flex gap-3 justify-end text-xs font-semibold">
                <button
                  onClick={() => handleMutateStatus(selectedApplication._id, "Rejected")}
                  className="px-5 py-2.5 bg-zinc-105 hover:bg-red-50 hover:text-red-750 border border-zinc-200 hover:border-red-200 rounded-2xl text-zinc-700 cursor-pointer transition-colors font-bold"
                >
                  Reject Tenancy
                </button>
                <button
                  onClick={() => handleMutateStatus(selectedApplication._id, "Approved")}
                  className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-600 border border-emerald-100 text-emerald-700 hover:text-white rounded-2xl cursor-pointer transition-colors font-bold"
                >
                  Approve Tenancy
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Member Creation/Editing Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-fadeIn">
            <div className="border-b border-zinc-150 pb-3">
              <h3 className="text-base font-bold text-zinc-950">
                {editingTeamMember ? "Modify Team Account" : "Register Team Account"}
              </h3>
              <p className="text-xs text-zinc-550 font-medium">
                {editingTeamMember 
                  ? `Update role and permissions settings for ${editingTeamMember.username}.`
                  : "Create portal access username and password configurations."
                }
              </p>
            </div>

            {teamError && (
              <p className="p-3 bg-red-50 text-red-650 border border-red-150 rounded-xl text-xs font-semibold font-bold">
                ⚠️ {teamError}
              </p>
            )}

            {teamSuccess && (
              <p className="p-3 bg-emerald-50 text-emerald-650 border border-emerald-150 rounded-xl text-xs font-semibold font-bold">
                ✓ {teamSuccess}
              </p>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setTeamError("");
                setTeamSuccess("");

                if (!teamUsername.trim()) {
                  setTeamError("Username is required.");
                  return;
                }

                if (!editingTeamMember && !teamPassword) {
                  setTeamError("Password is required for new accounts.");
                  return;
                }

                setTeamLoading(true);
                try {
                  const url = "/api/admin/team";
                  const method = editingTeamMember ? "PUT" : "POST";
                  const body = {
                    id: editingTeamMember?._id,
                    username: teamUsername,
                    password: teamPassword || undefined,
                    role: teamRole,
                    permissions: {
                      manageProperties: teamPermProperties,
                      manageApplications: teamPermApplications,
                      viewInquiries: teamPermInquiries
                    }
                  };

                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                  });

                  const data = await res.json();
                  if (data.success) {
                    setTeamSuccess(editingTeamMember ? "Account modified successfully!" : "Account created successfully!");
                    await fetchTeam();
                    setTimeout(() => {
                      setShowAddTeamModal(false);
                      setTeamSuccess("");
                    }, 1200);
                  } else {
                    setTeamError(data.message || "Operation failed.");
                  }
                } catch (err) {
                  setTeamError("Server connection error.");
                } finally {
                  setTeamLoading(false);
                }
              }}
              className="space-y-4 text-xs font-bold text-zinc-700"
            >
              <div className="space-y-1.5">
                <label className="block font-bold uppercase text-zinc-500">Username</label>
                <input
                  type="text"
                  required
                  disabled={!!editingTeamMember}
                  value={teamUsername}
                  onChange={(e) => setTeamUsername(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-60 transition-all font-bold"
                  placeholder="e.g. manager@rentora.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase text-zinc-500">
                  {editingTeamMember ? "New Password (Optional)" : "Password"}
                </label>
                <input
                  type="password"
                  value={teamPassword}
                  onChange={(e) => setTeamPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-bold"
                  placeholder={editingTeamMember ? "Leave blank to keep password" : "••••••••"}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase text-zinc-500">Role Select</label>
                <select
                  value={teamRole}
                  onChange={(e) => {
                    const r = e.target.value;
                    setTeamRole(r);
                    if (r === "manager") {
                      setTeamPermProperties(true);
                      setTeamPermApplications(true);
                      setTeamPermInquiries(true);
                    } else if (r === "team_member") {
                      setTeamPermProperties(false);
                      setTeamPermApplications(false);
                      setTeamPermInquiries(true);
                    } else if (r === "super_admin") {
                      setTeamPermProperties(true);
                      setTeamPermApplications(true);
                      setTeamPermInquiries(true);
                    }
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-black focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
                >
                  <option value="team_member">Staff Member</option>
                  <option value="manager">Manager</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="space-y-2 border-t border-zinc-150 pt-3">
                <span className="block font-bold uppercase text-zinc-500">Access Permissions</span>
                <div className="space-y-2.5 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800">
                    <input
                      type="checkbox"
                      checked={teamPermProperties}
                      onChange={(e) => setTeamPermProperties(e.target.checked)}
                      disabled={teamRole === "super_admin"}
                      className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Manage Properties Listings</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800">
                    <input
                      type="checkbox"
                      checked={teamPermApplications}
                      onChange={(e) => setTeamPermApplications(e.target.checked)}
                      disabled={teamRole === "super_admin"}
                      className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Review Tenancy Applications</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800">
                    <input
                      type="checkbox"
                      checked={teamPermInquiries}
                      onChange={(e) => setTeamPermInquiries(e.target.checked)}
                      disabled={teamRole === "super_admin"}
                      className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>View Customer Inquiries</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={teamLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50 font-bold"
                >
                  {teamLoading ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Popup Dialog component wrapper */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={popup.onConfirm}
        onCancel={popup.onCancel}
      />
    </div>
  );
}
