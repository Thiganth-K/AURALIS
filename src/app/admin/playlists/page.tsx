"use client";

import React, { useEffect, useState } from "react";
import {
  ListMusic,
  Plus,
  Search,
  Trash2,
  Edit3,
  Loader2,
  Upload,
  AlertCircle,
  X,
  Music,
  Sparkles,
  Check,
  Filter,
  CheckCircle2,
} from "lucide-react";

interface AdminPlaylistItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  artworkUrl: string;
  isCurated: boolean;
  isPublic: boolean;
  songCount: number;
  owner?: { name: string; email: string };
  createdAt: string;
}

interface SongOption {
  id: string;
  title: string;
  artist?: { name: string };
}

export default function AdminPlaylistsPage() {
  const [playlists, setPlaylists] = useState<AdminPlaylistItem[]>([]);
  const [availableSongs, setAvailableSongs] = useState<SongOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formArtworkUrl, setFormArtworkUrl] = useState("");
  const [formIsCurated, setFormIsCurated] = useState(true);
  const [formIsPublic, setFormIsPublic] = useState(true);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, sRes] = await Promise.all([
        fetch("/api/admin/playlists"),
        fetch("/api/admin/songs?status=published"),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.success) setPlaylists(pData.playlists);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.success) setAvailableSongs(sData.songs);
      }
    } catch (err) {
      console.error("Failed to load playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingPlaylistId(null);
    setFormName("");
    setFormDescription("");
    setFormArtworkUrl("");
    setFormIsCurated(true);
    setFormIsPublic(true);
    setSelectedSongIds([]);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = async (pl: AdminPlaylistItem) => {
    setEditingPlaylistId(pl.id);
    setFormName(pl.name);
    setFormDescription(pl.description || "");
    setFormArtworkUrl(pl.artworkUrl || "");
    setFormIsCurated(pl.isCurated);
    setFormIsPublic(pl.isPublic);
    setFormError(null);
    setModalOpen(true);

    try {
      const res = await fetch(`/api/admin/playlists/${pl.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.playlist?.songs) {
          const sIds = data.playlist.songs.map((s: { id?: string; _id?: string }) => s.id || s._id).filter(Boolean);
          setSelectedSongIds(sIds);
        }
      }
    } catch (err) {
      console.error("Failed to fetch playlist songs:", err);
    }
  };

  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (res.ok && data.success) {
        setFormArtworkUrl(data.url);
      } else {
        setFormError(data.error || "Failed to upload artwork");
      }
    } catch {
      setFormError("Upload network error");
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Playlist name is required");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        artworkUrl: formArtworkUrl || undefined,
        isCurated: formIsCurated,
        isPublic: formIsPublic,
        songIds: selectedSongIds,
      };

      const url = editingPlaylistId
        ? `/api/admin/playlists/${editingPlaylistId}`
        : "/api/admin/playlists";
      const method = editingPlaylistId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save playlist");
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      setNotification({
        type: "success",
        text: editingPlaylistId
          ? `PLAYLIST "${formName.toUpperCase()}" UPDATED SUCCESSFULLY.`
          : `PLAYLIST "${formName.toUpperCase()}" CREATED SUCCESSFULLY.`,
      });
      fetchData();
      setTimeout(() => setNotification(null), 4000);
    } catch {
      setFormError("Network error while saving playlist");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete playlist "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/playlists/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPlaylists((prev) => prev.filter((p) => p.id !== id));
        setNotification({
          type: "success",
          text: `PLAYLIST "${name.toUpperCase()}" DELETED.`,
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  const filtered = playlists.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.owner?.name && p.owner.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "curated" && p.isCurated) ||
      (typeFilter === "user" && !p.isCurated);

    const matchesVisibility =
      visibilityFilter === "all" ||
      (visibilityFilter === "public" && p.isPublic) ||
      (visibilityFilter === "private" && !p.isPublic);

    return matchesSearch && matchesType && matchesVisibility;
  });

  return (
    <div className="space-y-6 select-none font-mono">
      {/* ── 1. HERO BANNER ─────────────────────────────────── */}
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
                AURALIS // EDITORIAL CURATION
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              EDITORIAL PLAYLISTS // CATALOG
            </h1>

            {/* Sub-text (Two Lines) */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Curate verified editorial playlists, weekly mixes, and radio stations
              <br className="hidden sm:inline" />
              {" "}broadcasted across the high-fidelity streaming network.
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

      {/* Notification banner */}
      {notification && (
        <div
          className="p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
          style={{
            backgroundColor: notification.type === "success" ? "#ECFDF5" : "#FFF0ED",
            border: notification.type === "success" ? "2px solid #15803D" : "2px solid #D62828",
            color: notification.type === "success" ? "#15803D" : "#D62828",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* ── 2. SEARCH & FILTERS BAR ─────────────────────────── */}
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
            placeholder="FILTER PLAYLISTS BY NAME, OWNER, OR MOOD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#111111] placeholder-[#7A7166] focus:outline-none font-mono text-xs uppercase"
            style={{ caretColor: "#F05A28" }}
          />
        </div>

        {/* Right Section: Filters & Create Button */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Type Filter */}
          <div
            className="flex items-center gap-2 px-3 py-2 text-xs"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <Filter className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
            <span className="text-[10px] font-bold uppercase text-[#7A7166]">TYPE:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent font-bold text-[#111111] uppercase focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">ALL TYPES</option>
              <option value="curated">EDITORIAL</option>
              <option value="user">USER CREATED</option>
            </select>
          </div>

          {/* Visibility Filter */}
          <div
            className="flex items-center gap-2 px-3 py-2 text-xs"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <span className="text-[10px] font-bold uppercase text-[#7A7166]">VISIBILITY:</span>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="bg-transparent font-bold text-[#111111] uppercase focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">ALL</option>
              <option value="public">PUBLIC</option>
              <option value="private">PRIVATE</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: "#F05A28",
              color: "#111111",
              border: "2px solid #111111",
              boxShadow: "3px 3px 0px #111111",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e84e1d";
              e.currentTarget.style.transform = "translate(-1px,-1px)";
              e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F05A28";
              e.currentTarget.style.transform = "translate(0,0)";
              e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
            }}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>[ + CURATE PLAYLIST ]</span>
          </button>
        </div>
      </div>

      {/* ── 3. PLAYLISTS DIRECTORY TABLE ───────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Ticks */}
        <span
          className="absolute top-1.5 left-2 text-xs font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute top-1.5 right-2 text-xs font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute bottom-1.5 left-2 text-xs font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute bottom-1.5 right-2 text-xs font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        {/* Directory Header Bar */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: "2px solid #111111" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              EDITORIAL BROADCAST PLAYLISTS
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7166]">
            [ {filtered.length} PLAYLISTS ARCHIVED ]
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#F05A28" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A7166]">
              LOADING PLAYLIST CATALOG...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#7A7166] text-xs font-bold uppercase tracking-wider">
            NO PLAYLISTS MATCH THE CURRENT FILTERS.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className="text-[#7A7166] uppercase font-bold text-[10px] tracking-wider"
                style={{
                  backgroundColor: "#F6EEDE",
                  borderBottom: "1.5px solid #111111",
                }}
              >
                <tr>
                  <th className="py-3 px-4">PLAYLIST</th>
                  <th className="py-3 px-4">CURATOR</th>
                  <th className="py-3 px-4">TRACKS</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">VISIBILITY</th>
                  <th className="py-3 px-4 text-right">COMMANDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {filtered.map((pl) => (
                  <tr key={pl.id} className="hover:bg-[#F6EEDE] transition-colors">
                    {/* Playlist Info with glowing orange thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            pl.artworkUrl ||
                            "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&auto=format&fit=crop&q=80"
                          }
                          alt={pl.name}
                          className="w-10 h-10 object-cover shrink-0"
                          style={{
                            border: "1.5px solid #111111",
                            boxShadow: "0 4px 12px rgba(240, 90, 40, 0.45)",
                          }}
                        />
                        <div>
                          <div className="font-bold text-[#111111] uppercase tracking-wide">
                            {pl.name}
                          </div>
                          <div className="text-[10px] text-[#7A7166] truncate max-w-xs">
                            {pl.description || `/${pl.slug}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Curator */}
                    <td className="py-3 px-4">
                      {pl.isCurated ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
                          style={{ color: "#F05A28" }}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AURALIS EDITORIAL</span>
                        </span>
                      ) : (
                        <span className="font-bold text-[#111111] uppercase text-[11px]">
                          {pl.owner?.name || "COMMUNITY USER"}
                        </span>
                      )}
                    </td>

                    {/* Tracks */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#111111] inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F6EEDE] border border-[#111111]/20 text-[11px]">
                        <Music className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                        <span>{pl.songCount} TRACKS</span>
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      {pl.isCurated ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: "#FFF0ED",
                            color: "#F05A28",
                            border: "1px solid #F05A28",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F05A28]" />
                          EDITORIAL
                        </span>
                      ) : (
                        <span
                          className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: "#FAF7EE",
                            color: "#7A7166",
                            border: "1px solid #111111",
                          }}
                        >
                          USER
                        </span>
                      )}
                    </td>

                    {/* Visibility */}
                    <td className="py-3 px-4">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: pl.isPublic ? "#ECFDF5" : "#FAF7EE",
                          color: pl.isPublic ? "#15803D" : "#7A7166",
                          border: pl.isPublic ? "1px solid #15803D" : "1px solid #111111",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: pl.isPublic ? "#15803D" : "#7A7166" }}
                        />
                        {pl.isPublic ? "PUBLIC" : "PRIVATE"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(pl)}
                          title="Edit playlist"
                          className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                          style={{
                            backgroundColor: "#FAF7EE",
                            border: "1.5px solid #111111",
                            color: "#111111",
                            boxShadow: "1.5px 1.5px 0px #111111",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#F6EEDE";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FAF7EE";
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>[ EDIT ]</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(pl.id, pl.name)}
                          title="Delete playlist"
                          className="p-1 transition-all cursor-pointer"
                          style={{
                            backgroundColor: "#FAF7EE",
                            border: "1.5px solid #111111",
                            color: "#D62828",
                            boxShadow: "1.5px 1.5px 0px #111111",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#FFF0ED";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FAF7EE";
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

      {/* ── 4. CREATE / EDIT PLAYLIST MODAL ────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl p-6 relative flex flex-col max-h-[90vh]"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "5px 5px 0px #111111",
            }}
          >
            {/* Modal Corner Ticks */}
            <span
              className="absolute top-1.5 left-2 text-xs font-mono select-none"
              style={{ color: "#F05A28" }}
            >
              ┌
            </span>
            <span
              className="absolute top-1.5 right-2 text-xs font-mono select-none"
              style={{ color: "#F05A28" }}
            >
              ┐
            </span>
            <span
              className="absolute bottom-1.5 left-2 text-xs font-mono select-none"
              style={{ color: "#F05A28" }}
            >
              └
            </span>
            <span
              className="absolute bottom-1.5 right-2 text-xs font-mono select-none"
              style={{ color: "#F05A28" }}
            >
              ┘
            </span>

            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#111111]/20 shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 inline-block shrink-0"
                  style={{ backgroundColor: "#F05A28" }}
                />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  {editingPlaylistId
                    ? "EDITORIAL PLAYLIST // MODIFY CHANNEL"
                    : "EDITORIAL PLAYLIST // CURATE CHANNEL"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 border border-[#111111] bg-[#FAF7EE] text-[#111111] hover:bg-[#FFF0ED] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div
                className="mb-4 p-3 flex items-center gap-2 text-xs font-bold uppercase shrink-0"
                style={{
                  backgroundColor: "#FFF0ED",
                  border: "1.5px solid #D62828",
                  color: "#D62828",
                  boxShadow: "2px 2px 0px #111111",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
              {/* Playlist Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                  <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                  <span>PLAYLIST NAME *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Midnight High-Fi"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none uppercase"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "2px solid #111111",
                    color: "#111111",
                    caretColor: "#F05A28",
                  }}
                />
              </div>

              {/* Description / Mood */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                  <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                  <span>DESCRIPTION / MOOD</span>
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Curated soundscapes, nocturnal beats, and warm frequencies..."
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none resize-none"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "2px solid #111111",
                    color: "#111111",
                    caretColor: "#F05A28",
                  }}
                />
              </div>

              {/* Artwork Upload */}
              <div
                className="p-3.5 space-y-2"
                style={{
                  backgroundColor: "#F6EEDE",
                  border: "2px dashed #111111",
                }}
              >
                <label className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                  <span>PLAYLIST COVER ARTWORK</span>
                </label>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      formArtworkUrl ||
                      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&auto=format&fit=crop&q=80"
                    }
                    alt="Preview"
                    className="w-14 h-14 object-cover shrink-0"
                    style={{
                      border: "2px solid #111111",
                      boxShadow: "2px 2px 0px #111111",
                    }}
                  />
                  <label
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase transition-all"
                    style={{
                      backgroundColor: "#FAF7EE",
                      border: "1.5px solid #111111",
                      boxShadow: "2px 2px 0px #111111",
                      color: "#111111",
                    }}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>UPLOADING...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>[ SELECT ARTWORK ]</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArtworkUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Checkboxes: Curated & Public */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label
                  onClick={() => setFormIsCurated(!formIsCurated)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer p-2.5 transition-colors"
                  style={{
                    backgroundColor: formIsCurated ? "#FFF0ED" : "#F6EEDE",
                    border: "1.5px solid #111111",
                  }}
                >
                  <div
                    className="w-4 h-4 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: formIsCurated ? "#F05A28" : "#FAF7EE",
                      border: "1.5px solid #111111",
                    }}
                  >
                    {formIsCurated && <Check className="w-3 h-3 text-[#111111] stroke-[3]" />}
                  </div>
                  <span>CURATED EDITORIAL</span>
                </label>

                <label
                  onClick={() => setFormIsPublic(!formIsPublic)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer p-2.5 transition-colors"
                  style={{
                    backgroundColor: formIsPublic ? "#ECFDF5" : "#F6EEDE",
                    border: "1.5px solid #111111",
                  }}
                >
                  <div
                    className="w-4 h-4 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: formIsPublic ? "#15803D" : "#FAF7EE",
                      border: "1.5px solid #111111",
                    }}
                  >
                    {formIsPublic && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <span>PUBLIC CATALOG</span>
                </label>
              </div>

              {/* Song Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]">
                    <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                    <span>SELECT TRACKS ({selectedSongIds.length})</span>
                  </label>
                  <span className="text-[10px] text-[#7A7166]">
                    CLICK TO TOGGLE INCLUSION
                  </span>
                </div>

                <div
                  className="max-h-48 overflow-y-auto divide-y divide-[#111111]/15 p-1"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "2px solid #111111",
                  }}
                >
                  {availableSongs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#7A7166]">
                      NO PUBLISHED SONGS AVAILABLE.
                    </div>
                  ) : (
                    availableSongs.map((s) => {
                      const selected = selectedSongIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => toggleSongSelection(s.id)}
                          className="p-2 flex items-center justify-between text-xs cursor-pointer transition-colors"
                          style={{
                            backgroundColor: selected ? "#FFF0ED" : "transparent",
                          }}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-[#111111] uppercase block truncate">
                              {s.title}
                            </span>
                            <span className="text-[10px] text-[#7A7166] uppercase">
                              {s.artist?.name || "INDEPENDENT"}
                            </span>
                          </div>
                          <div
                            className="w-4 h-4 flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: selected ? "#F05A28" : "#FAF7EE",
                              border: "1.5px solid #111111",
                            }}
                          >
                            {selected && <Check className="w-3 h-3 text-[#111111] stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-[#111111]/15 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    color: "#7A7166",
                  }}
                >
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: "#F05A28",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "3px 3px 0px #111111",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>COMPILING...</span>
                    </>
                  ) : (
                    <span>[ {editingPlaylistId ? "UPDATE PLAYLIST" : "COMPILE PLAYLIST"} ]</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
