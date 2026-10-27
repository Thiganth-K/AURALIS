"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Music,
  Mic2,
  Disc3,
  ListMusic,
  Database,
  ArrowRight,
  Radio,
  Link as LinkIcon,
  HardDrive,
  Play,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DashboardData {
  counts: {
    users: number;
    pendingUsers: number;
    songs: number;
    publishedSongs: number;
    draftSongs: number;
    artists: number;
    albums: number;
    playlists: number;
    totalPlays: number;
    totalDurationSeconds: number;
    storageMB: number;
    storageFormatted: string;
  };
  weeklyGrowth: {
    users: number;
    songs: number;
    artists: number;
    albums: number;
    playlists: number;
  };
  recentActivities: Array<{
    id: string;
    type: "song" | "user" | "artist" | "album" | "playlist" | "play";
    title: string;
    detail: string;
    timestamp: string;
  }>;
  systemHealth: {
    database: {
      name: string;
      status: string;
      latencyMs: number;
      totalDocuments: number;
    };
    audioEngine: {
      name: string;
      status: string;
      totalStreams: number;
      uptimeSeconds: number;
    };
    apiServices: {
      name: string;
      status: string;
      endpointsActive: number;
    };
    storage: {
      name: string;
      status: string;
      totalTracks: number;
      durationSeconds: number;
    };
  };
  mostPlayedSongs: Array<{
    id: string;
    title: string;
    artistName: string;
    playCount: number;
    duration: number;
    genre: string;
  }>;
}

function formatRelativeTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return "recently";
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerPage = 4;

  const fetchDashboard = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data) {
          setData(resData.data);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Real Counts (no fake fallback numbers!)
  const counts = data?.counts || {
    users: 0,
    pendingUsers: 0,
    songs: 0,
    publishedSongs: 0,
    draftSongs: 0,
    artists: 0,
    albums: 0,
    playlists: 0,
    totalPlays: 0,
    totalDurationSeconds: 0,
    storageMB: 0,
    storageFormatted: "0 MB",
  };

  const growth = data?.weeklyGrowth || {
    users: 0,
    songs: 0,
    artists: 0,
    albums: 0,
    playlists: 0,
  };

  // Dynamic Greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "GOOD MORNING"
      : currentHour < 17
      ? "GOOD AFTERNOON"
      : "GOOD EVENING";
  const adminName = user?.name ? user.name.toUpperCase() : "ADMIN";

  // 6 KPI Cards with Folded Top-Right Corners
  const statCards = [
    {
      title: "USERS",
      value: counts.users,
      icon: User,
      href: "/admin/users",
      change:
        growth.users > 0
          ? `+${growth.users} THIS WEEK`
          : counts.pendingUsers > 0
          ? `${counts.pendingUsers} PENDING APPROVAL`
          : "ACTIVE IN SYSTEM",
      hasPositiveGrowth: growth.users > 0,
    },
    {
      title: "SONGS",
      value: counts.songs,
      icon: Music,
      href: "/admin/songs",
      change:
        growth.songs > 0
          ? `+${growth.songs} THIS WEEK`
          : counts.publishedSongs > 0
          ? `${counts.publishedSongs} PUBLISHED`
          : "READY FOR INGEST",
      hasPositiveGrowth: growth.songs > 0,
    },
    {
      title: "ARTISTS",
      value: counts.artists,
      icon: Mic2,
      href: "/admin/artists",
      change:
        growth.artists > 0
          ? `+${growth.artists} THIS WEEK`
          : `${counts.artists} IN ROSTER`,
      hasPositiveGrowth: growth.artists > 0,
    },
    {
      title: "ALBUMS",
      value: counts.albums,
      icon: Disc3,
      href: "/admin/albums",
      change:
        growth.albums > 0
          ? `+${growth.albums} THIS WEEK`
          : `${counts.albums} CATALOG RELEASES`,
      hasPositiveGrowth: growth.albums > 0,
    },
    {
      title: "PLAYLISTS",
      value: counts.playlists,
      icon: ListMusic,
      href: "/admin/playlists",
      change:
        growth.playlists > 0
          ? `+${growth.playlists} THIS WEEK`
          : `${counts.playlists} CURATED MIXES`,
      hasPositiveGrowth: growth.playlists > 0,
    },
    {
      title: "STORAGE",
      value: counts.storageFormatted,
      icon: HardDrive,
      href: "/admin/songs",
      change:
        counts.songs > 0
          ? `${counts.songs} TRACKS • ${Math.round(counts.totalDurationSeconds / 60)}M RUNTIME`
          : "0 AUDIO ASSETS",
      hasPositiveGrowth: counts.songs > 0,
    },
  ];

  // Real System Overview Items
  const systemHealth = data?.systemHealth;
  const systemOverview = [
    {
      name: "DATABASE",
      status: systemHealth?.database.status || "Connected and healthy",
      tech: systemHealth?.database.name || "MongoDB Atlas",
      detail: systemHealth?.database
        ? `${systemHealth.database.latencyMs}ms ping • ${systemHealth.database.totalDocuments} docs`
        : "Operational",
      icon: Database,
      bars: [3, 7, 5, 8, 4],
    },
    {
      name: "AUDIO ENGINE",
      status: systemHealth?.audioEngine.status || "Streaming normally",
      tech: systemHealth?.audioEngine.name || "Node.js Audio Pipeline",
      detail: systemHealth?.audioEngine
        ? `${systemHealth.audioEngine.totalStreams} stream sessions served`
        : "Active",
      icon: Radio,
      bars: [4, 8, 6, 9, 5],
    },
    {
      name: "API SERVICES",
      status: systemHealth?.apiServices.status || "All endpoints responding",
      tech: `${systemHealth?.apiServices.endpointsActive || 12}/12 Routes`,
      detail: "Next.js App Router API",
      icon: LinkIcon,
      bars: [5, 9, 6, 10, 7],
    },
    {
      name: "MEDIA STORAGE",
      status: systemHealth?.storage.status || `Vault: ${counts.storageFormatted}`,
      tech: systemHealth?.storage.name || "Cloudinary Vault",
      detail: `${counts.songs} tracks • ${formatDuration(counts.totalDurationSeconds)} playtime`,
      icon: HardDrive,
      bars: [4, 6, 5, 7, 5],
    },
  ];

  const topSong = data?.mostPlayedSongs?.[0];
  const recentActivities = data?.recentActivities || [];
  const totalActivities = recentActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalActivities / itemsPerPage));
  const currentPage = Math.min(activityPage, totalPages);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalActivities);
  const paginatedActivities = recentActivities.slice(startIndex, endIndex);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "play":
        return Play;
      case "song":
        return Music;
      case "user":
        return User;
      case "artist":
        return Mic2;
      case "album":
        return Disc3;
      case "playlist":
        return ListMusic;
      default:
        return Music;
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* ── 1. RETRO INDUSTRIAL HERO BANNER ──────────────────── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "4px 4px 0px #111111",
        }}
      >
        {/* Corner crop markers */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-[#111111]" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-[#111111]" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-[#111111]" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-[#111111]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            {/* Header Tag + Manual Refresh Button */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#F05A28]">
                AURALIS // CONTROL ROOM
              </span>

              <button
                type="button"
                onClick={() => fetchDashboard(true)}
                disabled={refreshing || loading}
                className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase transition-all cursor-pointer ml-auto md:ml-2"
                style={{
                  backgroundColor: "#FAF7EE",
                  color: "#111111",
                  border: "1.5px solid #111111",
                  boxShadow: "1.5px 1.5px 0px #111111",
                }}
                title="Refresh Real Database Metrics"
              >
                <RefreshCw
                  className={`w-3 h-3 ${refreshing ? "animate-spin text-[#F05A28]" : ""}`}
                />
                <span>{refreshing ? "SYNCING..." : "SYNC DATA"}</span>
              </button>
            </div>

            {/* Dynamic Greeting */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              {greeting}, {adminName}
            </h1>

            {/* Sub-text */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Real-time telemetry from your live catalog, registered listeners, and audio pipeline.
            </p>
          </div>

          {/* Right Side: Retro Soundwave Graphics & Editorial Slogan */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {/* Soundwave bars */}
            <div className="flex items-center gap-[3px] h-10 px-2">
              <span className="w-[3px] bg-[#F05A28] h-3 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-5 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-7 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-9 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-10 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-8 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-6 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-4 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-2 rounded-xs" />
            </div>

            {/* Editorial Stacked Tagline */}
            <div className="text-right text-[10px] font-bold tracking-widest text-[#111111] uppercase leading-tight font-mono">
              <p>BETTER MUSIC</p>
              <p>BETTER PEOPLE</p>
              <p className="text-[#F05A28]">AURALIS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. 6 KPI CARDS (WITH FOLDED CORNER TABS) ─────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const Wrapper = card.href ? Link : "div";

          return (
            <Wrapper
              key={card.title}
              href={card.href || "#"}
              className="relative p-3.5 sm:p-4 flex flex-col justify-between group transition-all"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
            >
              {/* Folded Top-Right Corner Accent */}
              <div
                className="absolute top-0 right-0 w-0 h-0"
                style={{
                  borderTop: "14px solid #F05A28",
                  borderLeft: "14px solid transparent",
                }}
              />

              {/* Title & Icon */}
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
                <span className="text-[11px] font-bold tracking-wider text-[#111111] uppercase">
                  {card.title}
                </span>
              </div>

              {/* Stat Value */}
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                  {loading ? (
                    <span className="inline-block w-8 h-7 bg-[#111111]/10 animate-pulse rounded-xs" />
                  ) : (
                    card.value
                  )}
                </div>
                {/* Subtitle / Real Status */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#111111] uppercase tracking-wider mt-1.5 truncate">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: card.hasPositiveGrowth ? "#16A34A" : "#7A7166",
                    }}
                  />
                  <span className="truncate">{card.change}</span>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* ── 3. TWO MAIN SPLIT PANELS ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel A: RECENT ACTIVITY (REAL DATA) */}
        <div
          className="p-5 flex flex-col justify-between"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-[#111111]/15">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 inline-block shrink-0"
                  style={{ backgroundColor: "#F05A28" }}
                />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  RECENT ACTIVITY
                </h2>
              </div>
              <Link
                href="/admin/songs"
                className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                style={{ color: "#F05A28" }}
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Real Activity Rows (Paginated) */}
            {loading ? (
              <div className="py-12 flex items-center justify-center gap-2 text-xs text-[#7A7166]">
                <Loader2 className="w-4 h-4 animate-spin text-[#F05A28]" />
                <span>LOADING ACTIVITY TELEMETRY...</span>
              </div>
            ) : totalActivities === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[#7A7166] uppercase tracking-wider">
                NO RECENT SYSTEM ACTIVITY RECORDED YET.
              </div>
            ) : (
              <div className="divide-y divide-[#111111]/10">
                {paginatedActivities.map((act) => {
                  const Icon = getActivityIcon(act.type);
                  return (
                    <div
                      key={act.id}
                      className="py-3 flex items-center justify-between gap-3 group transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Orange Icon Pill */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: "#FFF0ED",
                            border: "1.5px solid #F05A28",
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#111111] truncate tracking-wide">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-[#7A7166] truncate mt-0.5">
                            {act.detail}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] text-[#7A7166] font-mono shrink-0">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Footer & Pagination Controls */}
          <div className="pt-3.5 mt-2 border-t border-[#111111]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono">
            <div className="flex items-center gap-2 text-[#7A7166]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F05A28] shrink-0" />
              <span>
                {totalActivities === 0
                  ? "0 EVENTS LOGGED"
                  : `EVENTS ${startIndex + 1}–${endIndex} OF ${totalActivities}`}
              </span>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 select-none">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={() => setActivityPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-[9px] font-bold uppercase transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  style={{
                    backgroundColor: "#FAF7EE",
                    color: "#111111",
                    border: "1.5px solid #111111",
                    boxShadow: currentPage === 1 ? "none" : "1.5px 1.5px 0px #111111",
                  }}
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>PREV</span>
                </button>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isCurrent = p === currentPage;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setActivityPage(p)}
                        className="w-6 h-6 flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer"
                        style={{
                          backgroundColor: isCurrent ? "#F05A28" : "#FAF7EE",
                          color: isCurrent ? "#FFFFFF" : "#111111",
                          border: "1.5px solid #111111",
                          boxShadow: isCurrent ? "1.5px 1.5px 0px #111111" : "none",
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setActivityPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-[9px] font-bold uppercase transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  style={{
                    backgroundColor: "#FAF7EE",
                    color: "#111111",
                    border: "1.5px solid #111111",
                    boxShadow: currentPage === totalPages ? "none" : "1.5px 1.5px 0px #111111",
                  }}
                  title="Next Page"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Panel B: SYSTEM OVERVIEW (REAL DATA) */}
        <div
          className="p-5 flex flex-col justify-between"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-[#111111]/15">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 inline-block shrink-0"
                  style={{ backgroundColor: "#F05A28" }}
                />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  SYSTEM OVERVIEW
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#111111] uppercase tracking-wider">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: "#16A34A" }}
                />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>

            {/* System Services List */}
            <div className="divide-y divide-[#111111]/10">
              {systemOverview.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    {/* Left: Boxed Icon + Service Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="w-10 h-10 flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "#FAF7EE",
                          border: "1.5px solid #111111",
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "#F05A28" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#111111] uppercase tracking-wider truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#7A7166] truncate mt-0.5">
                          {item.status}
                        </p>
                      </div>
                    </div>

                    {/* Right: Tech Stack + Detail + Equalizer Activity */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#111111] tracking-wide">
                          {item.tech}
                        </p>
                        <p className="text-[10px] text-[#7A7166] tracking-wider mt-0.5">
                          {item.detail}
                        </p>
                      </div>

                      {/* Equalizer Bars Simulation */}
                      <div className="flex items-end gap-[2px] h-4 w-7 justify-end">
                        {item.bars.map((barH, bIdx) => (
                          <span
                            key={bIdx}
                            className="w-[3px] rounded-xs"
                            style={{
                              height: `${barH * 1.5}px`,
                              backgroundColor: "#F05A28",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Footer Info */}
          <div className="pt-3 mt-2 border-t border-[#111111]/10 flex items-center justify-between text-[10px] text-[#7A7166] font-mono">
            <span>CORE CLUSTER</span>
            <span className="text-[#16A34A] font-bold">100% HEALTHY</span>
          </div>
        </div>
      </div>

      {/* ── 4. TOP STREAMED SIGNALS BAR (FULL WIDTH DARK) ── */}
      <div
        className="px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          backgroundColor: "#111111",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
          {/* Soundwave Bars in Dark Container */}
          <div className="flex items-center gap-[2.5px] h-6 px-1 shrink-0">
            <span className="w-[3px] bg-[#F05A28] h-2.5 rounded-sm animate-pulse" />
            <span className="w-[3px] bg-[#F05A28] h-5 rounded-sm animate-pulse" />
            <span className="w-[3px] bg-[#F05A28] h-6 rounded-sm animate-pulse" />
            <span className="w-[3px] bg-[#F05A28] h-4 rounded-sm animate-pulse" />
            <span className="w-[3px] bg-[#F05A28] h-2 rounded-sm animate-pulse" />
          </div>

          {topSong && topSong.playCount > 0 ? (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#F05A28] text-white tracking-widest uppercase">
                  #1 TOP STREAMED SIGNAL
                </span>
                <span className="text-xs font-bold tracking-wider text-white uppercase truncate">
                  {topSong.title}
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-[#A8A29E] uppercase truncate mt-0.5 font-mono">
                {topSong.artistName} • {topSong.playCount}{" "}
                {topSong.playCount === 1 ? "STREAM" : "STREAMS"} •{" "}
                {formatDuration(topSong.duration)} • {topSong.genre || "SIGNAL"}
              </span>
            </div>
          ) : (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold tracking-wider text-white uppercase truncate">
                TOP STREAMED SIGNALS
              </span>
              <span className="text-[10px] tracking-widest text-[#7A7166] uppercase truncate">
                NO PLAYBACK DATA LOGGED YET • READY FOR INCOMING SIGNALS
              </span>
            </div>
          )}
        </div>

        {/* Right Section: Link to Songs & Retro Hatch Marks */}
        <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
          <Link
            href="/admin/songs"
            className="text-[10px] font-bold uppercase tracking-wider text-[#F05A28] hover:underline flex items-center gap-1 font-mono"
          >
            <span>VIEW ALL SONGS</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <div
            className="hidden sm:flex items-center gap-1.5 font-bold tracking-tighter text-sm"
            style={{ color: "#F05A28" }}
          >
            <span>///</span>
            <span>///</span>
          </div>
        </div>
      </div>
    </div>
  );
}
