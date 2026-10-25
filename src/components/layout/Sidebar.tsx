"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { usePlayer } from "@/context/PlayerContext";
import {
  Home,
  Compass,
  Search,
  Heart,
  Clock,
  Disc3,
  User,
  ListMusic,
  Plus,
} from "lucide-react";

interface PlaylistSummary {
  id: string;
  name: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentSong, setExpandedPlayerOpen } = usePlayer();
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
    { label: "Liked Songs", href: "/library?tab=liked", icon: Heart },
    { label: "Recently Played", href: "/library?tab=history", icon: Clock },
    { label: "Albums", href: "/library?tab=albums", icon: Disc3 },
    { label: "Artists", href: "/library?tab=artists", icon: User },
    { label: "Playlists", href: "/library?tab=playlists", icon: ListMusic },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#050212] border-r-2 border-[#2d1b69] shadow-[4px_0px_20px_rgba(45,27,105,0.25)] h-screen shrink-0 pb-24 select-none z-30">
      {/* Brand Console Header */}
      <div className="px-4 py-4 border-b border-[#2d1b69] bg-[#08041c]">
        <Logo size="md" />
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Main Console Navigation */}
        <div className="space-y-2">
          <div className="px-1 text-[11px] font-pixel text-[#00f0ff] flex items-center gap-1.5 tracking-wider">
            <span>---</span>
            <span>MAIN CONSOLE</span>
          </div>

          <div className="space-y-1.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-pixel tracking-wide transition-all border ${
                    isActive
                      ? "bg-[#d7ff3f] text-black border-[#d7ff3f] shadow-[0_0_12px_rgba(215,255,63,0.4)] font-bold"
                      : "bg-[#0a0520] text-white border-[#4d2db7] hover:border-[#00f0ff] hover:bg-[#120a35] shadow-[0_0_8px_rgba(77,45,183,0.15)] group"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-black" : "text-[#a79cd0] group-hover:text-white"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isActive ? "text-black" : "text-[#6d4bc7] group-hover:text-white"
                    }`}
                  >
                    &gt;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Audio Archive Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-[11px] font-pixel text-[#00f0ff] tracking-wider">
            <span className="flex items-center gap-1">
              <span>•••</span>
              <span>AUDIO ARCHIVE</span>
            </span>
            <Link
              href="/library?tab=playlists"
              className="w-5 h-5 flex items-center justify-center rounded bg-[#0a0520] border border-[#4d2db7] text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_8px_rgba(0,240,255,0.4)] transition-all"
              title="Add playlist"
            >
              <Plus className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-1.5">
            {libraryNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === "/library" &&
                typeof window !== "undefined" &&
                window.location.search.includes(item.href.split("?")[1] || "");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-pixel tracking-wide transition-all border ${
                    isActive
                      ? "bg-[#d7ff3f] text-black border-[#d7ff3f] shadow-[0_0_12px_rgba(215,255,63,0.4)] font-bold"
                      : "bg-[#0a0520] text-white border-[#4d2db7] hover:border-[#00f0ff] hover:bg-[#120a35] shadow-[0_0_8px_rgba(77,45,183,0.15)] group"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-black" : "text-[#a79cd0] group-hover:text-white"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isActive ? "text-black" : "text-[#6d4bc7] group-hover:text-white"
                    }`}
                  >
                    &gt;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Curated Cassettes list if available */}
        {playlists.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-[#2d1b69]/60">
            <div className="px-1 text-[10px] font-pixel text-[#a79cd0] uppercase tracking-wider">
              CASSETTES
            </div>
            {playlists.slice(0, 4).map((pl) => (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className="flex items-center justify-between px-2.5 py-1 text-[11px] font-pixel text-[#a79cd0] hover:text-white hover:bg-[#120a35] rounded transition-colors truncate"
              >
                <span className="truncate">▸ {pl.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* System Status Deck Footer (exact match to reference UI) */}
      <div className="p-3 border-t-2 border-[#2d1b69] bg-[#070318] space-y-2">
        <div className="flex items-center justify-between px-1 text-[10px] font-pixel">
          <span className="flex items-center gap-1.5 text-[#00f0ff]">
            <span className="w-2 h-2 bg-[#00ff88] rounded-xs shadow-[0_0_6px_#00ff88] animate-pulse inline-block" />
            <span>CONSOLE READY</span>
          </span>
          <span className="text-[#ff2a85] font-bold">FLAC 24-BIT</span>
        </div>

        {/* Track preview badge in sidebar */}
        <div
          onClick={() => currentSong && setExpandedPlayerOpen(true)}
          className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0b0622] border border-[#4d2db7] hover:border-[#00f0ff] shadow-[0_0_8px_rgba(77,45,183,0.2)] cursor-pointer transition-all"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              currentSong?.artworkUrl ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"
            }
            alt="Track Artwork"
            className="w-8 h-8 rounded object-cover border border-[#ff2a85] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-pixel text-white truncate leading-tight">
              {currentSong?.title || "Post Malone - Sunflower"}
            </p>
            <p className="text-[9px] font-pixel text-[#00f0ff] truncate leading-tight mt-0.5">
              {currentSong?.artistName || "Post Malone"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
