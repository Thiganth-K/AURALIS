"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Library } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Library", href: "/library", icon: Library },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 px-2 flex items-center justify-around select-none font-mono"
      style={{
        backgroundColor: "#FAF7EE",
        borderTop: "2px solid #111111",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href === "/home" && pathname === "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center py-1 px-3 transition-all relative"
            style={{
              color: isActive ? "#F05A28" : "#7A7166",
            }}
          >
            {isActive && (
              <span
                className="absolute top-0 w-8 h-[2.5px]"
                style={{ backgroundColor: "#F05A28" }}
              />
            )}
            <Icon className="w-4 h-4 mb-0.5 stroke-[2.2]" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
