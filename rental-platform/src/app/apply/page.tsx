"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Fallback list of properties to choose from if database fetch fails
const fallbackProperties = [
  { id: "1", name: "Skyline Premium Suite", price: 1850 },
  { id: "2", name: "Urban Loft Studio", price: 950 },
  { id: "3", name: "Metro Hub Headquarters", price: 3400 },
  { id: "4", name: "Oakwood Heights Villa", price: 4900 },
  { id: "5", name: "Waterfront Vista Apartment", price: 2200 },
  { id: "6", name: "Silicon Square Tech Suite", price: 2800 }
];

function ApplyContent() {
  const searchParams = useSearchParams();

  // 1. Wizard Form State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Applicant Data Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("Employed");
  const [annualIncome, setAnnualIncome] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  
  // Selected property state
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedPropertyPrice, setSelectedPropertyPrice] = useState(1500);
  const [selectedPropertyName, setSelectedPropertyName] = useState("");

  const [availableProperties, setAvailableProperties] = useState<typeof fallbackProperties>([]);
  const [generatedAppId, setGeneratedAppId] = useState("");

  // 3. Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setFullName(data.user.fullName);
          setEmail(data.user.email);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Load properties dynamically from database
  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        if (data.success && data.properties && data.properties.length > 0) {
          const mapped = data.properties.map((p: any) => ({
            id: p._id,
            name: p.title,
            price: p.price
          }));
          setAvailableProperties(mapped);
          syncSelection(mapped);
        } else {
          setAvailableProperties(fallbackProperties);
          syncSelection(fallbackProperties);
        }
      } catch (err) {
        console.log("Failed to fetch database properties for application form, using fallback", err);
        setAvailableProperties(fallbackProperties);
        syncSelection(fallbackProperties);
      }
    }

    function syncSelection(list: typeof fallbackProperties) {
      const propertyIdParam = searchParams.get("propertyId");
      const nameParam = searchParams.get("name");
      const priceParam = searchParams.get("price");

      if (propertyIdParam) {
        const found = list.find((p) => p.id === propertyIdParam);
        if (found) {
          setSelectedPropertyId(found.id);
          setSelectedPropertyName(found.name);
          setSelectedPropertyPrice(found.price);
          return;
        }
      }
      
      // Default choice
      if (list.length > 0) {
        setSelectedPropertyId(list[0].id);
        setSelectedPropertyName(list[0].name);
        setSelectedPropertyPrice(list[0].price);
      }
    }

    loadProperties();
  }, [searchParams]);

  // Update name and price state when dropdown changes manually
  const handlePropertyChange = (propertyId: string) => {
    const found = availableProperties.find((p) => p.id === propertyId);
    if (found) {
      setSelectedPropertyId(found.id);
      setSelectedPropertyName(found.name);
      setSelectedPropertyPrice(found.price);
    }
  };

  // Helper validation: Check if email is valid format
  const validateEmail = (input: string) => {
    return /\S+@\S+\.\S+/.test(input);
  };

  // 4. Form Wizard Steps Navigation & Validation
  const handleNextStep = () => {
    const stepErrors: Record<string, string> = {};

    // Validate Step 1
    if (step === 1) {
      if (!fullName.trim()) stepErrors.fullName = "Full name is required.";
      if (!email.trim()) {
        stepErrors.email = "Email is required.";
      } else if (!validateEmail(email)) {
        stepErrors.email = "Please enter a valid email address.";
      }
    }

    // Validate Step 2
    if (step === 2) {
      if (!annualIncome) {
        stepErrors.annualIncome = "Gross annual income is required.";
      } else if (Number(annualIncome) <= 0) {
        stepErrors.annualIncome = "Income must be a positive number.";
      } else {
        // Validation Rule: Annual income must be at least 30x the monthly rent
        const requiredMinIncome = selectedPropertyPrice * 30;
        if (Number(annualIncome) < requiredMinIncome) {
          stepErrors.annualIncome = `Income does not meet baseline constraint. Minimum required is $${requiredMinIncome.toLocaleString()} (30x monthly rent).`;
        }
      }
    }

    // If there are errors, stop navigation and set errors state
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    // Clear errors and proceed
    setErrors({});
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep(step - 1);
  };

  // 5. Final Form Submission to Database API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors: Record<string, string> = {};

    // Validate Step 3 fields
    if (!moveInDate) {
      stepErrors.moveInDate = "Proposed move-in date is required.";
    } else {
      // Validation Rule: Move-in date must be a future date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(moveInDate);
      if (selectedDate <= today) {
        stepErrors.moveInDate = "Move-in date must be in the future.";
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          email,
          employmentStatus,
          annualIncome: Number(annualIncome),
          moveInDate,
          propertyId: selectedPropertyId
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.application) {
        setGeneratedAppId(data.application.applicationId);
        setIsSubmitted(true);
      } else {
        setErrors({ submit: data.message || "Failed to submit application." });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
      setErrors({ submit: "An error occurred while connecting to the server. Please try again." });
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-zinc-400 font-semibold tracking-wider uppercase">Checking Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 pt-36 pb-16 text-center">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Sign In Required
            </h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
              To submit a tenancy application for Rentora properties, please create an account or sign in first.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/login?redirect=/apply"
              className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer"
            >
              Sign In to Continue
            </Link>
            
            <Link
              href="/signup?redirect=/apply"
              className="block w-full py-3 border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl text-xs transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Confirmation Screen on Success
  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-xl px-6 pt-32 pb-16 text-center">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
          {/* Success Animated Circle */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Application Submitted!
            </h1>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Status: <span className="text-amber-500 font-bold">Under Review</span>
            </p>
          </div>

          <div className="border-t border-b border-zinc-100 dark:border-zinc-800 py-6 text-left text-xs space-y-3 font-semibold">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Applicant Name</span>
              <span className="text-zinc-900 dark:text-white font-bold">{fullName}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Contact Email</span>
              <span className="text-zinc-900 dark:text-white font-bold">{email}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Property Applied</span>
              <span className="text-zinc-900 dark:text-white font-bold max-w-[200px] text-right truncate">{selectedPropertyName}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Monthly Rate</span>
              <span className="text-zinc-900 dark:text-white font-bold">${selectedPropertyPrice}/mo</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Proposed Move-in</span>
              <span className="text-zinc-900 dark:text-white font-bold">{moveInDate}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Application ID</span>
              <span className="text-amber-600 font-bold uppercase">{generatedAppId}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Thank you for applying. We have saved your tenancy application to the database. An administrator will review your files shortly and reach out via email.
          </p>

          <Link
            href="/listings"
            className="block w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Return to Property Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 pt-32 pb-12">
      {/* Headings */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          Tenancy Application
        </h1>
        <p className="text-zinc-500 text-sm">
          Please complete the step-by-step form to apply for your lease.
        </p>
      </div>

      {/* Main Wizard Form Wrapper */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Progress Bar Header */}
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-400 mb-6">
          <span>Step {step} of 3</span>
          <span className="text-amber-600">
            {step === 1 ? "Contact Information" : step === 2 ? "Financial Suitability" : "Move-in Parameters"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Global Submission Error */}
        {errors.submit && (
          <p className="mb-6 p-4 rounded-2xl text-xs font-semibold bg-red-50 text-red-500 border border-red-100">
            ⚠️ {errors.submit}
          </p>
        )}

        {/* Wizard Step 1: Contact Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                readOnly
                className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-zinc-500 focus:outline-none transition-all dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 cursor-not-allowed"
              />
              <p className="text-[10px] text-zinc-400 font-medium">Locked to your verified profile name.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-zinc-500 focus:outline-none transition-all dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 cursor-not-allowed"
              />
              <p className="text-[10px] text-zinc-400 font-medium">Locked to your verified profile email.</p>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer"
            >
              Continue to Financial Info
            </button>
          </div>
        )}

        {/* Wizard Step 2: Financial Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
                Employment Status
              </label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Employed">Employed (Full-Time / Part-Time)</option>
                <option value="Self-Employed">Self-Employed / Contractor</option>
                <option value="Student">Student (Co-signer required)</option>
                <option value="Unemployed">Retired / Unemployed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
                Gross Annual Income ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 65000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                className={`w-full bg-zinc-50 focus:bg-white border focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none transition-all dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 ${
                  errors.annualIncome ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                }`}
              />
              {errors.annualIncome && <p className="text-xs font-medium text-red-500 leading-relaxed">{errors.annualIncome}</p>}
              
              <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900/30 text-[10px] text-zinc-500 leading-relaxed font-medium">
                💡 **Requirement Policy**: The annual income must be at least **30 times the monthly rent** of the selected property. For **{selectedPropertyName}** (${selectedPropertyPrice}/mo), your minimum gross annual income must be **${(selectedPropertyPrice * 30).toLocaleString()}**.
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevStep}
                className="flex-1 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 rounded-2xl text-xs font-bold py-3.5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs py-3.5 transition-colors cursor-pointer"
              >
                Continue to Dates
              </button>
            </div>
          </div>
        )}

        {/* Wizard Step 3: Move-in Parameters */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
                Selected Property
              </label>
              {/* Dropdown allows selecting a different property than prefilled */}
              <select
                value={selectedPropertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {availableProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price} / mo)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
                Proposed Move-in Date
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className={`w-full bg-zinc-50 focus:bg-white border focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none transition-all dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 cursor-pointer ${
                  errors.moveInDate ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                }`}
              />
              {errors.moveInDate && <p className="text-xs font-medium text-red-500">{errors.moveInDate}</p>}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 rounded-2xl text-xs font-bold py-3.5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-400 text-white font-bold rounded-2xl text-xs py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}
