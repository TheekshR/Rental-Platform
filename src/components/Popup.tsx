"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface PopupProps {
  isOpen: boolean;
  type: "success" | "warning" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Popup({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: PopupProps) {
  const pathname = usePathname();
  const isLightOnly = pathname?.startsWith("/admin");

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const containerClasses = `relative z-10 w-full max-w-md overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl shadow-amber-500/5 animate-scale-in ${
    isLightOnly 
      ? "border-zinc-150 bg-white" 
      : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950"
  }`;

  const titleClasses = `text-lg font-extrabold tracking-tight ${
    isLightOnly ? "text-zinc-950" : "text-zinc-950 dark:text-white"
  }`;

  const messageClasses = `text-xs sm:text-sm leading-relaxed font-semibold ${
    isLightOnly ? "text-zinc-500" : "text-zinc-500 dark:text-zinc-400"
  }`;

  const cancelBtnClasses = `w-full sm:order-1 rounded-2xl border font-bold py-3.5 text-xs transition-colors cursor-pointer text-center ${
    isLightOnly
      ? "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
  }`;

  const confirmBtnClasses = `w-full sm:order-2 rounded-2xl font-bold py-3.5 text-xs transition-all hover:shadow-md cursor-pointer text-center ${
    isLightOnly
      ? "bg-zinc-900 hover:bg-zinc-800 text-white"
      : "bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950"
  }`;

  const successIconBg = isLightOnly ? "bg-emerald-50" : "bg-emerald-50 dark:bg-emerald-950/40";
  const warningIconBg = isLightOnly ? "bg-rose-50" : "bg-rose-50 dark:bg-rose-950/40";
  const confirmIconBg = isLightOnly ? "bg-amber-50" : "bg-amber-50 dark:bg-amber-950/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={type === "confirm" ? onCancel : onConfirm}
      />

      {/* Modal Container */}
      <div className={containerClasses}>
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />

        {/* Icon */}
        <div className="flex justify-center mb-5">
          {type === "success" && (
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-emerald-500 ${successIconBg}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          )}
          {type === "warning" && (
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-rose-500 ${warningIconBg}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          )}
          {type === "confirm" && (
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-amber-500 ${confirmIconBg}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <h3 className={titleClasses}>
            {title}
          </h3>
          <p className={messageClasses}>
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {type === "confirm" ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className={cancelBtnClasses}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={confirmBtnClasses}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              className={confirmBtnClasses}
            >
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
