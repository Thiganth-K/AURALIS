"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import {
  Home,
  Compass,
  Search,
  Heart,
  Clock,
  ListMusic,
  PlusSquare,
} from "lucide-react";

interface PlaylistSummary {
  id: string;
  name: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          setPlaylists(data.data.slice(0, 10));
        }
      })
      .catch(() => {});
  }, []);

  const mainNav = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
  ];

  const libraryNav = [
    { label: "Liked Songs", href: "/library?tab=liked", icon: Heart, highlight: true },
    { label: "Recently Played", href: "/library?tab=history", icon: Clock },
    { label: "Playlists", href: "/library?tab=playlists", icon: ListMusic },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#090909] border-r border-white/5 h-screen shrink-0 pb-24 select-none">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-white/5">
        <Logo size="md" />
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-7">
        {/* Main Exploration */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#181818] text-white"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#D7FF3F]" : "text-[#71717A]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Your Library Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#71717A]">
              Your Library
            </span>
            <Link
              href="/library?tab=playlists"
              className="text-[#71717A] hover:text-white p-1 rounded"
              title="Create new playlist"
            >
              <PlusSquare className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-1">
            {libraryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#181818] text-white"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.highlight && !isActive
                        ? "text-rose-400"
                        : isActive
                        ? "text-[#D7FF3F]"
                        : "text-[#71717A]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Playlists Quick List */}
        {playlists.length > 0 && (
          <div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#71717A] px-3 mb-2 block">
              Curated Playlists
            </span>
            <div className="space-y-0.5">
              {playlists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/playlist/${pl.id}`}
                  className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] transition-colors truncate"
                >
                  <span className="truncate">{pl.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
