"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ collapsed = false, className = "", size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const textSizes = {
    sm: "text-base tracking-widest",
    md: "text-lg tracking-wider",
    lg: "text-xl tracking-wider",
  };

  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
      aria-label="AURALIS Home"
    >
      {/* Brand Icon: Dynamic geometric acoustic wave with neon chartreuse accent */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-lg bg-[#181818] border border-white/10 p-1 shadow-md shadow-black/50 group-hover:border-[#D7FF3F]/30 transition-colors`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle audio bars / pulse */}
          <rect x="3" y="10" width="2" height="4" rx="1" fill="#71717A" />
          <rect x="7" y="6" width="2.2" height="12" rx="1.1" fill="#FFFFFF" />
          <rect x="11.2" y="3.5" width="2.4" height="17" rx="1.2" fill="#D7FF3F" />
          <rect x="15.8" y="7" width="2.2" height="10" rx="1.1" fill="#FFFFFF" />
          <rect x="20" y="10.5" width="2" height="3" rx="1" fill="#71717A" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span className={`font-semibold font-sans uppercase text-white ${textSizes[size]}`}>
            AURALIS
          </span>
          <span className="text-[9px] tracking-widest text-[#71717A] uppercase -mt-1 font-mono">
            Hi-Fi Audio
          </span>
        </div>
      )}
    </Link>
  );
}
