"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Music,
  Mic2,
  Disc3,
  ListMusic,
  PlayCircle,
  Plus,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface DashboardData {
  counts: {
    users: number;
    songs: number;
    publishedSongs: number;
    draftSongs: number;
    artists: number;
    albums: number;
    playlists: number;
    totalPlays: number;
  };
  recentSongs: Array<{
    _id: string;
    title: string;
    artworkUrl: string;
    status: string;
    playCount: number;
    artist?: { name: string };
    createdAt: string;
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }>;
  topSongs: Array<{
    _id: string;
    title: string;
    artworkUrl: string;
    playCount: number;
    artist?: { name: string };
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const resData = await res.json();
          if (resData.success) {
            setData(resData.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
      </div>
    );
  }

  const counts = data?.counts || {
    users: 0,
    songs: 0,
    publishedSongs: 0,
    draftSongs: 0,
    artists: 0,
    albums: 0,
    playlists: 0,
    totalPlays: 0,
  };

  const statCards = [
    { title: "Total Users", value: counts.users, icon: Users, href: "/admin/users" },
    { title: "Total Songs", value: counts.songs, icon: Music, href: "/admin/songs", sub: `${counts.publishedSongs} live • ${counts.draftSongs} draft` },
    { title: "Total Artists", value: counts.artists, icon: Mic2, href: "/admin/artists" },
    { title: "Total Albums", value: counts.albums, icon: Disc3, href: "/admin/albums" },
    { title: "Total Playlists", value: counts.playlists, icon: ListMusic, href: "/admin/playlists" },
    { title: "Total Audio Plays", value: counts.totalPlays.toLocaleString(), icon: PlayCircle },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto select-none">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#242424]">
        <div>
          <h1 className="text-xl sm:text-2xl font-pixel tracking-wide text-white">
            AURALIS // CONTROL ROOM
          </h1>
          <p className="text-xs font-sans text-[#A1A1AA] mt-1">
            Real-time catalog monitoring, user administration, and transmission frequency controls.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/songs/new"
            className="retro-btn-primary px-3.5 py-1.5 text-xs font-pixel flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>[ + UPLOAD SONG ]</span>
          </Link>
          <Link
            href="/admin/users/new"
            className="retro-btn-secondary px-3.5 py-1.5 text-xs font-pixel flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>[ + ADD USER ]</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-3.5 bg-[#111111] border-2 border-[#262626] shadow-[3px_3px_0px_#000] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[#71717A] mb-3">
                <span className="text-[10px] font-pixel uppercase tracking-wider text-[#A1A1AA]">
                  {card.title}
                </span>
                <Icon className="w-3.5 h-3.5 text-[#D7FF3F]" />
              </div>
              <div>
                <div className="text-2xl font-pixel text-white">
                  {card.value}
                </div>
                {card.sub ? (
                  <p className="text-[9px] font-pixel text-[#71717A] mt-1 truncate">
                    {card.sub}
                  </p>
                ) : (
                  <p className="text-[9px] font-pixel text-[#D7FF3F] mt-1 flex items-center gap-1">
                    <span>[ ONLINE ]</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Columns: Recently Ingested Songs & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Ingested Songs */}
        <div className="p-4 bg-[#111111] border-2 border-[#262626] shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242424]">
            <h2 className="text-xs font-pixel text-white flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>// RECENTLY INGESTED SONGS</span>
            </h2>
            <Link
              href="/admin/songs"
              className="text-[10px] font-pixel text-[#A1A1AA] hover:text-[#D7FF3F] flex items-center gap-1"
            >
              <span>[ MANAGE ]</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {data?.recentSongs && data.recentSongs.length > 0 ? (
              data.recentSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between p-2 bg-[#141414] border border-[#242424] hover:border-[#D7FF3F] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.artworkUrl}
                      alt={song.title}
                      className="w-9 h-9 border border-black object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-pixel text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-[11px] font-sans text-[#71717A] truncate">
                        {song.artist?.name || "Independent"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`text-[9px] uppercase font-pixel px-1.5 py-0.5 border ${
                        song.status === "published"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-950/40 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {song.status === "published" ? "[ LIVE ]" : "[ DRAFT ]"}
                    </span>
                    <span className="text-[10px] font-pixel text-[#A1A1AA]">
                      {song.playCount} PLAYS
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-pixel text-[#71717A] py-6 text-center">
                NO SONGS INGESTED YET.
              </p>
            )}
          </div>
        </div>

        {/* Recently Registered Users */}
        <div className="p-4 bg-[#111111] border-2 border-[#262626] shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242424]">
            <h2 className="text-xs font-pixel text-white flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>// REGISTERED USERS</span>
            </h2>
            <Link
              href="/admin/users"
              className="text-[10px] font-pixel text-[#A1A1AA] hover:text-[#D7FF3F] flex items-center gap-1"
            >
              <span>[ VIEW ALL ]</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {data?.recentUsers && data.recentUsers.length > 0 ? (
              data.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2 bg-[#141414] border border-[#242424] hover:border-[#D7FF3F] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-pixel text-white truncate">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-[#71717A] truncate font-sans">
                      {u.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-pixel uppercase px-1.5 py-0.5 border ${
                        u.role === "admin"
                          ? "bg-[#D7FF3F]/10 text-[#D7FF3F] border-[#D7FF3F]/40"
                          : "bg-white/5 text-[#A1A1AA] border-[#333]"
                      }`}
                    >
                      [ {u.role.toUpperCase()} ]
                    </span>
                    <span
                      className={`text-[9px] font-pixel px-1.5 py-0.5 border ${
                        u.status === "active"
                          ? "text-emerald-400 border-emerald-500/30"
                          : "text-red-400 border-red-500/30"
                      }`}
                    >
                      {u.status === "active" ? "[ ACTIVE ]" : "[ SUSPENDED ]"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-pixel text-[#71717A] py-6 text-center">
                NO USERS FOUND.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Streamed Tracks */}
      <div className="p-4 bg-[#111111] border-2 border-[#262626] shadow-[4px_4px_0px_#000]">
        <h2 className="text-xs font-pixel text-white mb-3 flex items-center gap-2">
          <PlayCircle className="w-3.5 h-3.5 text-[#D7FF3F]" />
          <span>// TOP STREAMED SIGNALS</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {data?.topSongs && data.topSongs.length > 0 ? (
            data.topSongs.map((song, idx) => (
              <div
                key={song._id}
                className="p-2.5 bg-[#141414] border border-[#242424] flex items-center gap-2.5"
              >
                <span className="text-xs font-pixel text-[#D7FF3F]">
                  #{(idx + 1).toString().padStart(2, "0")}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={song.artworkUrl}
                  alt={song.title}
                  className="w-8 h-8 border border-black object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-pixel text-white truncate">
                    {song.title}
                  </p>
                  <p className="text-[10px] font-pixel text-[#A1A1AA]">
                    {song.playCount.toLocaleString()} PLAYS
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs font-pixel text-[#71717A]">NO PLAYBACK DATA LOGGED YET.</p>
          )}
        </div>
      </div>
    </div>
  );
}
