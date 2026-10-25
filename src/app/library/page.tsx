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
    <div className="px-6 md:px-10 py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Library</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Access your liked tracks, personal playlist collections, and playback timeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "playlists" && (
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#D7FF3F]/10"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              <span>New Playlist</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-[#141414] p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("liked")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeTab === "liked"
                  ? "bg-white text-black font-semibold shadow"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === "liked" ? "fill-black" : ""}`} />
              <span>Liked ({likedSongs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("playlists")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeTab === "playlists"
                  ? "bg-white text-black font-semibold shadow"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Playlists ({userPlaylists.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-white text-black font-semibold shadow"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D7FF3F] animate-spin" />
        </div>
      ) : activeTab === "liked" ? (
        likedSongs.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Heart className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-sm font-semibold text-white">No liked songs yet</p>
            <p className="text-xs text-[#71717A]">
              Click the heart icon on any song row or in the player to save songs here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#71717A] uppercase">
                {likedSongs.length} acoustic favorites
              </span>
              <button
                type="button"
                onClick={() => likedSongs[0] && playSong(likedSongs[0], likedSongs)}
                className="px-4 py-2 rounded-full bg-[#D7FF3F] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#cbf531] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play All</span>
              </button>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#121212] overflow-hidden divide-y divide-white/5">
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
          <div className="py-20 text-center space-y-3">
            <ListMusic className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-sm font-semibold text-white">No playlists created yet</p>
            <p className="text-xs text-[#71717A]">
              Organize your music into custom listening selections.
            </p>
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#D7FF3F] text-black font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Playlist</span>
            </button>
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
          <div className="py-20 text-center space-y-2">
            <History className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-sm font-semibold text-white">No listening history recorded yet</p>
            <p className="text-xs text-[#71717A]">
              Play any published song to start logging your playback history.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="text-xs font-mono text-[#71717A] uppercase">
              Recent playback timeline
            </span>
            <div className="rounded-xl border border-white/5 bg-[#121212] overflow-hidden divide-y divide-white/5">
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

      {/* Create Playlist Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4">Create Playlist</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Playlist Name
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Playlist #1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 text-xs text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPlaylist}
                  className="px-4 py-2 rounded-xl bg-[#D7FF3F] text-black font-semibold text-xs disabled:opacity-50"
                >
                  {creatingPlaylist ? "Creating..." : "Create"}
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
