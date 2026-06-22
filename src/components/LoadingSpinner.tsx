"use client";

import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  fullscreen?: boolean;
}

export default function LoadingSpinner({ message = "Loading data...", fullscreen = false }: LoadingSpinnerProps) {
  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-all duration-350"
    : "flex flex-col items-center justify-center py-12 p-4 transition-all duration-350";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center h-16 w-16 mb-4 select-none">
        {/* Outer glowing orbit ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-amber-500/10 border-t-amber-500 animate-spin" />
        
        {/* Middle accent ring */}
        <div className="absolute h-12 w-12 rounded-full border border-orange-500/10 border-b-orange-500/60 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        
        {/* Inner pulsing core */}
        <div className="h-6 w-6 rounded-full bg-amber-500/20 animate-pulse border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]" />
      </div>
      
      {message && (
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 animate-pulse text-center max-w-xs leading-relaxed">
          {message}
        </p>
      )}
    </div>
  );
}
