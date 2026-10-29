"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Search, Filter, Play, Pause, Trash2, Loader2, AlertCircle,
  Edit3, X, Upload, Check, Disc3, Mic2, CheckCircle2, FileAudio, UploadCloud, Info, Film, Video,
} from "lucide-react";

interface AdminSongItem {
  id: string; title: string; slug: string; artistId?: string; albumId?: string;
  artist?: { _id?: string; id?: string; name: string; image?: string };
  album?: { _id?: string; id?: string; title: string; artworkUrl?: string };
  audioUrl: string; videoUrl?: string; artworkUrl: string; duration: number; genre: string;
  playCount: number; explicit: boolean; status: "draft" | "published" | "archived";
  releaseDate?: string; createdAt: string;
}
interface ArtistOption { id: string; name: string; }
interface AlbumOption { id: string; title: string; artistId: string; }

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

const WAVE_BARS = [4,7,11,16,22,28,34,40,45,49,52,54,55,54,52,49,45,40,34,28,22,16,11,7,4];

function VinylRecord() {
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(4px 4px 0px #111111)" }}>
      <circle cx="65" cy="65" r="64" fill="#1A1A1A" />
      <circle cx="65" cy="65" r="58" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="52" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="46" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="40" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="34" fill="none" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="28" fill="none" stroke="#333" strokeWidth="0.8" />
      <circle cx="65" cy="65" r="22" fill="#F05A28" />
      <circle cx="65" cy="65" r="18" fill="#E04C1E" />
      <circle cx="65" cy="65" r="4" fill="#1A1A1A" />
      <rect x="50" y="58" width="30" height="1.5" fill="#FAF7EE" opacity="0.7" rx="0.5" />
      <rect x="54" y="62" width="22" height="1.5" fill="#FAF7EE" opacity="0.5" rx="0.5" />
      <rect x="58" y="66" width="14" height="1.5" fill="#FAF7EE" opacity="0.3" rx="0.5" />
    </svg>
  );
}

