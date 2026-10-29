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
      className={`group flex items-center gap-2.5 select-none transition-all ${className}`}
      aria-label="AURALIS Home"
    >
      {/* Brand Icon: Retro Equalizer Graphic */}
      <div className="flex items-end gap-[3px] h-6 py-0.5 shrink-0">
        <span className="w-1 bg-[#F05A28] h-3.5 transition-transform group-hover:scale-y-125" />
        <span className="w-1 bg-[#F05A28] h-5 transition-transform group-hover:scale-y-90" />
        <span className="w-1 bg-[#F05A28] h-2.5 transition-transform group-hover:scale-y-150" />
        <span className="w-1 bg-[#F05A28] h-4.5 transition-transform group-hover:scale-y-110" />
      </div>

      {!collapsed && (
        <div className="flex flex-col font-mono leading-none">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-sm tracking-widest text-[#111111] uppercase">
              AURALIS
            </span>
            <span
              className="text-[8px] font-bold px-1 py-0.5 tracking-wider uppercase"
              style={{
                backgroundColor: "#FAF7EE",
                color: "#F05A28",
                border: "1px solid #F05A28",
              }}
            >
              DECK
            </span>
          </div>
          <span className="text-[8px] font-bold tracking-widest text-[#7A7166] uppercase mt-1 leading-none">
            RETRO MUSIC SYSTEM
          </span>
        </div>
      )}
    </Link>
  );
}
