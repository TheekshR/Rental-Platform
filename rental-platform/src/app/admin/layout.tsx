import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rentora Landlord Portal",
  description: "Secure Admin Control Center for managing properties, applications, and inquiries.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 antialiased selection:bg-amber-500 selection:text-white font-sans">
      {children}
    </div>
  );
}
