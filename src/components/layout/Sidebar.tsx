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
  Plus,
  Disc3,
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
    { label: "Home", href: "/", icon: Home, indicator: "▶" },
    { label: "Discover", href: "/discover", icon: Compass, indicator: "◈" },
    { label: "Search", href: "/search", icon: Search, indicator: "⌕" },
  ];

  const libraryNav = [
    { label: "Liked Songs", href: "/library?tab=liked", icon: Heart, indicator: "♡", highlight: true },
    { label: "Recently Played", href: "/library?tab=history", icon: Clock, indicator: "◷" },
    { label: "Playlists", href: "/library?tab=playlists", icon: ListMusic, indicator: "▣" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0d0d0d] border-r-2 border-black shadow-[2px_0px_0px_rgba(255,255,255,0.06)] h-screen shrink-0 pb-28 select-none z-30">
      {/* Brand Console Header */}
      <div className="px-5 py-5 border-b-2 border-black bg-[#121212] shadow-[0_2px_0_rgba(255,255,255,0.05)]">
        <Logo size="md" />
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {/* Main Console Navigation */}
        <div>
          <div className="px-2 pb-2 text-[10px] font-pixel uppercase tracking-widest text-[#71717A] flex items-center gap-1.5">
            <span className="text-[#D7FF3F]">/</span>
            <span>MAIN CONSOLE</span>
          </div>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-none text-xs font-pixel tracking-wider transition-all border ${
                    isActive
                      ? "bg-[#D7FF3F] text-black border-black shadow-[2px_2px_0px_#000000] font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#161616] border-transparent hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-black" : "text-[#71717A]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[10px] ${isActive ? "text-black font-black" : "text-[#52525B]"}`}>
                    {item.indicator}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Your Library Section */}
        <div>
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-[10px] font-pixel tracking-widest uppercase text-[#71717A] flex items-center gap-1.5">
              <span className="text-[#C381B5]">/</span>
              <span>AUDIO ARCHIVE</span>
            </span>
            <Link
              href="/library?tab=playlists"
              className="text-[#71717A] hover:text-[#D7FF3F] p-1 border border-white/5 hover:border-[#D7FF3F]/30 bg-[#141414] shadow-[1px_1px_0px_#000]"
              title="Create new cassette"
            >
              <Plus className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-1">
            {libraryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === "/library" && typeof window !== "undefined" && window.location.search.includes(item.href.split("?")[1] || "");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-none text-xs font-pixel tracking-wider transition-all border ${
                    isActive
                      ? "bg-[#D7FF3F] text-black border-black shadow-[2px_2px_0px_#000000] font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#161616] border-transparent hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        item.highlight && !isActive
                          ? "text-rose-400"
                          : isActive
                          ? "text-black"
                          : "text-[#71717A]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[10px] ${isActive ? "text-black" : "text-[#52525B]"}`}>
                    {item.indicator}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Curated Playlists / Cassettes Quick List */}
        {playlists.length > 0 && (
          <div>
            <div className="px-2 pb-2 text-[10px] font-pixel tracking-widest uppercase text-[#71717A] flex items-center gap-1.5">
              <Disc3 className="w-3 h-3 text-[#D7FF3F]" />
              <span>CASSETTES</span>
            </div>
            <div className="space-y-1">
              {playlists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/playlist/${pl.id}`}
                  className="flex items-center justify-between px-3 py-1.5 text-[11px] font-pixel text-[#A1A1AA] hover:text-white hover:bg-[#161616] border border-transparent hover:border-white/10 transition-colors truncate"
                >
                  <span className="truncate">▸ {pl.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* System Status Deck Footer */}
      <div className="p-3 border-t-2 border-black bg-[#121212] space-y-2">
        <div className="flex items-center justify-between px-2 py-1 bg-[#090909] border border-white/10 text-[9px] font-pixel text-[#A1A1AA]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#D7FF3F] animate-pulse inline-block" />
            <span>CONSOLE READY</span>
          </span>
          <span className="text-[#D7FF3F]">FLAC 24-BIT</span>
        </div>
      </div>
    </aside>
  );
}
