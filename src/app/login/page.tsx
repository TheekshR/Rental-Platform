"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams ? searchParams.get("redirect") || "/profile" : "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        const data = await res.json();
        if (data.authenticated) {
          router.push(redirect);
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        // Force header update by reloading/refreshing state
        router.refresh();
        router.push(redirect);
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login connection error:", err);
      setLoading(false);
      setError("Failed to connect to authentication server.");
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-zinc-400 font-semibold tracking-wider uppercase">Checking Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden bg-zinc-50">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl" />

      {/* Main card wrapper */}
      <div className="relative z-10 w-full max-w-md bg-white border border-zinc-200 p-8 rounded-3xl shadow-xl space-y-8">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M12 2a5 5 0 10.001 10.001A5 5 0 0012 2z" />
              <path fillRule="evenodd" d="M12 14.5c-4.478 0-8.268 2.943-9.542 7a.25.25 0 00.24.324h18.604a.25.25 0 00.24-.324C20.268 17.443 16.478 14.5 12 14.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Sign In to Rentora
          </h1>
          <p className="text-xs text-zinc-500">
            Access your customer profile and track applications
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-semibold text-red-600 flex items-start gap-2.5">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors placeholder-zinc-400 focus:bg-white"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors placeholder-zinc-400 focus:bg-white"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-zinc-200 disabled:to-zinc-300 disabled:text-zinc-400 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="text-center text-xs text-zinc-500">
          Don't have an account?{" "}
          <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-amber-600 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-zinc-400 font-semibold tracking-wider uppercase">Loading Login...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
