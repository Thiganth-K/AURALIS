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
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-xs tracking-wider",
    md: "text-sm tracking-wider",
    lg: "text-base tracking-wider",
  };

  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 transition-all select-none ${className}`}
      aria-label="AURALIS Home"
    >
      {/* Brand Icon: Retro Pixel Cartridge / Audio Wave */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center bg-[#121212] border border-white/20 p-1.5 shadow-[2px_2px_0px_#000000] group-hover:border-[#D7FF3F] group-hover:shadow-[2px_2px_0px_#D7FF3F] transition-all`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Stepped pixel equalizer frequency bars */}
          <rect x="2" y="12" width="3" height="6" fill="#71717A" />
          <rect x="7" y="7" width="3" height="11" fill="#FFFFFF" />
          <rect x="12" y="4" width="3" height="14" fill="#D7FF3F" />
          <rect x="17" y="9" width="3" height="9" fill="#FFFFFF" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-pixel font-bold uppercase text-white tracking-widest group-hover:text-[#D7FF3F] transition-colors ${textSizes[size]}`}>
              AURALIS
            </span>
            <span className="inline-block w-1.5 h-1.5 bg-[#D7FF3F] animate-pulse" />
          </div>
          <span className="text-[8.5px] font-pixel tracking-wider text-[#A1A1AA] uppercase flex items-center gap-1">
            <span className="text-[#D7FF3F]">♪</span> RETRO MUSIC SYSTEM
          </span>
        </div>
      )}
    </Link>
  );
}
