"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const { currentSong } = usePlayer();
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
    <aside
      className="hidden md:flex flex-col w-64 select-none shrink-0 z-30 justify-between h-screen pb-24 font-mono"
      style={{
        backgroundColor: "#FAF7EE",
        borderRight: "2px solid #111111",
      }}
    >
      {/* Brand Console Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          borderBottom: "2px solid #111111",
          backgroundColor: "#FAF7EE",
        }}
      >
        <Logo size="md" />
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
        {/* Main Console Navigation */}
        <div className="space-y-1.5">
          <div className="px-1 text-[10px] font-bold tracking-widest text-[#7A7166] uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span style={{ color: "#F05A28" }}>▸</span>
              <span>MAIN CONSOLE</span>
            </span>
            <span style={{ color: "#F05A28" }} className="text-xs">┐</span>
          </div>

          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    backgroundColor: isActive ? "#F05A28" : "transparent",
                    color: "#111111",
                    border: isActive ? "2px solid #111111" : "2px solid transparent",
                    boxShadow: isActive ? "2.5px 2.5px 0px #111111" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#F6EEDE";
                      e.currentTarget.style.border = "2px solid #111111";
                      e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.border = "2px solid transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs font-black">
                    {isActive ? "▶" : ">"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Audio Archive Section */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[10px] font-bold tracking-widest text-[#7A7166] uppercase">
            <span className="flex items-center gap-1.5">
              <span style={{ color: "#F05A28" }}>▸</span>
              <span>AUDIO ARCHIVE</span>
            </span>
            <Link
              href="/library?tab=playlists"
              className="w-5 h-5 flex items-center justify-center transition-all cursor-pointer"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
              }}
              title="Add playlist"
            >
              <Plus className="w-3 h-3 text-[#111111]" />
            </Link>
          </div>

          <div className="space-y-1">
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
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    backgroundColor: isActive ? "#F05A28" : "transparent",
                    color: "#111111",
                    border: isActive ? "2px solid #111111" : "2px solid transparent",
                    boxShadow: isActive ? "2.5px 2.5px 0px #111111" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#F6EEDE";
                      e.currentTarget.style.border = "2px solid #111111";
                      e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.border = "2px solid transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs font-black">
                    {isActive ? "▶" : ">"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Curated Cassettes list if available */}
        {playlists.length > 0 && (
          <div className="space-y-1 pt-2" style={{ borderTop: "1.5px solid rgba(17,17,17,0.15)" }}>
            <div className="px-1 text-[10px] font-bold tracking-widest text-[#7A7166] uppercase">
              CASSETTES
            </div>
            {playlists.slice(0, 4).map((pl) => (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className="flex items-center justify-between px-2.5 py-1 text-[11px] text-[#7A7166] hover:text-[#111111] hover:bg-[#F6EEDE] transition-colors truncate font-bold uppercase"
              >
                <span className="truncate">▸ {pl.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* System Status Deck Footer (exact match to brutalist retro UI) */}
      <div
        className="p-3.5 space-y-2.5"
        style={{
          borderTop: "2px solid #111111",
          backgroundColor: "#F6EEDE",
        }}
      >
        <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-[#111111]">
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span>CONSOLE READY</span>
          </span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.2"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1px solid #111111",
              color: "#F05A28",
            }}
          >
            FLAC 24-BIT
          </span>
        </div>

        {/* Track preview badge in sidebar */}
        <div
          onClick={() => currentSong && router.push(`/song/${currentSong.id}`)}
          className="flex items-center gap-2.5 p-2 transition-all cursor-pointer"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1.5px solid #111111",
            boxShadow: "2px 2px 0px #111111",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-1px,-1px)";
            e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              currentSong?.artworkUrl ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"
            }
            alt="Track Artwork"
            className="w-8 h-8 object-cover shrink-0"
            style={{ border: "1px solid #111111" }}
          />
          <div className="min-w-0 flex-1 font-mono">
            <p className="text-[11px] font-bold text-[#111111] truncate uppercase leading-tight">
              {currentSong?.title || "Post Malone - Sunflower"}
            </p>
            <p
              className="text-[9px] truncate leading-tight mt-0.5 font-bold uppercase"
              style={{ color: "#F05A28" }}
            >
              {currentSong?.artistName || "Post Malone"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
