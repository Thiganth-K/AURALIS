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

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<AdminAlbumItem[]>([]);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
        if (data.success) setAlbums(data.albums);
      }
      if (artistRes.ok) {
        const data = await artistRes.json();
        if (data.success) setArtists(data.artists);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formArtistId) {
      setFormError("Please select a registered artist");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      const payload = {
        title: formTitle,
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

  const filtered = albums.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.artist?.name && a.artist.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Disc3 className="w-6 h-6 text-[#D7FF3F]" />
            <span>Album Releases</span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Manage long-play albums, EPs, and tie songs directly to registered artist records.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>New Album</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs w-full sm:w-80">
        <Search className="w-4 h-4 text-[#71717A] shrink-0" />
        <input
          type="text"
          placeholder="Filter albums or artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-white placeholder-[#71717A] focus:outline-none"
        />
      </div>

      {/* Albums Grid / Table */}
      <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#71717A] text-xs">
            No albums found. Click &quot;New Album&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[#71717A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Album & Artwork</th>
                  <th className="py-3.5 px-4 font-semibold">Artist</th>
                  <th className="py-3.5 px-4 font-semibold">Tracks</th>
                  <th className="py-3.5 px-4 font-semibold">Release Date</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((alb) => (
                  <tr key={alb.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={alb.artworkUrl}
                          alt={alb.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="font-semibold text-white">{alb.title}</div>
                          <div className="text-[11px] text-[#71717A] font-mono">
                            /{alb.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#A1A1AA]">
                      {alb.artist?.name || "Unassigned"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-[#A1A1AA]">
                        <Music className="w-3 h-3 text-[#71717A]" />
                        {alb.songCount || 0} tracks
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#71717A]">
                      {new Date(alb.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase font-semibold">
                        {alb.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(alb)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(alb.id, alb.title)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
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

      {/* Create / Edit Album Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-[#D7FF3F]" />
                <span>{editingAlbum ? "Edit Album Details" : "Create Album"}</span>
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#71717A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Neon Horizon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Artist (Select registered database record) *
                </label>
                <select
                  required
                  value={formArtistId}
                  onChange={(e) => setFormArtistId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                >
                  <option value="">Select Artist...</option>
                  {artists.map((art) => (
                    <option key={art.id} value={art.id}>
                      {art.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                    Release Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formReleaseDate}
                    onChange={(e) => setFormReleaseDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                    Genres
                  </label>
                  <input
                    type="text"
                    value={formGenres}
                    onChange={(e) => setFormGenres(e.target.value)}
                    placeholder="Synthwave, Retrowave"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Liner notes or album concept..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Album Artwork
                </label>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formArtworkUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&auto=format&fit=crop&q=80"}
                    alt="Artwork Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Artwork</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleArtworkUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-5 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingAlbum ? "Update Album" : "Save Album"}</span>
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
