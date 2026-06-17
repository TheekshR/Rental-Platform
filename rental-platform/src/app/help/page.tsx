"use client";

import { useState } from "react";

export default function HelpPage() {
  // 1. Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("Lease Questions");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // 2. Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validations
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all the required fields.");
      return;
    }

    setLoading(true);

    async function sendInquiry() {
      try {
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            inquiryType,
            message,
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.success) {
          setSubmitted(true);
          setFullName("");
          setEmail("");
          setInquiryType("Lease Questions");
          setMessage("");
        } else {
          setError(data.message || "Failed to submit inquiry.");
        }
      } catch (err) {
        console.error("Inquiry logging failed:", err);
        setLoading(false);
        setError("Connection failed. Please try again.");
      }
    }
    sendInquiry();
  };

  // Mock FAQ data to make the Help Center look comprehensive
  const faqs = [
    {
      question: "How do I schedule a property viewing?",
      answer: "Once you identify a property you like, click on the Details page and contact our agent via the lease info portal. We can schedule both physical and virtual tours."
    },
    {
      question: "What background documents are required for application review?",
      answer: "We typically require government-issued identification, proof of income (two recent pay stubs or tax statements), and references from prior landlords."
    },
    {
      question: "Is the security deposit refundable?",
      answer: "Yes, security deposits are fully refundable at the termination of your lease, subject to property inspection and deduction of any unpaid rent or repair costs."
    },
    {
      question: "How long does the application review process take?",
      answer: "Standard applications are reviewed and processed within 2 to 3 business days once all background documents and income thresholds are verified."
    }
  ];

  // States to toggle active FAQs accordions
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (activeFaqIndex === index) {
      setActiveFaqIndex(null);
    } else {
      setActiveFaqIndex(index);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white sm:text-4xl tracking-tight">
          Help & Support Center
        </h1>
        <p className="text-zinc-500 text-sm sm:text-base">
          Have questions? Browse our FAQs or submit an inquiry to our dedicated support desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: FAQ Accordions (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center px-6 py-4.5 text-left text-xs sm:text-sm font-bold text-zinc-890 dark:text-zinc-200 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className="text-zinc-400 font-normal">
                    {activeFaqIndex === index ? "▲" : "▼"}
                  </span>
                </button>

                {/* Accordion Body */}
                {activeFaqIndex === index && (
                  <div className="px-6 pb-5 border-t border-zinc-50 dark:border-zinc-900 pt-4">
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inquiry Form (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
              General Inquiry Form
            </h2>

            {submitted ? (
              <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-950/20 text-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mx-auto">
                  ✓
                </div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  Message Logged Successfully!
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  We have logged your support inquiry into the system database. Our team will review the details and follow up with you.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-zinc-800"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl">
                    ⚠️ {error}
                  </p>
                )}

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-50 focus:bg-white border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-black dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 focus:bg-white border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-black dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    required
                  />
                </div>

                {/* Inquiry Type */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    Inquiry Type
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="Lease Questions">Lease & Agreement Questions</option>
                    <option value="Billing">Billing & Rent Payments</option>
                    <option value="Technical Support">Technical Platform Support</option>
                    <option value="Partnerships">Real Estate Partnerships</option>
                    <option value="Other">Other Issues</option>
                  </select>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    Message Body
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Type your message details here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-50 focus:bg-white border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-black dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-400 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Logging message...
                    </>
                  ) : (
                    "Submit Support Inquiry"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