function ToneArm() {
  return (
    <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="10" r="5" fill="#111111" />
      <circle cx="50" cy="10" r="3" fill="#F05A28" />
      <line x1="50" y1="10" x2="12" y2="90" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="6" y="88" width="14" height="6" rx="1" fill="#111111" />
      <line x1="13" y1="94" x2="13" y2="100" stroke="#F05A28" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<AdminSongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [previewSongId, setPreviewSongId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<AdminSongItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formArtistId, setFormArtistId] = useState("");
  const [formAlbumId, setFormAlbumId] = useState("");
  const [formGenre, setFormGenre] = useState("");
  const [formDuration, setFormDuration] = useState("180");
  const [formAudioUrl, setFormAudioUrl] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formArtworkUrl, setFormArtworkUrl] = useState("");
  const [formStatus, setFormStatus] = useState<"draft" | "published" | "archived">("published");
  const [formExplicit, setFormExplicit] = useState(false);
  const [formReleaseDate, setFormReleaseDate] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [albums, setAlbums] = useState<AlbumOption[]>([]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/songs");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.songs)) setSongs(data.songs);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchSongs();
    async function loadRelations() {
      try {
        const [aRes, albRes] = await Promise.all([fetch("/api/admin/artists"), fetch("/api/admin/albums")]);
        if (aRes.ok) {
          const d = await aRes.json();
          if (d.success) setArtists(d.artists.map((a: { id?: string; _id?: string; name: string }) => ({ id: a.id || a._id || "", name: a.name })));
        }
        if (albRes.ok) {
          const d = await albRes.json();
          if (d.success) setAlbums(d.albums.map((al: { id?: string; _id?: string; title: string; artistId?: string; artist?: { _id?: string; id?: string } }) => ({
            id: al.id || al._id || "", title: al.title, artistId: al.artistId || al.artist?._id || al.artist?.id || "",
          })));
        }
      } catch (err) { console.error(err); }
    }
    loadRelations();
    return () => { if (previewAudio) previewAudio.pause(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTogglePreview = (song: AdminSongItem) => {
    if (previewSongId === song.id) { previewAudio?.pause(); setPreviewSongId(null); return; }
    if (previewAudio) previewAudio.pause();
    const audio = new Audio(song.audioUrl);
    audio.play().catch((e) => console.warn(e));
    audio.onended = () => setPreviewSongId(null);
    setPreviewAudio(audio); setPreviewSongId(song.id);
  };

  const handleTogglePublish = (song: AdminSongItem) => {
    setActionError(null);
    const newStatus = song.status === "published" ? "draft" : "published";
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/songs/${song.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          setSongs((prev) => prev.map((s) => s.id === song.id ? { ...s, status: newStatus } : s));
          setSuccessNotification(`"${song.title.toUpperCase()}" ${newStatus === "published" ? "PUBLISHED" : "MOVED TO DRAFT"}.`);
          setTimeout(() => setSuccessNotification(null), 4000);
        } else { const err = await res.json(); setActionError(err.error || "Update failed"); }
      } catch { setActionError("Network error"); }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}"?`)) return;
    setActionError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/songs/${id}`, { method: "DELETE" });
        if (res.ok) {
          if (previewSongId === id && previewAudio) { previewAudio.pause(); setPreviewSongId(null); }
          setSongs((prev) => prev.filter((s) => s.id !== id));
          setSuccessNotification(`"${title.toUpperCase()}" DELETED.`);
          setTimeout(() => setSuccessNotification(null), 4000);
        } else { const err = await res.json(); setActionError(err.error || "Delete failed"); }
      } catch { setActionError("Network error"); }
    });
  };

  const handleOpenEditModal = (song: AdminSongItem) => {
    setEditingSong(song); setFormTitle(song.title);
    setFormArtistId(song.artist?._id || song.artist?.id || song.artistId || "");
    setFormAlbumId(song.album?._id || song.album?.id || song.albumId || "");
    setFormGenre(song.genre || ""); setFormDuration(song.duration?.toString() || "180");
    setFormAudioUrl(song.audioUrl || ""); setFormVideoUrl(song.videoUrl || ""); setFormArtworkUrl(song.artworkUrl || "");
    setFormStatus(song.status || "published"); setFormExplicit(Boolean(song.explicit));
    setFormReleaseDate(song.releaseDate ? song.releaseDate.split("T")[0] : "");
    setEditError(null); setEditModalOpen(true);
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingAudio(true); setEditError(null);
    const fd = new FormData(); fd.append("file", file); fd.append("type", "audio");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.success) setFormAudioUrl(data.url);
      else setEditError(data.error || "Upload failed");
    } catch { setEditError("Network error"); } finally { setUploadingAudio(false); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingVideo(true); setEditError(null);
    const fd = new FormData(); fd.append("file", file); fd.append("type", "video");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.success) setFormVideoUrl(data.url);
      else setEditError(data.error || "Upload failed");
    } catch { setEditError("Network error"); } finally { setUploadingVideo(false); }
  };

  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingArtwork(true); setEditError(null);
    const fd = new FormData(); fd.append("file", file); fd.append("type", "artwork");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.success) setFormArtworkUrl(data.url);
      else setEditError(data.error || "Upload failed");
    } catch { setEditError("Network error"); } finally { setUploadingArtwork(false); }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingSong) return;
    if (!formTitle.trim()) { setEditError("Title required"); return; }
    if (!formArtistId) { setEditError("Select an artist"); return; }
    if (!formAudioUrl.trim()) { setEditError("Audio URL required"); return; }
    if (!formArtworkUrl.trim()) { setEditError("Artwork URL required"); return; }
    setSavingEdit(true); setEditError(null);
    try {
      const res = await fetch(`/api/admin/songs/${editingSong.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(), artistId: formArtistId,
          albumId: formAlbumId || undefined, genre: formGenre.trim() || "Electronic",
          duration: Number(formDuration) || 180, audioUrl: formAudioUrl.trim(),
          videoUrl: formVideoUrl.trim() || undefined,
          artworkUrl: formArtworkUrl.trim(), status: formStatus,
          explicit: formExplicit, releaseDate: formReleaseDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setEditError(data.error || "Update failed"); setSavingEdit(false); return; }
      setEditModalOpen(false);
      setSuccessNotification(`"${formTitle.toUpperCase()}" UPDATED.`);
      setTimeout(() => setSuccessNotification(null), 4000);
      fetchSongs();
    } catch { setEditError("Network error"); } finally { setSavingEdit(false); }
  };

  const filtered = songs.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (s.title.toLowerCase().includes(q) ||
      (s.artist?.name && s.artist.name.toLowerCase().includes(q)) ||
      s.genre.toLowerCase().includes(q)) &&
      (statusFilter === "all" || s.status === statusFilter);
  });

  const fieldBase: React.CSSProperties = {
    backgroundColor: "#FAF7EE", border: "2px solid #111111",
    color: "#111111", caretColor: "#F05A28",
  };

  return (
    <div className="space-y-0 select-none font-mono" style={{ backgroundColor: "#FAF7EE" }}>
      <style>{`
        @keyframes auralisWaveDance {
          0%,100%{transform:scaleY(0.18);opacity:0.55}
          50%{transform:scaleY(1.08);opacity:1}
        }
        @keyframes vinylSpin {
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }
      `}</style>

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ backgroundColor: "#FAF7EE", border: "2px solid #111111", boxShadow: "3px 3px 0px #111111" }}>
        {["top-1.5 left-2","top-1.5 right-2","bottom-1.5 left-2","bottom-1.5 right-2"].map((pos,i) => (
          <span key={i} className={`absolute ${pos} text-sm font-bold font-mono select-none`} style={{ color: "#F05A28" }}>
            {["┌","┐","└","┘"][i]}
          </span>
        ))}
        <div className="flex items-center justify-between px-7 py-6">
          <div className="flex-1 max-w-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#F05A28" }}>
                AURALIS // TRACK CATALOG
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl uppercase leading-tight"
              style={{ fontWeight: 900, color: "#111111", letterSpacing: "-0.02em" }}>
              SONG CATALOG // INGESTION
            </h1>
            <p className="text-xs text-[#7A7166] mt-2.5 font-mono leading-relaxed">
              Manage your track catalog. Upload new songs, edit metadata,<br />and keep your content organized.
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center relative mx-8 shrink-0">
            <div style={{ animation: "vinylSpin 8s linear infinite", transformOrigin: "center" }}>
              <VinylRecord />
            </div>
            <div className="absolute -right-4 -top-2 pointer-events-none"><ToneArm /></div>
          </div>
          <div className="hidden sm:flex flex-col text-right text-[11px] font-black tracking-widest text-[#111111] uppercase leading-snug pl-6 shrink-0"
            style={{ borderLeft: "2px solid rgba(17,17,17,0.15)" }}>
            <span>BETTER MUSIC</span>
            <span>BETTER PEOPLE</span>
            <span style={{ color: "#F05A28" }}>AURALIS</span>
          </div>
        </div>
      </div>

      {/* ── NOTIFICATIONS ───────────────────────────────────────── */}
      {actionError && (
        <div className="mt-3 p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
          style={{ backgroundColor: "#FFF0ED", border: "2px solid #D62828", color: "#D62828", boxShadow: "2px 2px 0px #111111" }}>
          <AlertCircle className="w-4 h-4 shrink-0" /><span>{actionError}</span>
        </div>
      )}
      {successNotification && (
        <div className="mt-3 p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
          style={{ backgroundColor: "#ECFDF5", border: "2px solid #15803D", color: "#15803D", boxShadow: "2px 2px 0px #111111" }}>
          <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{successNotification}</span>
        </div>
      )}

      {/* ── SEARCH + FILTER BAR ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mt-4">
        <div className="flex-1 flex items-center gap-3 px-4 py-3"
          style={{ backgroundColor: "#FAF7EE", border: "2px solid #111111", boxShadow: "2.5px 2.5px 0px #111111" }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
          <input type="text" placeholder="Search by name, artist, genre..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#111111] placeholder-[#7A7166]/60 focus:outline-none font-mono text-xs"
            style={{ caretColor: "#F05A28" }} />
        </div>
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 px-3 py-3"
            style={{ backgroundColor: "#FAF7EE", border: "2px solid #111111", boxShadow: "2px 2px 0px #111111" }}>
            <Filter className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
            <span className="text-[10px] font-bold uppercase text-[#7A7166]">FILTER:</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-3"
            style={{ backgroundColor: "#FAF7EE", border: "2px solid #111111", boxShadow: "2px 2px 0px #111111" }}>
            <select className="bg-transparent font-bold text-[#111111] focus:outline-none cursor-pointer text-xs">
              <option>All Roles</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-3"
            style={{ backgroundColor: "#FAF7EE", border: "2px solid #111111", boxShadow: "2px 2px 0px #111111" }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-[#111111] focus:outline-none cursor-pointer text-xs">
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <Link href="/admin/songs/new"
            className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all"
            style={{ backgroundColor: "#F05A28", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0px #111111" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111111"; e.currentTarget.style.backgroundColor = "#e84e1d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0px #111111"; e.currentTarget.style.backgroundColor = "#F05A28"; }}>
            <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Song</span>
          </Link>
        </div>
      </div>

      {/* ── SONGS TABLE ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden mt-4"
        style={{ backgroundColor: "#FAF7EE", border: "2px solid #111111", boxShadow: "3px 3px 0px #111111" }}>
        {["top-1.5 left-2","top-1.5 right-2","bottom-1.5 left-2","bottom-1.5 right-2"].map((pos,i) => (
          <span key={i} className={`absolute ${pos} text-xs font-mono select-none`} style={{ color: "#F05A28" }}>
            {["┌","┐","└","┘"][i]}
          </span>
        ))}
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "2px solid #111111" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">INGESTED SIGNALS DIRECTORY</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7166]">
            {filtered.length} RECORD{filtered.length !== 1 ? "S" : ""} FOUND
          </span>
        </div>
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#F05A28" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A7166]">LOADING...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#7A7166] text-xs font-bold uppercase tracking-wider">
            NO SIGNALS MATCH THE CURRENT FILTERS.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#7A7166] uppercase font-bold text-[10px] tracking-wider"
                style={{ backgroundColor: "#F6EEDE", borderBottom: "1.5px solid #111111" }}>
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">TRACK</th>
                  <th className="py-3 px-4">ARTIST</th>
                  <th className="py-3 px-4">ALBUM</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">PLAYS</th>
                  <th className="py-3 px-4">TIME</th>
                  <th className="py-3 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/10">
                {filtered.map((song, idx) => {
                  const isPlaying = previewSongId === song.id;
                  let badgeBg = "#FFF0ED", badgeColor = "#F05A28", badgeBorder = "#F05A28", badgeLabel = "LIVE";
                  if (song.status === "draft") { badgeBg = "#FAF7EE"; badgeColor = "#7A7166"; badgeBorder = "#111111"; badgeLabel = "DRAFT"; }
                  else if (song.status === "archived") { badgeBg = "#FAF7EE"; badgeColor = "#7A7166"; badgeBorder = "#7A7166"; badgeLabel = "ARCHIVED"; }
                  return (
                    <tr key={song.id} className="hover:bg-[#F6EEDE] transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-[#7A7166]">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={song.artworkUrl} alt={song.title} className="w-9 h-9 object-cover shrink-0"
                            style={{ border: "1.5px solid #111111" }} />
                          <div className="min-w-0">
                            <div className="font-bold text-[#111111] uppercase truncate text-xs tracking-wide flex items-center gap-1.5">
                              {song.title}
                              {song.explicit && (
                                <span className="text-[8px] font-bold px-1"
                                  style={{ backgroundColor: "#FFF0ED", color: "#F05A28", border: "1px solid #F05A28" }}>EXP</span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">{song.genre}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#111111] uppercase tracking-wide text-xs">
                        {song.artist?.name || "Independent"}
                      </td>
                      <td className="py-4 px-4 text-[#7A7166] font-mono text-xs">
                        {song.album?.title || "Single"}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badgeColor }} />
                          {badgeLabel}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#7A7166] font-mono text-xs">{song.playCount ?? 0}</td>
                      <td className="py-4 px-4 text-[#7A7166] font-mono text-xs">{formatDuration(song.duration)}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Play/Pause */}
                          <button type="button" onClick={() => handleTogglePreview(song)}
                            title={isPlaying ? "Pause" : "Play"}
                            className="w-8 h-8 inline-flex items-center justify-center transition-all cursor-pointer"
                            style={{ backgroundColor: isPlaying ? "#F05A28" : "#111111", color: "#FFFFFF", border: "1.5px solid #111111", boxShadow: "1.5px 1.5px 0px #111111" }}>
                            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                          {/* Edit */}
                          <button type="button" onClick={() => handleOpenEditModal(song)} title="Edit"
                            className="w-8 h-8 inline-flex items-center justify-center transition-all cursor-pointer"
                            style={{ backgroundColor: "#F05A28", color: "#111111", border: "1.5px solid #111111", boxShadow: "1.5px 1.5px 0px #111111" }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "1.5px 1.5px 0px #111111"; }}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {/* Publish toggle */}
                          <button type="button" disabled={isPending} onClick={() => handleTogglePublish(song)}
                            title={song.status === "published" ? "Unpublish" : "Publish"}
                            className="w-8 h-8 inline-flex items-center justify-center transition-all cursor-pointer"
                            style={{ backgroundColor: "#FAF7EE", color: "#111111", border: "1.5px solid #111111", boxShadow: "1.5px 1.5px 0px #111111" }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "1.5px 1.5px 0px #111111"; }}>
                            <UploadCloud className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button type="button" disabled={isPending} onClick={() => handleDelete(song.id, song.title)} title="Delete"
                            className="w-8 h-8 inline-flex items-center justify-center transition-all cursor-pointer"
                            style={{ backgroundColor: "#FAF7EE", color: "#D62828", border: "1.5px solid #D62828", boxShadow: "1.5px 1.5px 0px #111111" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFF0ED"; e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FAF7EE"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "1.5px 1.5px 0px #111111"; }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── BOTTOM INFO PANEL ───────────────────────────────────── */}
      <div className="mt-4 flex items-stretch overflow-hidden"
        style={{ border: "2px solid #111111", boxShadow: "3px 3px 0px #111111" }}>
        <div className="flex-1 p-5" style={{ backgroundColor: "#FAF7EE", borderRight: "2px solid #111111" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#F05A28", border: "1.5px solid #111111" }}>
              <Info className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#111111]">IMPORTANT INSTRUCTIONS</span>
          </div>
          <ul className="space-y-1.5">
            {["Only upload audio files in supported formats (MP3, WAV, FLAC).",
              "Ensure proper metadata (title, artist, album) for better organization.",
              "You can edit or remove tracks at any time."].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-[#7A7166] font-mono">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#F05A28", marginTop: "4px" }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-6 px-8 py-5 shrink-0" style={{ backgroundColor: "#FFF5EE" }}>
          <div className="flex items-center gap-0.5 h-14">
            {WAVE_BARS.map((h, i) => (
              <span key={i} className="bg-[#F05A28] rounded-sm"
                style={{ display: "inline-block", width: "4px", height: `${h}px`,
                  transformOrigin: "center", animation: "auralisWaveDance 1.35s ease-in-out infinite",
                  animationDelay: `${(i * 0.055).toFixed(3)}s`, willChange: "transform" }} />
            ))}
          </div>
          <div className="text-[10px] font-black tracking-widest text-[#111111] uppercase leading-snug">
            <p>KEEP YOUR MUSIC LIBRARY</p>
            <p>ALWAYS IN SYNC</p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <div className="mt-4 px-5 py-2.5 flex items-center justify-between" style={{ borderTop: "2px solid #111111" }}>
        <span className="text-[10px] font-bold tracking-widest text-[#7A7166] uppercase">AURALIS // v1.0</span>
        <span className="text-[10px] font-bold tracking-widest text-[#7A7166] uppercase">24-BIT // 96kHz ///</span>
      </div>

      {/* ── EDIT MODAL ──────────────────────────────────────────── */}
      {editModalOpen && editingSong && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-6 sm:p-7 relative flex flex-col max-h-[92vh] overflow-hidden"
            style={{ backgroundColor: "#FAF7EE", border: "2px solid #111111", boxShadow: "5px 5px 0px #111111" }}>
            {["top-1.5 left-2","top-1.5 right-2","bottom-1.5 left-2","bottom-1.5 right-2"].map((pos,i) => (
              <span key={i} className={`absolute ${pos} text-xs font-mono select-none`} style={{ color: "#F05A28" }}>
                {["┌","┐","└","┘"][i]}
              </span>
            ))}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#111111]/20 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: "#F05A28" }} />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  MODIFY TRACK — {editingSong.title.toUpperCase()}
                </h2>
              </div>
              <button type="button" onClick={() => setEditModalOpen(false)}
                className="p-1 border border-[#111111] bg-[#FAF7EE] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            {editError && (
              <div className="mb-4 p-3 flex items-center gap-2 text-xs font-bold uppercase shrink-0"
                style={{ backgroundColor: "#FFF0ED", border: "1.5px solid #D62828", color: "#D62828", boxShadow: "2px 2px 0px #111111" }}>
                <AlertCircle className="w-4 h-4 shrink-0" /><span>{editError}</span>
              </div>
            )}
            <form onSubmit={handleSaveEdit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                    <span className="w-1.5 h-1.5 inline-block bg-[#F05A28]" />TRACK TITLE *
                  </label>
                  <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Sunflower" className="w-full px-3.5 py-2.5 text-xs font-mono focus:outline-none uppercase" style={fieldBase} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                    <Mic2 className="w-3.5 h-3.5 text-[#F05A28]" />VERIFIED ARTIST *
                  </label>
                  <select required value={formArtistId} onChange={(e) => setFormArtistId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase cursor-pointer focus:outline-none" style={fieldBase}>
                    <option value="">-- SELECT ARTIST --</option>
                    {artists.map((art) => <option key={art.id} value={art.id}>{art.name.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                    <Disc3 className="w-3.5 h-3.5 text-[#F05A28]" />ALBUM
                  </label>
                  <select value={formAlbumId} onChange={(e) => setFormAlbumId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase cursor-pointer focus:outline-none" style={fieldBase}>
                    <option value="">-- SINGLE --</option>
                    {albums.filter((alb) => !formArtistId || alb.artistId === formArtistId)
                      .map((alb) => <option key={alb.id} value={alb.id}>{alb.title.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                    <span className="w-1.5 h-1.5 inline-block bg-[#F05A28]" />GENRE
                  </label>
                  <input type="text" required value={formGenre} onChange={(e) => setFormGenre(e.target.value)}
                    placeholder="e.g. Pop" className="w-full px-3.5 py-2.5 text-xs font-mono focus:outline-none uppercase" style={fieldBase} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]">
                      <span className="w-1.5 h-1.5 inline-block bg-[#F05A28]" />DURATION (s)
                    </label>
                    <span className="text-[10px] font-bold text-[#F05A28] font-mono">
                      [{formatDuration(Number(formDuration) || 0)}]
                    </span>
                  </div>
                  <input type="number" min="1" required value={formDuration} onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono focus:outline-none" style={fieldBase} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                    <span className="w-1.5 h-1.5 inline-block bg-[#F05A28]" />RELEASE DATE
                  </label>
                  <input type="date" value={formReleaseDate} onChange={(e) => setFormReleaseDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono focus:outline-none" style={fieldBase} />
                </div>
              </div>
              <div className="p-3.5 space-y-2.5" style={{ backgroundColor: "#F6EEDE", border: "2px solid #111111" }}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-[#111111] flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-[#F05A28]" />AUDIO FILE
                  </label>
                  {formAudioUrl && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#FFF0ED] text-[#F05A28] border border-[#F05A28]">LINKED</span>}
                </div>
                {formAudioUrl && (
                  <div className="space-y-1.5">
                    <audio controls src={formAudioUrl} className="w-full h-8" />
                    <input type="text" value={formAudioUrl} onChange={(e) => setFormAudioUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[10px] font-mono bg-[#FAF7EE] border border-[#111111] focus:outline-none truncate" />
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase"
                  style={{ backgroundColor: "#FAF7EE", border: "1.5px solid #111111", boxShadow: "2px 2px 0px #111111" }}>
                  {uploadingAudio
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>UPLOADING...</span></>
                    : <><Upload className="w-3.5 h-3.5 text-[#F05A28]" /><span>RE-UPLOAD AUDIO</span></>}
                  <input type="file" accept="audio/*" onChange={handleAudioUpload} disabled={uploadingAudio} className="hidden" />
                </label>
              </div>
              <div className="p-3.5 space-y-2.5" style={{ backgroundColor: "#F6EEDE", border: "2px solid #111111" }}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-[#111111] flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#F05A28]" />MP4 MUSIC VIDEO (OPTIONAL)
                  </label>
                  {formVideoUrl && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#FFF0ED] text-[#F05A28] border border-[#F05A28]">MOUNTED</span>}
                </div>
                {formVideoUrl && (
                  <div className="space-y-1.5">
                    <video src={formVideoUrl} controls className="w-full h-28 object-contain bg-black" />
                    <input type="text" value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="Video URL (Cloudinary or local /uploads/...)"
                      className="w-full px-2.5 py-1.5 text-[10px] font-mono bg-[#FAF7EE] border border-[#111111] focus:outline-none truncate" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase"
                    style={{ backgroundColor: "#FAF7EE", border: "1.5px solid #111111", boxShadow: "2px 2px 0px #111111" }}>
                    {uploadingVideo
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>UPLOADING MP4...</span></>
                      : <><Upload className="w-3.5 h-3.5 text-[#F05A28]" /><span>{formVideoUrl ? "RE-UPLOAD VIDEO" : "UPLOAD MP4 VIDEO"}</span></>}
                    <input type="file" accept="video/mp4,video/webm,video/*" onChange={handleVideoUpload} disabled={uploadingVideo} className="hidden" />
                  </label>
                  {formVideoUrl && (
                    <button type="button" onClick={() => setFormVideoUrl("")} className="px-2 py-1 text-[10px] font-bold text-red-600 uppercase border border-red-300">
                      CLEAR VIDEO
                    </button>
                  )}
                </div>
              </div>
              <div className="p-3.5 space-y-2.5" style={{ backgroundColor: "#F6EEDE", border: "2px solid #111111" }}>
                <label className="text-xs font-bold uppercase text-[#111111] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#F05A28]" />COVER ARTWORK
                </label>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formArtworkUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&auto=format&fit=crop&q=80"}
                    alt="Preview" className="w-16 h-16 object-cover shrink-0" style={{ border: "2px solid #111111" }} />
                  <div className="flex-1 space-y-2">
                    <input type="text" value={formArtworkUrl} onChange={(e) => setFormArtworkUrl(e.target.value)}
                      placeholder="Artwork URL" className="w-full px-2.5 py-1.5 text-[10px] font-mono bg-[#FAF7EE] border border-[#111111] focus:outline-none truncate" />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase"
                      style={{ backgroundColor: "#FAF7EE", border: "1.5px solid #111111", boxShadow: "2px 2px 0px #111111" }}>
                      {uploadingArtwork
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>UPLOADING...</span></>
                        : <><Upload className="w-3.5 h-3.5 text-[#F05A28]" /><span>RE-UPLOAD</span></>}
                      <input type="file" accept="image/*" onChange={handleArtworkUpload} disabled={uploadingArtwork} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                    <span className="w-1.5 h-1.5 inline-block bg-[#F05A28]" />STATUS
                  </label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as "draft" | "published" | "archived")}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase cursor-pointer focus:outline-none" style={fieldBase}>
                    <option value="published">PUBLISHED</option>
                    <option value="draft">DRAFT</option>
                    <option value="archived">ARCHIVED</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                    <span className="w-1.5 h-1.5 inline-block bg-[#F05A28]" />CONTENT
                  </label>
                  <button type="button" onClick={() => setFormExplicit(!formExplicit)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase cursor-pointer"
                    style={{ backgroundColor: formExplicit ? "#FFF0ED" : "#FAF7EE", border: "2px solid #111111", color: formExplicit ? "#F05A28" : "#111111" }}>
                    <span>EXPLICIT (EXP)</span>
                    <div className="w-4 h-4 flex items-center justify-center"
                      style={{ backgroundColor: formExplicit ? "#F05A28" : "#FAF7EE", border: "1.5px solid #111111" }}>
                      {formExplicit && <Check className="w-3 h-3 text-[#111111] stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-3 border-t border-[#111111]/15">
                <button type="button" onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase cursor-pointer"
                  style={{ backgroundColor: "#FAF7EE", border: "1.5px solid #111111", color: "#7A7166" }}>
                  [ CANCEL ]
                </button>
                <button type="submit" disabled={savingEdit || uploadingAudio || uploadingArtwork}
                  className="px-5 py-2 text-xs font-bold uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: "#F05A28", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0px #111111" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e84e1d"; e.currentTarget.style.transform = "translate(-1px,-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F05A28"; e.currentTarget.style.transform = ""; }}>
                  {savingEdit
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>SAVING...</span></>
                    : <span>[ UPDATE TRACK ]</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
