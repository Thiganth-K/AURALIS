"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePlayer } from "@/context/PlayerContext";
import {
  Heart,
  ListMusic,
  Clock,
  Plus,
  Play,
  Shuffle,
  Music,
  Radio,
  Sparkles,
  ArrowRight,
  Disc3,
  X,
} from "lucide-react";
import { Song, Playlist } from "@/types";
import { SongRow } from "@/components/music/SongRow";
import { PlaylistCard } from "@/components/music/PlaylistCard";

interface HistoryItem {
  id: string;
  playedAt: string;
  song: Song;
}

function LibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramTab = searchParams.get("tab");
  const initialTab =
    paramTab === "playlists" || paramTab === "history" ? paramTab : "liked";

  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<"liked" | "playlists" | "history">(
    initialTab
  );

  useEffect(() => {
    if (
      paramTab === "playlists" ||
      paramTab === "history" ||
      paramTab === "liked"
    ) {
      setActiveTab(paramTab);
    }
  }, [paramTab]);

  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Deduplicate history items: Keep only the first (most recent) occurrence of each unique song
  const uniqueHistoryItems = React.useMemo(() => {
    const seen = new Set<string>();
    const list: HistoryItem[] = [];
    for (const item of historyItems) {
      if (item.song && item.song.id && !seen.has(item.song.id)) {
        seen.add(item.song.id);
        list.push(item);
      }
    }
    return list;
  }, [historyItems]);

  const uniqueHistorySongs = React.useMemo(
    () => uniqueHistoryItems.map((h) => h.song),
    [uniqueHistoryItems]
  );

  // Create playlist modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  useEffect(() => {
    async function loadLibraryData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [likedRes, plRes, histRes] = await Promise.all([
          fetch("/api/library/liked"),
          fetch("/api/library/playlists"),
          fetch("/api/library/history"),
        ]);

        if (likedRes.ok) {
          const lData = await likedRes.json();
          if (lData.success) setLikedSongs(lData.songs || []);
        }
        if (plRes.ok) {
          const pData = await plRes.json();
          if (pData.success) setUserPlaylists(pData.playlists || []);
        }
        if (histRes.ok) {
          const hData = await histRes.json();
          if (hData.success) setHistoryItems(hData.history || []);
        }
      } catch (err) {
        console.error("Failed to load user library:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLibraryData();
  }, [user]);

  const handleTabChange = (tab: "liked" | "playlists" | "history") => {
    setActiveTab(tab);
    router.replace(`/library?tab=${tab}`, { scroll: false });
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setCreatingPlaylist(true);
    try {
      const res = await fetch("/api/library/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlaylistName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserPlaylists((prev) => [data.playlist, ...prev]);
        setNewPlaylistName("");
        setCreateModalOpen(false);
      }
    } catch (err) {
      console.error("Create playlist error:", err);
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const handlePlayAllLiked = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const handleShuffleLiked = () => {
    if (likedSongs.length > 0) {
      const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  const handlePlayAllHistory = () => {
    if (uniqueHistorySongs.length > 0) {
      playSong(uniqueHistorySongs[0], uniqueHistorySongs);
    }
  };

  if (!user) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6 select-none font-mono text-[#111111]">
        <div
          className="relative p-10 sm:p-14 text-center space-y-5 max-w-lg mx-auto"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "4px 4px 0px #111111",
          }}
        >
          {/* Corner Ticks */}
          <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
          <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
          <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
          <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

          <div
            className="w-14 h-14 mx-auto flex items-center justify-center"
            style={{
              backgroundColor: "#F6EEDE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <Heart className="w-7 h-7 text-[#F05A28]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111]">
              // AUDIO ARCHIVE ACCESS
            </h1>
            <p className="text-xs text-[#7A7166] leading-relaxed">
              Sign in to save your favorite transmissions, curate custom analog cassette tapes,
              and track your listening history.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
              style={{
                backgroundColor: "#F05A28",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
            >
              <span>SIGN IN TO AURALIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-7 space-y-7 select-none font-mono text-[#111111]">
      {/* ── 1. RETRO ARCHIVE HERO BANNER ── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Ticks */}
        <span className="absolute top-1.5 left-2 text-sm font-bold font-mono text-[#F05A28]">┌</span>
        <span className="absolute top-1.5 right-2 text-sm font-bold font-mono text-[#F05A28]">┐</span>
        <span className="absolute bottom-1.5 left-2 text-sm font-bold font-mono text-[#F05A28]">└</span>
        <span className="absolute bottom-1.5 right-2 text-sm font-bold font-mono text-[#F05A28]">┘</span>

        {/* Background Concentric Radar Arcs */}
        <div className="absolute top-0 right-0 bottom-0 w-80 lg:w-96 pointer-events-none overflow-hidden hidden md:block">
          <svg className="absolute top-0 right-0 w-full h-full opacity-20" viewBox="0 0 380 260" fill="none">
            <circle cx="380" cy="130" r="120" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="3 1" />
            <circle cx="380" cy="130" r="160" stroke="#DFD5C0" strokeWidth="1" />
            <circle cx="380" cy="130" r="200" stroke="#DFD5C0" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="380" cy="130" r="240" stroke="#DFD5C0" strokeWidth="1" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl space-y-3">
            {/* Tagline */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 inline-block shrink-0 bg-[#F05A28]" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#F05A28]">
                AURALIS // AUDIO ARCHIVE
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111] leading-tight">
              {user.name.toUpperCase()} // MUSIC VAULT
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] font-mono leading-relaxed max-w-lg">
              Personal station archive containing verified liked broadcasts, custom
              curated analog cassette tapes, and verified playback history.
            </p>

            {/* Tactical Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Tab 1: LIKED SONGS */}
              <button
                type="button"
                onClick={() => handleTabChange("liked")}
                className="h-9 px-4 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: activeTab === "liked" ? "#F05A28" : "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: activeTab === "liked" ? "1.5px 1.5px 0px #111111" : "2.5px 2.5px 0px #111111",
                  transform: activeTab === "liked" ? "translate(0.5px, 0.5px)" : "none",
                }}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTab === "liked" ? "fill-current" : ""}`} />
                <span>LIKED SONGS</span>
                <span
                  className="px-1.5 py-0.2 text-[9px] font-bold"
                  style={{
                    backgroundColor: activeTab === "liked" ? "#111111" : "#F6EEDE",
                    color: activeTab === "liked" ? "#FAF7EE" : "#F05A28",
                    border: "1px solid #111111",
                  }}
                >
                  {likedSongs.length}
                </span>
              </button>

              {/* Tab 2: CASSETTE TAPES */}
              <button
                type="button"
                onClick={() => handleTabChange("playlists")}
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: activeTab === "playlists" ? "#F05A28" : "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: activeTab === "playlists" ? "1.5px 1.5px 0px #111111" : "2.5px 2.5px 0px #111111",
                  transform: activeTab === "playlists" ? "translate(0.5px, 0.5px)" : "none",
                }}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>CASSETTES</span>
                <span
                  className="px-1.5 py-0.2 text-[9px] font-bold"
                  style={{
                    backgroundColor: activeTab === "playlists" ? "#111111" : "#F6EEDE",
                    color: activeTab === "playlists" ? "#FAF7EE" : "#F05A28",
                    border: "1px solid #111111",
                  }}
                >
                  {userPlaylists.length}
                </span>
              </button>

              {/* Tab 3: TIMELINE / HISTORY */}
              <button
                type="button"
                onClick={() => handleTabChange("history")}
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: activeTab === "history" ? "#F05A28" : "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: activeTab === "history" ? "1.5px 1.5px 0px #111111" : "2.5px 2.5px 0px #111111",
                  transform: activeTab === "history" ? "translate(0.5px, 0.5px)" : "none",
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>HISTORY</span>
                <span
                  className="px-1.5 py-0.2 text-[9px] font-bold"
                  style={{
                    backgroundColor: activeTab === "history" ? "#111111" : "#F6EEDE",
                    color: activeTab === "history" ? "#FAF7EE" : "#F05A28",
                    border: "1px solid #111111",
                  }}
                >
                  {uniqueHistoryItems.length}
                </span>
              </button>

              {/* Action Button: Create New Tape */}
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="h-9 px-3.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer font-mono ml-auto sm:ml-0"
                style={{
                  backgroundColor: "#F6EEDE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ede3cf";
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                  e.currentTarget.style.boxShadow = "3.5px 3.5px 0px #111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F6EEDE";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111";
                }}
              >
                <Plus className="w-4 h-4 text-[#F05A28]" />
                <span>[ + NEW TAPE ]</span>
              </button>
            </div>
          </div>

          {/* ── Right: 90's Pixel Graphic with Sound Waves (Clock for History, Cassette for Playlists, Heart for Liked) ── */}
          <div className="hidden xl:flex items-center gap-3.5 shrink-0 select-none pt-2 lg:pt-0">
            {/* Left Pixel Wave Bars (9 wider bars) */}
            <div className="flex items-end gap-1.5 h-28 py-2">
              {[28, 42, 58, 72, 88, 98, 86, 64, 40].map((h, i) => (
                <div
                  key={`l-${i}`}
                  style={{
                    width: 7,
                    height: `${h}%`,
                    backgroundColor: "#F05A28",
                    boxShadow: "0 0 7px rgba(240, 90, 40, 0.55)",
                    animation: `auralisWaveDance 1.1s ease-in-out infinite alternate ${i * 0.07}s`,
                  }}
                />
              ))}
            </div>

            {/* ── Center: 90's Pixel Graphic (Clock for History, Cassette for Playlists, Heart for Liked) ── */}
            {activeTab === "history" ? (
              <svg
                width="132"
                height="120"
                viewBox="0 0 96 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 drop-shadow-[3px_3px_0px_#111111]"
              >
                {/* ── Floating Pixel Stars / Sparkles ── */}
                <rect x="6" y="8" width="4" height="4" fill="#F05A28" opacity="0.9" />
                <rect x="2" y="12" width="12" height="2" fill="#F05A28" opacity="0.5" />
                <rect x="8" y="6" width="2" height="12" fill="#F05A28" opacity="0.5" />

                <rect x="82" y="6" width="3" height="3" fill="#F05A28" opacity="0.85" />
                <rect x="79" y="9" width="9" height="1" fill="#F05A28" opacity="0.5" />
                <rect x="83" y="5" width="1" height="9" fill="#F05A28" opacity="0.5" />

                <rect x="8" y="72" width="3" height="3" fill="#F05A28" opacity="0.6" />
                <rect x="6" y="75" width="7" height="1" fill="#F05A28" opacity="0.35" />

                <rect x="84" y="68" width="3" height="3" fill="#F05A28" opacity="0.6" />
                <rect x="82" y="71" width="7" height="1" fill="#F05A28" opacity="0.35" />

                {/* ── Twin Alarm Bells on Top (Pixel blocks) ── */}
                <rect x="18" y="12" width="16" height="7" rx="2" fill="#F05A28" stroke="#111111" strokeWidth="2.5" transform="rotate(-30 26 15)" />
                <rect x="62" y="12" width="16" height="7" rx="2" fill="#F05A28" stroke="#111111" strokeWidth="2.5" transform="rotate(30 70 15)" />
                {/* Center Top Hammer Button */}
                <rect x="44" y="9" width="8" height="6" fill="#111111" />

                {/* Bottom Twin Peg Feet */}
                <rect x="22" y="70" width="7" height="10" rx="1" fill="#111111" transform="rotate(22 25 75)" />
                <rect x="67" y="70" width="7" height="10" rx="1" fill="#111111" transform="rotate(-22 70 75)" />

                {/* Clock Circular Body */}
                <circle cx="48" cy="46" r="32" fill="#F6EEDE" stroke="#111111" strokeWidth="3.5" />
                <circle cx="48" cy="46" r="28" stroke="#F05A28" strokeWidth="2" strokeDasharray="3 2" />

                {/* Clock Face Hour Ticks */}
                <rect x="46" y="21" width="4" height="4" fill="#111111" />
                <rect x="71" y="44" width="4" height="4" fill="#111111" />
                <rect x="46" y="67" width="4" height="4" fill="#111111" />
                <rect x="21" y="44" width="4" height="4" fill="#111111" />

                {/* Specular Glass Highlight */}
                <rect x="28" y="26" width="10" height="4" fill="#FFFFFF" opacity="0.9" />
                <rect x="24" y="30" width="4" height="10" fill="#FFFFFF" opacity="0.9" />

                {/* Clock Hands */}
                {/* Hour hand (pointing to 10 o'clock) */}
                <line x1="48" y1="46" x2="34" y2="34" stroke="#111111" strokeWidth="3.5" strokeLinecap="square" />
                {/* Minute hand (pointing to 2 o'clock) */}
                <line x1="48" y1="46" x2="64" y2="30" stroke="#111111" strokeWidth="2.5" strokeLinecap="square" />
                {/* Second hand in Signal Orange */}
                <line x1="48" y1="46" x2="48" y2="64" stroke="#F05A28" strokeWidth="2" />

                {/* Center Hub */}
                <circle cx="48" cy="46" r="4.5" fill="#111111" />
                <circle cx="48" cy="2" r="2" fill="#F05A28" />
              </svg>
            ) : activeTab === "playlists" ? (
              <svg
                width="132"
                height="120"
                viewBox="0 0 96 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 drop-shadow-[3px_3px_0px_#111111]"
              >
                {/* ── Floating Pixel Stars / Sparkles ── */}
                <rect x="6" y="8" width="4" height="4" fill="#F05A28" opacity="0.9" />
                <rect x="2" y="12" width="12" height="2" fill="#F05A28" opacity="0.5" />
                <rect x="8" y="6" width="2" height="12" fill="#F05A28" opacity="0.5" />

                <rect x="82" y="6" width="3" height="3" fill="#F05A28" opacity="0.85" />
                <rect x="79" y="9" width="9" height="1" fill="#F05A28" opacity="0.5" />
                <rect x="83" y="5" width="1" height="9" fill="#F05A28" opacity="0.5" />

                <rect x="8" y="72" width="3" height="3" fill="#F05A28" opacity="0.6" />
                <rect x="6" y="75" width="7" height="1" fill="#F05A28" opacity="0.35" />

                <rect x="84" y="68" width="3" height="3" fill="#F05A28" opacity="0.6" />
                <rect x="82" y="71" width="7" height="1" fill="#F05A28" opacity="0.35" />

                {/* ── Cassette Tape Main Shell ── */}
                <rect x="10" y="17" width="76" height="52" rx="3" fill="#242321" stroke="#111111" strokeWidth="3" />
                {/* Top cassette edge bevel highlight */}
                <rect x="13" y="19" width="70" height="2" fill="#52504B" />

                {/* 4 Corner Screws */}
                <rect x="13" y="20" width="3" height="3" fill="#7A7166" />
                <rect x="80" y="20" width="3" height="3" fill="#7A7166" />
                <rect x="13" y="63" width="3" height="3" fill="#7A7166" />
                <rect x="80" y="63" width="3" height="3" fill="#7A7166" />

                {/* ── Cassette Label Area (Cream #FAF7EE) ── */}
                <rect x="15" y="23" width="66" height="31" fill="#FAF7EE" stroke="#111111" strokeWidth="2" />

                {/* Label Header Stripe in Signal Orange #F05A28 */}
                <rect x="15" y="23" width="66" height="7" fill="#F05A28" />
                {/* Side A Indicator */}
                <rect x="18" y="24.5" width="5" height="4" fill="#FAF7EE" />
                <rect x="19" y="25" width="3" height="3" fill="#111111" />
                <rect x="20" y="26" width="1" height="1" fill="#FAF7EE" />

                {/* Retro Sound Stripe on right of label banner */}
                <rect x="52" y="25.5" width="25" height="2" fill="#FAF7EE" opacity="0.9" />

                {/* Label text lines */}
                <rect x="18" y="32" width="18" height="1.5" fill="#111111" opacity="0.75" />
                <rect x="60" y="32" width="17" height="1.5" fill="#111111" opacity="0.75" />

                {/* ── Central Tape Window ── */}
                <rect x="26" y="35" width="44" height="16" fill="#141414" stroke="#111111" strokeWidth="2" />
                {/* Tape ribbon visible in window */}
                <rect x="36" y="42" width="24" height="3" fill="#783D1B" opacity="0.9" />

                {/* Left Spool Reel */}
                <circle cx="35" cy="43" r="5.5" fill="#FAF7EE" stroke="#111111" strokeWidth="1.5" />
                {/* Left Spool Gear Teeth */}
                <rect x="33.5" y="40.5" width="3" height="5" fill="#111111" />
                <rect x="32.5" y="41.5" width="5" height="3" fill="#111111" />
                <circle cx="35" cy="43" r="2" fill="#F05A28" />

                {/* Right Spool Reel */}
                <circle cx="61" cy="43" r="5.5" fill="#FAF7EE" stroke="#111111" strokeWidth="1.5" />
                {/* Right Spool Gear Teeth */}
                <rect x="59.5" y="40.5" width="3" height="5" fill="#111111" />
                <rect x="58.5" y="41.5" width="5" height="3" fill="#111111" />
                <circle cx="61" cy="43" r="2" fill="#F05A28" />

                {/* Tape measurement hash ticks */}
                <rect x="46" y="37" width="4" height="1.5" fill="#7A7166" />
                <rect x="47" y="40" width="2" height="1" fill="#7A7166" />
                <rect x="47" y="45" width="2" height="1" fill="#7A7166" />
                <rect x="46" y="48" width="4" height="1.5" fill="#7A7166" />

                {/* ── Bottom Magnetic Tape Bridge (Trapezoid) ── */}
                <polygon points="19,69 25,56 71,56 77,69" fill="#2C2B29" stroke="#111111" strokeWidth="2" />
                {/* Dual Guide Holes */}
                <circle cx="28" cy="63.5" r="2.5" fill="#111111" />
                <circle cx="68" cy="63.5" r="2.5" fill="#111111" />
                {/* Magnetic Playback Head Aperture */}
                <rect x="42" y="60" width="12" height="6" fill="#111111" />
                <rect x="44.5" y="61.5" width="7" height="3" fill="#F05A28" />
                {/* Pin Rollers */}
                <circle cx="35.5" cy="63" r="1.5" fill="#E8DCC8" />
                <circle cx="60.5" cy="63" r="1.5" fill="#E8DCC8" />

                {/* Left Shell Specular Highlight */}
                <rect x="11.5" y="21" width="2" height="44" fill="#FFFFFF" opacity="0.2" />
              </svg>
            ) : (
              <svg
                width="132"
                height="120"
                viewBox="0 0 96 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 drop-shadow-[3px_3px_0px_#111111]"
              >
                {/* ── Floating Pixel Stars / Sparkles ── */}
                <rect x="6" y="8" width="4" height="4" fill="#F05A28" opacity="0.9" />
                <rect x="2" y="12" width="12" height="2" fill="#F05A28" opacity="0.5" />
                <rect x="8" y="6" width="2" height="12" fill="#F05A28" opacity="0.5" />

                <rect x="82" y="6" width="3" height="3" fill="#F05A28" opacity="0.85" />
                <rect x="79" y="9" width="9" height="1" fill="#F05A28" opacity="0.5" />
                <rect x="83" y="5" width="1" height="9" fill="#F05A28" opacity="0.5" />

                <rect x="8" y="72" width="3" height="3" fill="#F05A28" opacity="0.6" />
                <rect x="6" y="75" width="7" height="1" fill="#F05A28" opacity="0.35" />

                <rect x="84" y="68" width="3" height="3" fill="#F05A28" opacity="0.6" />
                <rect x="82" y="71" width="7" height="1" fill="#F05A28" opacity="0.35" />

                {/* ── 90's Pixel Heart Block Geometry ── */}
                <rect x="22" y="12" width="16" height="5" fill="#111111" />
                <rect x="58" y="12" width="16" height="5" fill="#111111" />
                <rect x="16" y="17" width="6" height="6" fill="#111111" />
                <rect x="38" y="17" width="6" height="6" fill="#111111" />
                <rect x="52" y="17" width="6" height="6" fill="#111111" />
                <rect x="74" y="17" width="6" height="6" fill="#111111" />
                <rect x="11" y="23" width="5" height="14" fill="#111111" />
                <rect x="44" y="23" width="8" height="6" fill="#111111" />
                <rect x="80" y="23" width="5" height="14" fill="#111111" />
                <rect x="11" y="37" width="5" height="12" fill="#111111" />
                <rect x="80" y="37" width="5" height="12" fill="#111111" />
                <rect x="16" y="49" width="6" height="6" fill="#111111" />
                <rect x="74" y="49" width="6" height="6" fill="#111111" />
                <rect x="22" y="55" width="6" height="6" fill="#111111" />
                <rect x="68" y="55" width="6" height="6" fill="#111111" />
                <rect x="28" y="61" width="6" height="6" fill="#111111" />
                <rect x="62" y="61" width="6" height="6" fill="#111111" />
                <rect x="34" y="67" width="6" height="6" fill="#111111" />
                <rect x="56" y="67" width="6" height="6" fill="#111111" />
                <rect x="40" y="73" width="16" height="5" fill="#111111" />

                {/* Heart Fill */}
                <polygon
                  points="22,17 38,17 48,29 58,17 74,17 80,23 80,49 74,55 68,61 62,67 56,73 40,73 34,67 28,61 22,55 16,49 16,23"
                  fill="#F05A28"
                />
                <polygon
                  points="48,29 58,17 74,17 80,23 80,49 74,55 68,61 62,67 56,73 48,73 52,55 58,45 52,35"
                  fill="#C52F1A"
                  opacity="0.8"
                />

                {/* Specular Reflection */}
                <rect x="22" y="18" width="12" height="4" fill="#FFFFFF" opacity="0.95" />
                <rect x="18" y="22" width="4" height="12" fill="#FFFFFF" opacity="0.95" />
                <rect x="22" y="22" width="4" height="4" fill="#FFFFFF" opacity="0.9" />
                <rect x="26" y="26" width="3" height="3" fill="#FFFFFF" opacity="0.75" />
                <rect x="62" y="18" width="6" height="3" fill="#FFFFFF" opacity="0.7" />

                {/* Equalizer inside Heart */}
                <rect x="36" y="44" width="3" height="5" fill="#FFFFFF" opacity="0.6" />
                <rect x="41" y="41" width="3" height="8" fill="#FFFFFF" opacity="0.85" />
                <rect x="46" y="38" width="3" height="11" fill="#FFFFFF" opacity="0.9" />
                <rect x="51" y="42" width="3" height="7" fill="#FFFFFF" opacity="0.8" />
                <rect x="56" y="45" width="3" height="4" fill="#FFFFFF" opacity="0.6" />
              </svg>
            )}

            {/* Right Pixel Wave Bars (9 wider bars) */}
            <div className="flex items-end gap-1.5 h-28 py-2">
              {[40, 64, 86, 98, 88, 72, 58, 42, 28].map((h, i) => (
                <div
                  key={`r-${i}`}
                  style={{
                    width: 7,
                    height: `${h}%`,
                    backgroundColor: "#F05A28",
                    boxShadow: "0 0 7px rgba(240, 90, 40, 0.55)",
                    animation: `auralisWaveDance 1.1s ease-in-out infinite alternate ${
                      0.63 + i * 0.07
                    }s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. ACTIVE TAB CONTENT ── */}
      {loading ? (
        /* Loading Indicator */
        <div
          className="relative p-12 text-center space-y-4"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
          }}
        >
          <div className="flex items-end justify-center gap-1 h-8">
            <span className="w-1.5 h-3 bg-[#F05A28]" />
            <span className="w-1.5 h-8 bg-[#F05A28]" />
            <span className="w-1.5 h-5 bg-[#F05A28]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#111111]">
            LOADING PERSONAL AUDIO ARCHIVE...
          </p>
        </div>
      ) : activeTab === "liked" ? (
        /* ── LIKED SONGS TAB ── */
        likedSongs.length === 0 ? (
          /* Empty Liked Songs State */
          <div
            className="relative p-10 sm:p-14 text-center space-y-4"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
          >
            <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
            <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
            <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
            <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

            <div
              className="w-14 h-14 mx-auto flex items-center justify-center"
              style={{
                backgroundColor: "#F6EEDE",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
              }}
            >
              <Heart className="w-7 h-7 text-[#F05A28]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111]">
                // NO LIKED SIGNALS SAVED YET
              </h2>
              <p className="text-xs text-[#7A7166] leading-relaxed">
                Click the heart icon on any broadcast track in the Discover catalog or the persistent player
                to save it directly into your personal music vault.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/discover"
                className="px-5 py-2.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
              >
                <span>EXPLORE DISCOVER CATALOG</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Liked Songs Directory */
          <div className="space-y-4">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b-2 border-[#111111]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 inline-block shrink-0 bg-[#F05A28]" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                  LIKED BROADCASTS // {likedSongs.length} SIGNALS
                </h2>
              </div>

              {/* Action Buttons: Play All & Shuffle */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePlayAllLiked}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
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
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY ALL SIGNALS</span>
                </button>

                <button
                  type="button"
                  onClick={handleShuffleLiked}
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                  style={{
                    backgroundColor: "#FAF7EE",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "2.5px 2.5px 0px #111111",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F6EEDE";
                    e.currentTarget.style.transform = "translate(-1px,-1px)";
                    e.currentTarget.style.boxShadow = "3.5px 3.5px 0px #111111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FAF7EE";
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111";
                  }}
                >
                  <Shuffle className="w-3.5 h-3.5 text-[#F05A28]" />
                  <span>SHUFFLE</span>
                </button>
              </div>
            </div>

            {/* Song rows table container */}
            <div
              className="p-2 space-y-2"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
            >
              {likedSongs.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={index}
                  playlistContext={likedSongs}
                />
              ))}
            </div>
          </div>
        )
      ) : activeTab === "playlists" ? (
        /* ── CASSETTE TAPES / PLAYLISTS TAB ── */
        userPlaylists.length === 0 ? (
          <div
            className="relative p-10 sm:p-14 text-center space-y-4"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
          >
            <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
            <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
            <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
            <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

            <div
              className="w-14 h-14 mx-auto flex items-center justify-center"
              style={{
                backgroundColor: "#F6EEDE",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
              }}
            >
              <ListMusic className="w-7 h-7 text-[#F05A28]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111]">
                // NO CASSETTE TAPES CREATED
              </h2>
              <p className="text-xs text-[#7A7166] leading-relaxed">
                Build your own mixtape selections pressed straight to retro cassette tapes.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
              >
                <Plus className="w-4 h-4" />
                <span>CREATE FIRST CASSETTE</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 inline-block shrink-0 bg-[#F05A28]" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                  RECORDED CASSETTE TAPES // {userPlaylists.length} TAPES
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
        )
      ) : (
        /* ── PLAYBACK TIMELINE / RECENTLY PLAYED TAB (DEDUPLICATED) ── */
        uniqueHistoryItems.length === 0 ? (
          <div
            className="relative p-10 sm:p-14 text-center space-y-4"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
          >
            <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
            <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
            <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
            <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

            <div
              className="w-14 h-14 mx-auto flex items-center justify-center"
              style={{
                backgroundColor: "#F6EEDE",
                border: "2px solid #111111",
                boxShadow: "2px 2px 0px #111111",
              }}
            >
              <Clock className="w-7 h-7 text-[#F05A28]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111]">
                // NO RECENTLY PLAYED SIGNALS
              </h2>
              <p className="text-xs text-[#7A7166] leading-relaxed">
                Stream any song on Auralis to start compiling your verified acoustic playback timeline.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/discover"
                className="px-5 py-2.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2.5px 2.5px 0px #111111",
                }}
              >
                <span>START LISTENING</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b-2 border-[#111111]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 inline-block shrink-0 bg-[#F05A28]" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                  RECENTLY PLAYED // {uniqueHistoryItems.length} SIGNALS
                </h2>
              </div>

              {/* Action Button: Play All Recently Played */}
              <button
                type="button"
                onClick={handlePlayAllHistory}
                className="px-4 py-2 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono"
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
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY RECENT SIGNALS</span>
              </button>
            </div>

            <div
              className="p-2 space-y-2"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
            >
              {uniqueHistoryItems.map((item, index) => (
                <SongRow
                  key={item.id}
                  song={item.song}
                  index={index}
                  playlistContext={uniqueHistorySongs}
                />
              ))}
            </div>
          </div>
        )
      )}

      {/* ── CREATE CASSETTE MODAL (RETRO WORKSTATION DIALOG) ── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md p-6 relative font-mono select-none"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "6px 6px 0px #111111",
            }}
          >
            {/* Corner Ticks */}
            <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
            <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
            <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
            <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#111111]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#F05A28]" />
                <h3 className="text-sm font-black uppercase text-[#111111]">
                  CREATE CASSETTE TAPE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 hover:text-[#F05A28] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7A7166] uppercase mb-1.5">
                  CASSETTE LABEL TITLE
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Tape #01 - Late Night Golden"
                  className="w-full px-3 py-2.5 text-xs text-[#111111] uppercase font-mono tracking-wider focus:outline-none"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "2px solid #111111",
                    boxShadow: "2px 2px 0px #111111",
                    caretColor: "#F05A28",
                  }}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-mono"
                  style={{
                    backgroundColor: "#FAF7EE",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "2px 2px 0px #111111",
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={creatingPlaylist}
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono disabled:opacity-50"
                  style={{
                    backgroundColor: "#F05A28",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "2.5px 2.5px 0px #111111",
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creatingPlaylist ? "RECORDING..." : "CREATE TAPE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[1440px] mx-auto p-12 text-center space-y-4 font-mono select-none">
          <div className="flex items-end justify-center gap-1 h-8">
            <span className="w-1.5 h-3 bg-[#F05A28]" />
            <span className="w-1.5 h-8 bg-[#F05A28]" />
            <span className="w-1.5 h-5 bg-[#F05A28]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#111111]">
            LOADING AUDIO ARCHIVE...
          </p>
        </div>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}
