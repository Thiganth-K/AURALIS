"use client";

import React, { useEffect, useState } from "react";
import {
  Mic2,
  Plus,
  Search,
  Trash2,
  Edit2,
  Loader2,
  Upload,
  AlertCircle,
  X,
  Disc3,
  Music,
  Filter,
} from "lucide-react";

interface AdminArtistItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  bio: string;
  genres: string[];
  followerCount: number;
  status: "active" | "archived";
  albumCount: number;
  songCount: number;
  createdAt: string;
}

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<AdminArtistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<AdminArtistItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formGenres, setFormGenres] = useState("");
  const [formImage, setFormImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/artists");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.artists)) {
          setArtists(data.artists);
        }
      }
    } catch (err) {
      console.error("Failed to load artists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const openCreateModal = () => {
    setEditingArtist(null);
    setFormName("");
    setFormBio("");
    setFormGenres("");
    setFormImage("");
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (art: AdminArtistItem) => {
    setEditingArtist(art);
    setFormName(art.name);
    setFormBio(art.bio || "");
    setFormGenres(art.genres?.join(", ") || "");
    setFormImage(art.image || "");
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
        setFormError(data.error || "Failed to upload image");
      } else {
        setFormImage(data.url);
      }
    } catch {
      setFormError("Network error during image upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Artist name is required");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formName.trim(),
        bio: formBio,
        genres: formGenres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        image: formImage || undefined,
      };

      const url = editingArtist
        ? `/api/admin/artists/${editingArtist.id}`
        : "/api/admin/artists";
      const method = editingArtist ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save artist");
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      fetchArtists();
    } catch {
      setFormError("Network error while saving artist");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete artist "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArtists((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete artist:", err);
    }
  };

  // Distinct genres across all artists
  const allGenres = Array.from(
    new Set(artists.flatMap((a) => a.genres || []).filter(Boolean))
  );

  const filtered = artists.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre =
      genreFilter === "all" ||
      a.genres.some((g) => g.toLowerCase() === genreFilter.toLowerCase());
    return matchesSearch && matchesGenre;
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
                AURALIS // ARTIST ROSTER
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              ARTIST CATALOG // DIRECTORY
            </h1>

            {/* Sub-text (Two Lines) */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Maintain verified artist profiles, genre taxonomy, and discography links
              <br className="hidden sm:inline" />
              {" "}across the authoritative audio stream.
            </p>
          </div>

          {/* Right Side: Soundwave Bars & Editorial Slogan */}
          <div className="hidden sm:flex items-center gap-5 shrink-0">
            {/* Center Soundwave Graphic in Vivid Orange */}
            <div className="flex items-center gap-[3px] h-12 px-2">
              <span className="w-[3px] bg-[#F05A28] h-3 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-5 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-8 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-11 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-12 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-9 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-7 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-4 rounded-xs" />
              <span className="w-[3px] bg-[#F05A28] h-2 rounded-xs" />
            </div>

            {/* Tagline on the Right */}
            <div
              className="text-left text-[10px] font-bold tracking-widest text-[#111111] uppercase leading-tight font-mono pl-5"
              style={{ borderLeft: "1px solid rgba(17, 17, 17, 0.15)" }}
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
            placeholder="SEARCH ARTISTS BY NAME OR GENRE..."
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

          {/* Genre Dropdown */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <option value="all">ALL GENRES</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Action: Register Artist Modal Button */}
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
            <span>[ + REGISTER ARTIST ]</span>
          </button>
        </div>
      </div>

      {/* ── 3. VERIFIED ARTIST IDENTITIES TABLE CONTAINER ───── */}
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
              VERIFIED ARTIST IDENTITIES
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
              LOADING ARTIST ROSTER...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#7A7166] text-xs font-bold uppercase tracking-wider">
            NO ARTISTS MATCH THE QUERY. CLICK &quot;[ + REGISTER ARTIST ]&quot; TO CREATE ONE.
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
                  <th className="py-3 px-5">ARTIST</th>
                  <th className="py-3 px-4">GENRES</th>
                  <th className="py-3 px-4">DISCOGRAPHY</th>
                  <th className="py-3 px-4">FOLLOWERS</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-5 text-right">COMMANDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-[#F6EEDE] transition-colors">
                    {/* Artist Column */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        {art.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={art.image}
                            alt={art.name}
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
                            {art.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-[#111111] uppercase tracking-wide truncate text-xs">
                            {art.name}
                          </div>
                          <div className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
                            /{art.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Genres Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {art.genres && art.genres.length > 0 ? (
                          art.genres.slice(0, 3).map((g) => (
                            <span
                              key={g}
                              className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                              style={{
                                backgroundColor: "#FAF7EE",
                                border: "1px solid #111111",
                                color: "#111111",
                              }}
                            >
                              {g}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#7A7166] uppercase">
                            UNASSIGNED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Discography Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-[#111111]">
                        <span className="flex items-center gap-1">
                          <Disc3 className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                          <span>{art.albumCount || 0} ALBUMS</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Music className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                          <span>{art.songCount || 0} TRACKS</span>
                        </span>
                      </div>
                    </td>

                    {/* Followers Column */}
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      {(art.followerCount || 0).toLocaleString()}
                    </td>

                    {/* Status Column */}
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor:
                            art.status === "active" ? "#ECFDF5" : "#FAF7EE",
                          color:
                            art.status === "active" ? "#15803D" : "#7A7166",
                          border:
                            art.status === "active"
                              ? "1px solid #16A34A"
                              : "1px solid #111111",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              art.status === "active" ? "#16A34A" : "#7A7166",
                          }}
                        />
                        <span>{art.status.toUpperCase()}</span>
                      </span>
                    </td>

                    {/* Commands Column */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(art)}
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
                          onClick={() => handleDelete(art.id, art.name)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: CREATE / EDIT ARTIST ───────────────────────── */}
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
                <Mic2 className="w-4 h-4 text-[#F05A28]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#111111]">
                  {editingArtist ? "EDIT ARTIST IDENTIFIER" : "REGISTER NEW ARTIST"}
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
              {/* Name */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  ARTIST / BAND NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="E.G. DAFT PUNK"
                  className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none uppercase font-mono"
                  style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                />
              </div>

              {/* Genres */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  GENRES (COMMA-SEPARATED)
                </label>
                <input
                  type="text"
                  value={formGenres}
                  onChange={(e) => setFormGenres(e.target.value)}
                  placeholder="E.G. ELECTRONIC, FRENCH HOUSE, SYNTHWAVE"
                  className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none uppercase font-mono"
                  style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  EDITORIAL BIOGRAPHY
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="SHORT EDITORIAL PROFILE..."
                  className="w-full p-2.5 bg-transparent border-2 border-[#111111] focus:outline-none font-mono"
                  style={{ boxShadow: "1.5px 1.5px 0px #111111" }}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block mb-1 text-[#7A7166] uppercase">
                  PORTRAIT ARTWORK (FILE OR URL)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
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
                  <span>{editingArtist ? "UPDATE ARTIST" : "REGISTER"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
