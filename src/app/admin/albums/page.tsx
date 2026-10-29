"use client";

import React, { useEffect, useState } from "react";
import {
  Disc3,
  Plus,
  Search,
  Trash2,
  Edit2,
  Loader2,
  Upload,
  AlertCircle,
  X,
  Music,
  Filter,
} from "lucide-react";

interface AdminAlbumItem {
  id: string;
  title: string;
  slug: string;
  artist?: { _id: string; name: string; image: string };
  artistId: string;
  artworkUrl: string;
  releaseDate: string;
  genres: string[];
  description?: string;
  status: "draft" | "published" | "archived";
  songCount: number;
  createdAt: string;
}

interface ArtistOption {
  id: string;
  name: string;
}

const WIDE_SOUNDWAVE_BARS = [
  8, 12, 17, 24, 30, 38, 46, 54, 60, 65, 70, 74, 76, 74, 70, 65, 60, 54, 46, 38, 30, 24, 17, 12, 8
];

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<AdminAlbumItem[]>([]);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AdminAlbumItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formArtistId, setFormArtistId] = useState("");
  const [formReleaseDate, setFormReleaseDate] = useState("");
  const [formGenres, setFormGenres] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formArtworkUrl, setFormArtworkUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [albumRes, artistRes] = await Promise.all([
        fetch("/api/admin/albums"),
        fetch("/api/admin/artists"),
      ]);

      if (albumRes.ok) {
        const data = await albumRes.json();
        if (data.success && Array.isArray(data.albums)) setAlbums(data.albums);
      }
      if (artistRes.ok) {
        const data = await artistRes.json();
        if (data.success && Array.isArray(data.artists)) setArtists(data.artists);
      }
    } catch (err) {
      console.error("Failed to load album data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingAlbum(null);
    setFormTitle("");
    setFormArtistId(artists[0]?.id || "");
    setFormReleaseDate(new Date().toISOString().split("T")[0]);
    setFormGenres("");
    setFormDescription("");
    setFormArtworkUrl("");
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (alb: AdminAlbumItem) => {
    setEditingAlbum(alb);
    setFormTitle(alb.title);
    setFormArtistId(alb.artist?._id || alb.artistId || "");
    setFormReleaseDate(alb.releaseDate ? alb.releaseDate.split("T")[0] : "");
    setFormGenres(alb.genres?.join(", ") || "");
    setFormDescription(alb.description || "");
    setFormArtworkUrl(alb.artworkUrl || "");
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "artwork");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to upload artwork");
      } else {
        setFormArtworkUrl(data.url);
      }
    } catch {
      setFormError("Network error during artwork upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError("Album title is required");
      return;
    }
    if (!formArtistId) {
      setFormError("Please select an artist");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        title: formTitle.trim(),
        artistId: formArtistId,
        releaseDate: formReleaseDate,
        genres: formGenres.split(",").map((g) => g.trim()).filter(Boolean),
        description: formDescription,
        artworkUrl: formArtworkUrl || undefined,
      };

      const url = editingAlbum
        ? `/api/admin/albums/${editingAlbum.id}`
        : "/api/admin/albums";
      const method = editingAlbum ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save album");
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      fetchData();
    } catch {
      setFormError("Network error while saving album");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete album "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/albums/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlbums((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete album:", err);
    }
  };

  const filtered = albums.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.artist?.name && a.artist.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesArtist =
      artistFilter === "all" ||
      (a.artist?._id && a.artist._id === artistFilter) ||
      a.artistId === artistFilter;
    return matchesSearch && matchesArtist;
  });

  return (
    <div className="space-y-6 select-none font-mono">
      {/* ── 1. HERO BANNER (MATCHES USER SPEC EXACTLY) ──────── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Ticks (in Orange #F05A28) */}
        <span
          className="absolute top-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute top-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute bottom-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute bottom-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          {/* Left Text Column */}
          <div className="max-w-xl">
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                style={{ color: "#F05A28" }}
              >
                AURALIS // RELEASE CATALOG
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111] uppercase leading-tight select-text"
              style={{ fontWeight: 900 }}
            >
              ALBUM RELEASES // DISCOGRAPHY
            </h1>

            {/* Sub-text (Two Lines) */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Manage long-play albums, EPs, and sleeve artwork tied directly to verified
              <br className="hidden sm:inline" />
              {" "}artist identities across the broadcast network.
            </p>
          </div>

          {/* Right Side: Soundwave Bars & Editorial Slogan */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-5 shrink-0">
            {/* Inline Keyframes to guarantee instant rendering */}
            <style>{`
              @keyframes auralisWaveDance {
                0%, 100% {
                  transform: scaleY(0.18);
                  opacity: 0.6;
                }
                50% {
                  transform: scaleY(1.08);
                  opacity: 1;
                }
              }
            `}</style>

            {/* Wide Soundwave bars with smooth up-and-down wave animation */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 h-20 px-2 select-none"
              title="Auralis Live Audio Equalizer Spectrum"
            >
              {WIDE_SOUNDWAVE_BARS.map((height, idx) => (
                <span
                  key={idx}
                  className="bg-[#F05A28]"
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: `${height}px`,
                    borderRadius: "1.5px",
                    transformOrigin: "center",
                    animation: "auralisWaveDance 1.35s ease-in-out infinite",
                    animationDelay: `${(idx * 0.055).toFixed(3)}s`,
                    willChange: "transform",
                  }}
                />
              ))}
            </div>

            {/* Tagline on the Right */}
            <div
              className="text-left text-[10px] font-bold tracking-widest text-[#111111] uppercase leading-tight font-mono pl-4 sm:pl-5 shrink-0"
              style={{ borderLeft: "1.5px solid rgba(17, 17, 17, 0.2)" }}
            >
              <p>BETTER MUSIC</p>
              <p className="my-0.5">BETTER PEOPLE</p>
              <p style={{ color: "#F05A28" }}>AURALIS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SEARCH & FILTERS BAR (EXACT SPEC) ─────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3.5 justify-between">
        {/* Search Input with offset box */}
        <div
          className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2.5 text-xs"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "2.5px 2.5px 0px #111111",
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
          <input
            type="text"
            placeholder="SEARCH ALBUMS BY TITLE OR ARTIST..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#111111] placeholder-[#7A7166] focus:outline-none font-mono text-xs uppercase tracking-wide"
            style={{ caretColor: "#F05A28" }}
          />
        </div>

        {/* Filter Section on Right */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
            <Filter className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
            <span className="tracking-wider">FILTER:</span>
          </div>

          {/* Artist Dropdown */}
          <select
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <option value="all">ALL ARTISTS</option>
            {artists.map((art) => (
              <option key={art.id} value={art.id}>
                {art.name.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Action: Create Album Modal Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            style={{
              backgroundColor: "#F05A28",
              color: "#FFFFFF",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>[ + CREATE ALBUM ]</span>
          </button>
        </div>
      </div>

      {/* ── 3. CATALOG ALBUM RELEASES TABLE CONTAINER ────────── */}
      <div
        className="relative overflow-visible"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Outer Corner Crop Ticks (in Orange #F05A28) */}
        <span
          className="absolute -top-1 -left-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute -top-1 -right-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute -bottom-1 -left-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute -bottom-1 -right-1 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        {/* Table Header Bar */}
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ borderBottom: "2px solid #111111" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              CATALOG ALBUM RELEASES
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7166]">
            [ {filtered.length} RECORDS FOUND ]
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#F05A28" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A7166]">
              LOADING RELEASES...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#7A7166] text-xs font-bold uppercase tracking-wider">
            NO ALBUMS MATCH THE QUERY. CLICK &quot;[ + CREATE ALBUM ]&quot; TO ADD ONE.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead
                className="text-[#7A7166] uppercase font-bold text-[10px] tracking-wider"
                style={{
                  backgroundColor: "#F6EEDE",
                  borderBottom: "1.5px solid #111111",
                }}
              >
                <tr>
                  <th className="py-3 px-5">ALBUM</th>
                  <th className="py-3 px-4">ARTIST</th>
                  <th className="py-3 px-4">TRACKS</th>
                  <th className="py-3 px-4">RELEASE DATE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-5 text-right">COMMANDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {filtered.map((alb) => {
                  const releaseDateFormatted = alb.releaseDate
                    ? new Date(alb.releaseDate).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "UNSPECIFIED";

                  return (
                    <tr key={alb.id} className="hover:bg-[#F6EEDE] transition-colors">
                      {/* Album Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          {alb.artworkUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={alb.artworkUrl}
                              alt={alb.title}
                              className="w-9 h-9 object-cover shrink-0"
                              style={{
                                border: "1.5px solid #111111",
                                boxShadow: "0 4px 12px rgba(240, 90, 40, 0.4)",
                              }}
                            />
                          ) : (
                            <div
                              className="w-9 h-9 flex items-center justify-center text-sm font-bold shrink-0 uppercase text-white"
                              style={{
                                backgroundColor: "#F05A28",
                                boxShadow: "0 4px 12px rgba(240, 90, 40, 0.45)",
                              }}
                            >
                              <Disc3 className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-[#111111] uppercase tracking-wide truncate text-xs">
                              {alb.title}
                            </div>
                            <div className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
                              /{alb.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Artist */}
                      <td className="py-3.5 px-4 font-bold text-[#111111] uppercase tracking-wide">
                        {alb.artist?.name || "UNASSIGNED"}
                      </td>

                      {/* Tracks */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-[#111111]">
                          <Music className="w-3.5 h-3.5 text-[#F05A28]" />
                          <span>{alb.songCount || 0} TRACKS</span>
                        </span>
                      </td>

                      {/* Release Date */}
                      <td className="py-3.5 px-4 text-[#111111] font-mono">
                        {releaseDateFormatted}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: "#ECFDF5",
                            color: "#15803D",
                            border: "1px solid #16A34A",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          <span>[ LIVE ]</span>
                        </span>
                      </td>

                      {/* Commands */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(alb)}
                            className="px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                            style={{
                              backgroundColor: "#FAF7EE",
                              border: "1.5px solid #111111",
                              boxShadow: "1.5px 1.5px 0px #111111",
                              color: "#111111",
                            }}
                          >
                            <Edit2 className="w-3 h-3 text-[#F05A28]" />
                            <span>EDIT</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(alb.id, alb.title)}
                            className="p-1.5 transition-all cursor-pointer"
                            style={{
                              backgroundColor: "#FAF7EE",
                              border: "1.5px solid #D62828",
                              boxShadow: "1.5px 1.5px 0px #111111",
                              color: "#D62828",
                            }}
                          >
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

      {/* ── MODAL: CREATE / EDIT ALBUM ────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
          <div
            className="w-full max-w-lg p-6 relative font-mono select-none"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "4px 4px 0px #111111",
            }}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#111111]">
              <div className="flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-[#F05A28]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#111111]">
                  {editingAlbum ? "EDIT ALBUM SLEEVE" : "INGEST NEW ALBUM RELEASE"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 border border-[#111111] hover:bg-[#F6EEDE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div
                className="p-3 mb-4 flex items-center gap-2 text-xs font-bold uppercase text-[#D62828]"
                style={{
                  backgroundColor: "#FFF0ED",
                  border: "1.5px solid #D62828",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
              {/* Title */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  ALBUM TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="E.G. RANDOM ACCESS MEMORIES"
                  className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none uppercase font-mono"
                  style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                />
              </div>

              {/* Artist Select */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  PRIMARY RECORDING ARTIST *
                </label>
                <select
                  required
                  value={formArtistId}
                  onChange={(e) => setFormArtistId(e.target.value)}
                  className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none uppercase font-mono cursor-pointer"
                  style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                >
                  <option value="">SELECT ARTIST ROSTER...</option>
                  {artists.map((art) => (
                    <option key={art.id} value={art.id}>
                      {art.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Date & Genres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[#7A7166] uppercase">
                    RELEASE DATE
                  </label>
                  <input
                    type="date"
                    value={formReleaseDate}
                    onChange={(e) => setFormReleaseDate(e.target.value)}
                    className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none font-mono"
                    style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[#7A7166] uppercase">
                    GENRES (COMMA-SEP)
                  </label>
                  <input
                    type="text"
                    value={formGenres}
                    onChange={(e) => setFormGenres(e.target.value)}
                    placeholder="ELECTRONIC, DISCO"
                    className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none uppercase font-mono"
                    style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  LINER NOTES / DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="EDITORIAL NOTES..."
                  className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none font-mono"
                  style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                />
              </div>

              {/* Artwork Upload */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  SLEEVE ARTWORK (FILE OR URL)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formArtworkUrl}
                    onChange={(e) => setFormArtworkUrl(e.target.value)}
                    placeholder="HTTPS://..."
                    className="flex-1 p-2 bg-transparent border-2 border-[#111111] focus:outline-none font-mono text-[11px]"
                  />
                  <label
                    className="px-3 py-2 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    style={{
                      backgroundColor: "#FAF7EE",
                      border: "2px solid #111111",
                      boxShadow: "2px 2px 0px #111111",
                    }}
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#F05A28]" />
                    )}
                    <span>{uploadingImage ? "..." : "FILE"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t-2 border-[#111111]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border-2 border-[#111111] bg-[#FAF7EE] text-[#111111] uppercase font-bold hover:bg-[#F6EEDE] cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 border-2 border-[#111111] bg-[#F05A28] text-white uppercase font-bold shadow-[2px_2px_0px_#111111] flex items-center gap-2 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingAlbum ? "UPDATE ALBUM" : "CREATE RELEASE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
