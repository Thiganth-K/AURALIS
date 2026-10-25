"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  Music,
  Disc3,
  Mic2,
  ListMusic,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface SongOpt {
  id: string;
  title: string;
  artist?: { name: string };
}
interface AlbumOpt {
  id: string;
  title: string;
  artist?: { name: string };
}
interface ArtistOpt {
  id: string;
  name: string;
}
interface PlaylistOpt {
  id: string;
  name: string;
}

export default function AdminFeaturedPage() {
  const [songs, setSongs] = useState<SongOpt[]>([]);
  const [albums, setAlbums] = useState<AlbumOpt[]>([]);
  const [artists, setArtists] = useState<ArtistOpt[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistOpt[]>([]);

  // Selected values
  const [featuredSongId, setFeaturedSongId] = useState("");
  const [featuredAlbumId, setFeaturedAlbumId] = useState("");
  const [featuredArtistId, setFeaturedArtistId] = useState("");
  const [featuredPlaylistId, setFeaturedPlaylistId] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [featRes, sRes, albRes, artRes, plRes] = await Promise.all([
          fetch("/api/admin/featured"),
          fetch("/api/admin/songs?status=published"),
          fetch("/api/admin/albums"),
          fetch("/api/admin/artists"),
          fetch("/api/admin/playlists"),
        ]);

        if (featRes.ok) {
          const fData = await featRes.json();
          if (fData.featured) {
            setFeaturedSongId(fData.featured.featuredSongId?._id || fData.featured.featuredSongId || "");
            setFeaturedAlbumId(fData.featured.featuredAlbumId?._id || fData.featured.featuredAlbumId || "");
            setFeaturedArtistId(fData.featured.featuredArtistId?._id || fData.featured.featuredArtistId || "");
            setFeaturedPlaylistId(fData.featured.featuredPlaylistId?._id || fData.featured.featuredPlaylistId || "");
            setHeadline(fData.featured.headline || "");
            setSubheadline(fData.featured.subheadline || "");
          }
        }
        if (sRes.ok) {
          const s = await sRes.json();
          if (s.success) setSongs(s.songs);
        }
        if (albRes.ok) {
          const a = await albRes.json();
          if (a.success) setAlbums(a.albums);
        }
        if (artRes.ok) {
          const ar = await artRes.json();
          if (ar.success) setArtists(ar.artists);
        }
        if (plRes.ok) {
          const p = await plRes.json();
          if (p.success) setPlaylists(p.playlists);
        }
      } catch (err) {
        console.error("Failed to load featured configuration:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featuredSongId,
          featuredAlbumId,
          featuredArtistId,
          featuredPlaylistId,
          headline,
          subheadline,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Featured home page configuration saved and live!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update featured content" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Star className="w-6 h-6 text-[#D7FF3F]" />
          <span>Featured Editorial Showcase</span>
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Control the primary editorial spotlight, hero headline, and curated releases presented on the public home page.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#121212] border border-white/5 space-y-5 shadow-2xl">
          {/* Headlines */}
          <div className="space-y-4 pb-4 border-b border-white/5">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Spotlight Banner Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Editorial Radio • FLAC 24-bit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Spotlight Subheadline
              </label>
              <input
                type="text"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Curated high-fidelity acoustic streams from verified AURALIS artists."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>
          </div>

          {/* Featured Song Selection */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>Hero Featured Song</span>
            </label>
            <select
              value={featuredSongId}
              onChange={(e) => setFeaturedSongId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            >
              <option value="">None / Automatic Trending Track</option>
              {songs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} — {s.artist?.name || "Artist"}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Album Selection */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5 flex items-center gap-1.5">
              <Disc3 className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>Featured Album Spotlight</span>
            </label>
            <select
              value={featuredAlbumId}
              onChange={(e) => setFeaturedAlbumId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            >
              <option value="">None / Automatic New Release</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} — {a.artist?.name || "Artist"}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Artist Selection */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5 flex items-center gap-1.5">
              <Mic2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>Featured Artist Spotlight</span>
            </label>
            <select
              value={featuredArtistId}
              onChange={(e) => setFeaturedArtistId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            >
              <option value="">None / Automatic Top Artist</option>
              {artists.map((ar) => (
                <option key={ar.id} value={ar.id}>
                  {ar.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Playlist Selection */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5 flex items-center gap-1.5">
              <ListMusic className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span>Featured Editorial Playlist</span>
            </label>
            <select
              value={featuredPlaylistId}
              onChange={(e) => setFeaturedPlaylistId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            >
              <option value="">None / Automatic Top Playlist</option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
