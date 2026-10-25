"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ collapsed = false, className = "", size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 select-none transition-all ${className}`}
      aria-label="AURALIS Home"
    >
      {/* Brand Icon: Retro Pixel Equalizer */}
      <div className="relative flex items-center justify-center p-2 rounded-md bg-[#0e072b] border border-[#5c32c4] shadow-[0_0_10px_rgba(92,50,196,0.35)] group-hover:border-[#00f0ff] group-hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          {/* Multi-colored pixel equalizer bars (pink, purple, cyan) */}
          <rect x="2" y="10" width="3" height="10" fill="#ff2a85" />
          <rect x="7" y="5" width="3" height="15" fill="#a855f7" />
          <rect x="12" y="3" width="3" height="17" fill="#00f0ff" />
          <rect x="17" y="8" width="3" height="12" fill="#d7ff3f" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-pixel font-bold uppercase text-white tracking-widest text-base group-hover:text-[#00f0ff] transition-colors leading-none">
            AURALIS
          </span>
          <span className="text-[9px] font-pixel tracking-wider text-[#ff2a85] uppercase mt-1 leading-none">
            RETRO MUSIC SYSTEM
          </span>
        </div>
      )}
    </Link>
  );
}
