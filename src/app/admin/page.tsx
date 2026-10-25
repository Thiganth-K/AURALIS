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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            System Operations
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Real-time catalog monitoring, user administration, and content release controls.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/songs/new"
            className="px-3.5 py-2 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#D7FF3F]/10"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>Upload Song</span>
          </Link>
          <Link
            href="/admin/users/new"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center gap-1.5 transition-colors border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add User</span>
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
              className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between text-[#71717A] mb-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
                  {card.title}
                </span>
                <Icon className="w-4 h-4 text-[#A1A1AA]" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white tracking-tight font-mono">
                  {card.value}
                </div>
                {card.sub ? (
                  <p className="text-[10px] text-[#A1A1AA] mt-1 truncate">
                    {card.sub}
                  </p>
                ) : (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Synced
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Columns: Recently Added Songs & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Songs */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D7FF3F]" />
              <span>Recently Ingested Songs</span>
            </h2>
            <Link
              href="/admin/songs"
              className="text-xs text-[#A1A1AA] hover:text-[#D7FF3F] flex items-center gap-1 transition-colors"
            >
              <span>Manage all</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentSongs && data.recentSongs.length > 0 ? (
              data.recentSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.artworkUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-[11px] text-[#71717A] truncate">
                        {song.artist?.name || "Independent"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-semibold ${
                        song.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {song.status}
                    </span>
                    <span className="text-[11px] font-mono text-[#A1A1AA]">
                      {song.playCount} plays
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#71717A] py-6 text-center">
                No songs ingested yet.
              </p>
            )}
          </div>
        </div>

        {/* Recently Registered Users */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D7FF3F]" />
              <span>Registered Users</span>
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-[#A1A1AA] hover:text-[#D7FF3F] flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentUsers && data.recentUsers.length > 0 ? (
              data.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-[#71717A] truncate font-mono">
                      {u.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md ${
                        u.role === "admin"
                          ? "bg-[#D7FF3F]/10 text-[#D7FF3F] border border-[#D7FF3F]/20 font-bold"
                          : "bg-white/5 text-[#A1A1AA]"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.status === "active" ? "bg-emerald-400" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#71717A] py-6 text-center">
                No users found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Streamed Tracks */}
      <div className="p-5 rounded-2xl bg-[#121212] border border-white/5">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-[#D7FF3F]" />
          <span>Most Streamed Catalog Tracks</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {data?.topSongs && data.topSongs.length > 0 ? (
            data.topSongs.map((song, idx) => (
              <div
                key={song._id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3"
              >
                <span className="text-sm font-mono font-bold text-[#71717A]">
                  #{idx + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={song.artworkUrl}
                  alt={song.title}
                  className="w-9 h-9 rounded-md object-cover border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {song.title}
                  </p>
                  <p className="text-[10px] font-mono text-[#A1A1AA]">
                    {song.playCount.toLocaleString()} plays
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#71717A]">No play data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
