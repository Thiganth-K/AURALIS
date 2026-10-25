"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePlayer } from "@/context/PlayerContext";
import { Heart, ListMusic, History, Plus, Play, Loader2, Music } from "lucide-react";
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
  const paramTab = searchParams.get("tab");
  const initialTab = paramTab === "playlists" || paramTab === "history" ? paramTab : "liked";

  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<"liked" | "playlists" | "history">(initialTab);

  useEffect(() => {
    if (paramTab === "playlists" || paramTab === "history" || paramTab === "liked") {
      setActiveTab(paramTab);
    }
  }, [paramTab]);

  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (!user) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#D7FF3F]">
          <Heart className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Your Personal Library</h1>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          Sign in to save your favorite songs, build custom playlists, and track your listening history.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-block px-5 py-2.5 rounded-full bg-[#D7FF3F] text-black font-semibold text-xs hover:bg-[#cbf531] transition-all shadow-lg shadow-[#D7FF3F]/15"
          >
            Sign in to AURALIS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#242424]">
        <div>
          <h1 className="text-xl sm:text-2xl font-pixel tracking-wide text-white">
            {user.name.toUpperCase()} // MUSIC ARCHIVE
          </h1>
          <p className="text-xs font-sans text-[#A1A1AA] mt-1">
            Access your liked tracks, personal playlist collections, and playback timeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "playlists" && (
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="retro-btn-primary px-3.5 py-1.5 text-xs font-pixel flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>[ + NEW TAPE ]</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-[#111111] p-1 border-2 border-[#262626] shadow-[2px_2px_0px_#000]">
            <button
              type="button"
              onClick={() => setActiveTab("liked")}
              className={`px-3 py-1 text-xs font-pixel transition-all flex items-center gap-1.5 ${
                activeTab === "liked"
                  ? "bg-[#D7FF3F] text-black font-bold shadow-[1px_1px_0px_#000]"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <Heart className={`w-3 h-3 ${activeTab === "liked" ? "fill-black" : ""}`} />
              <span>LIKED ({likedSongs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("playlists")}
              className={`px-3 py-1 text-xs font-pixel transition-all flex items-center gap-1.5 ${
                activeTab === "playlists"
                  ? "bg-[#D7FF3F] text-black font-bold shadow-[1px_1px_0px_#000]"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <ListMusic className="w-3 h-3" />
              <span>TAPES ({userPlaylists.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1 text-xs font-pixel transition-all flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-[#D7FF3F] text-black font-bold shadow-[1px_1px_0px_#000]"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <History className="w-3 h-3" />
              <span>HISTORY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
          <span className="text-xs font-pixel text-[#71717A]">LOADING ARCHIVE...</span>
        </div>
      ) : activeTab === "liked" ? (
        likedSongs.length === 0 ? (
          <div className="py-16 text-center space-y-3 border-2 border-[#262626] bg-[#111111] p-8 shadow-[3px_3px_0px_#000] max-w-md mx-auto">
            <Heart className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-sm font-pixel text-white">// NO LIKED TRACKS</p>
            <p className="text-xs font-sans text-[#71717A]">
              Click the heart icon on any song row or in the player to save songs to your personal archive.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-pixel text-[#71717A] uppercase">
                // {likedSongs.length} LIKED SIGNALS
              </span>
              <button
                type="button"
                onClick={() => likedSongs[0] && playSong(likedSongs[0], likedSongs)}
                className="retro-btn-primary px-3.5 py-1.5 text-xs font-pixel flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-black stroke-black" />
                <span>[ ▶ PLAY ALL ]</span>
              </button>
            </div>
            <div className="border-2 border-[#242424] bg-[#0e0e0e] shadow-[3px_3px_0px_#000] p-2 space-y-1">
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
        userPlaylists.length === 0 ? (
          <div className="py-16 text-center space-y-3 border-2 border-[#262626] bg-[#111111] p-8 shadow-[3px_3px_0px_#000] max-w-md mx-auto">
            <ListMusic className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-sm font-pixel text-white">// NO CASSETTE TAPES CREATED</p>
            <p className="text-xs font-sans text-[#71717A]">
              Organize your music archive into custom cassette selections.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="retro-btn-primary px-4 py-2 text-xs font-pixel inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>[ CREATE FIRST TAPE ]</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userPlaylists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        )
      ) : (
        historyItems.length === 0 ? (
          <div className="py-16 text-center space-y-3 border-2 border-[#262626] bg-[#111111] p-8 shadow-[3px_3px_0px_#000] max-w-md mx-auto">
            <History className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-sm font-pixel text-white">// NO PLAYBACK HISTORY RECORDED</p>
            <p className="text-xs font-sans text-[#71717A]">
              Play any published song to start logging your playback frequency history.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="text-xs font-pixel text-[#71717A] uppercase">
              // RECENT PLAYBACK TIMELINE
            </span>
            <div className="border-2 border-[#242424] bg-[#0e0e0e] shadow-[3px_3px_0px_#000] p-2 space-y-1">
              {historyItems.map((item, index) => (
                <SongRow
                  key={item.id}
                  song={item.song}
                  index={index}
                  playlistContext={historyItems.map((h) => h.song)}
                />
              ))}
            </div>
          </div>
        )
      )}

      {/* Create Playlist Modal with Retro Framing */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#111111] border-2 border-[#2e2e2e] p-6 shadow-[5px_5px_0px_#000]">
            <h2 className="text-sm font-pixel text-white mb-4">// CREATE CASSETTE TAPE</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                  TAPE TITLE
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Tape #01 - Late Night"
                  className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="retro-btn-ghost px-3 py-1.5 text-xs font-pixel"
                >
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  disabled={creatingPlaylist}
                  className="retro-btn-primary px-4 py-1.5 text-xs font-pixel disabled:opacity-50"
                >
                  {creatingPlaylist ? "[ RECORDING... ]" : "[ CREATE TAPE ]"}
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
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D7FF3F] animate-spin" />
        </div>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}
