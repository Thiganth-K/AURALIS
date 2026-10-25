"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Library } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Library", href: "/library", icon: Library },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#090909]/95 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-around select-none">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-[#D7FF3F]" : "text-[#71717A] hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
