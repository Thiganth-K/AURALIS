"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Library } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/", icon: Home, indicator: "▶" },
    { label: "Discover", href: "/discover", icon: Compass, indicator: "◈" },
    { label: "Search", href: "/search", icon: Search, indicator: "⌕" },
    { label: "Library", href: "/library", icon: Library, indicator: "▣" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0e0e0e]/98 backdrop-blur-md border-t-2 border-black shadow-[0_-2px_0_rgba(255,255,255,0.06)] px-2 flex items-center justify-around select-none">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 transition-all relative ${
              isActive
                ? "text-[#D7FF3F]"
                : "text-[#71717A] hover:text-white"
            }`}
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-[2px] bg-[#D7FF3F] shadow-[0_0_6px_#D7FF3F]" />
            )}
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-pixel uppercase tracking-widest">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
