"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Playlist } from "@/types";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { EditProfileModal } from "@/components/user/EditProfileModal";
import {
  User,
  Settings,
  Heart,
  ListMusic,
  Radio,
  ArrowLeft,
  Shield,
  Calendar,
  Sparkles,
  Play,
  Plus,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [likedCount, setLikedCount] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      Promise.all([
        fetch("/api/library/playlists").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/library/liked").then((r) => (r.ok ? r.json() : null)),
      ])
        .then(([pData, lData]) => {
          if (pData && pData.success) setUserPlaylists(pData.playlists || []);
          if (lData && lData.success) setLikedCount((lData.songs || []).length);
        })
        .catch((err) => console.error("Failed to load profile data:", err))
        .finally(() => setLoadingData(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-12 text-center space-y-4 font-mono select-none">
        <div className="flex items-end justify-center gap-1 h-8">
          <span className="w-1.5 h-3 bg-[#F05A28]" />
          <span className="w-1.5 h-8 bg-[#F05A28]" />
          <span className="w-1.5 h-5 bg-[#F05A28]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#111111]">
          INITIALIZING OPERATOR CONSOLE...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 md:p-8 space-y-6 font-mono select-none">
      {/* ── BREADCRUMB NAVIGATION ── */}
      <div className="flex items-center gap-4 text-xs">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-1 font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#111111]" />
          <span>BACK</span>
        </button>

        <div className="flex items-center gap-2 tracking-wide">
          <Link href="/home" className="text-[#7A7166] hover:text-[#111111] transition-colors">
            HOME
          </Link>
          <span className="text-[#A3998D]">//</span>
          <span className="text-[#7A7166]">OPERATOR</span>
          <span className="text-[#A3998D]">//</span>
          <span className="font-bold text-[#111111] uppercase">{user.name}</span>
        </div>
      </div>

      {/* ── OPERATOR HERO PROFILE CARD ── */}
      <div
        className="relative p-6 sm:p-8 space-y-6 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Brackets */}
        <span className="absolute top-1.5 left-2 text-base font-bold text-[#F05A28]">┌</span>
        <span className="absolute top-1.5 right-2 text-base font-bold text-[#F05A28]">┐</span>
        <span className="absolute bottom-1.5 left-2 text-base font-bold text-[#F05A28]">└</span>
        <span className="absolute bottom-1.5 right-2 text-base font-bold text-[#F05A28]">┘</span>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Operator Avatar with Double Brutalist Border */}
            <div className="relative group">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden shrink-0"
                style={{
                  border: "2.5px solid #111111",
                  boxShadow: "3px 3px 0px #111111",
                  backgroundColor: "#F6EEDE",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  }
                  alt={user.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Status Indicator */}
              <div
                className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase text-white"
                style={{
                  backgroundColor: "#F05A28",
                  border: "1.5px solid #111111",
                }}
              >
                ONLINE
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#F05A28] border-b border-[#F05A28]">
                  OPERATOR // ID #{user.id.slice(-6).toUpperCase()}
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.2 uppercase"
                  style={{
                    backgroundColor: isAdmin ? "#111111" : "#FAF7EE",
                    color: isAdmin ? "#FAF7EE" : "#F05A28",
                    border: "1px solid #111111",
                  }}
                >
                  {isAdmin ? "SYSTEM ADMIN" : "COMMUNITY MEMBER"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#111111] tracking-tight">
                {user.name}
              </h1>

              <p className="text-xs text-[#7A7166] font-mono">{user.email}</p>
            </div>
          </div>

          {/* Action: Open Edit Profile Modal */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
              style={{
                backgroundColor: "#F05A28",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "2.5px 2.5px 0px #111111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e84e1d";
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = "3.5px 3.5px 0px #111111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F05A28";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111";
              }}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>EDIT PROFILE</span>
            </button>
          </div>
        </div>

        {/* ── STATS CHIPS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4" style={{ borderTop: "1.5px solid rgba(17,17,17,0.15)" }}>
          <div
            className="p-3 space-y-1"
            style={{
              backgroundColor: "#F6EEDE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7A7166] uppercase">
              <ListMusic className="w-3.5 h-3.5 text-[#F05A28]" />
              <span>CASSETTES RECORDED</span>
            </div>
            <p className="text-lg font-black text-[#111111]">{userPlaylists.length}</p>
          </div>

          <div
            className="p-3 space-y-1"
            style={{
              backgroundColor: "#F6EEDE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7A7166] uppercase">
              <Heart className="w-3.5 h-3.5 text-[#F05A28]" />
              <span>LIKED SIGNALS</span>
            </div>
            <p className="text-lg font-black text-[#111111]">{likedCount}</p>
          </div>

          <div
            className="p-3 space-y-1 col-span-2 sm:col-span-1"
            style={{
              backgroundColor: "#F6EEDE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7A7166] uppercase">
              <Radio className="w-3.5 h-3.5 text-[#F05A28]" />
              <span>HI-FI FIDELITY</span>
            </div>
            <p className="text-lg font-black text-[#111111]">STUDIO 24-BIT</p>
          </div>
        </div>
      </div>

      {/* ── USER'S RECORDED TAPES SECTION ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2" style={{ borderBottom: "2px solid #111111" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#F05A28] inline-block" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
              YOUR RECORDED CASSETTES // {userPlaylists.length} TAPES
            </h2>
          </div>

          <Link
            href="/library?tab=playlists"
            className="text-xs font-bold uppercase text-[#F05A28] hover:underline flex items-center gap-1"
          >
            <span>AUDIO ARCHIVE</span>
            <span>▸</span>
          </Link>
        </div>

        {userPlaylists.length === 0 ? (
          <div
            className="p-8 text-center space-y-3"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px dashed #C8BFB0",
            }}
          >
            <p className="text-xs font-bold uppercase text-[#7A7166]">
              NO CASSETTES RECORDED YET.
            </p>
            <Link
              href="/library?tab=playlists"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase"
              style={{
                backgroundColor: "#F05A28",
                color: "#111111",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>CREATE FIRST TAPE</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}

