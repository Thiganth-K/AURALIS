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
        if (data.success) {
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
      if (res.ok && data.success) {
        setFormImage(data.url);
      } else {
        setFormError(data.error || "Failed to upload image");
      }
    } catch {
      setFormError("Upload network error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const payload = {
        name: formName,
        bio: formBio,
        genres: formGenres.split(",").map((g) => g.trim()).filter(Boolean),
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

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Mic2 className="w-6 h-6 text-[#D7FF3F]" />
            <span>Artist Catalog</span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Maintain verified artist profiles, genre taxonomy, and bios across the network.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Add Artist</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs w-full sm:w-80">
        <Search className="w-4 h-4 text-[#71717A] shrink-0" />
        <input
          type="text"
          placeholder="Filter artists or genres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-white placeholder-[#71717A] focus:outline-none"
        />
      </div>

      {/* Artists Grid / Table */}
      <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#71717A] text-xs">
            No artists found. Click &quot;Add Artist&quot; to create the first record.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[#71717A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Artist</th>
                  <th className="py-3.5 px-4 font-semibold">Genres</th>
                  <th className="py-3.5 px-4 font-semibold">Discography</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.image}
                          alt={art.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="font-semibold text-white">{art.name}</div>
                          <div className="text-[11px] text-[#71717A] font-mono">
                            /{art.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {art.genres?.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-[#A1A1AA]"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 text-[#A1A1AA] font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Disc3 className="w-3 h-3 text-[#71717A]" />
                          {art.albumCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Music className="w-3 h-3 text-[#71717A]" />
                          {art.songCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase font-semibold">
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(art)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(art.id, art.name)}
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

      {/* Create / Edit Artist Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-[#D7FF3F]" />
                <span>{editingArtist ? "Edit Artist Profile" : "Register New Artist"}</span>
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
                  Artist Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Noir Avenue"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Genres (comma separated)
                </label>
                <input
                  type="text"
                  value={formGenres}
                  onChange={(e) => setFormGenres(e.target.value)}
                  placeholder="Electronic, Alternative, Ambient"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Biography
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Artist description and background..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Artist Avatar / Image
                </label>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80"}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading image...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
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
                    <span>{editingArtist ? "Update Profile" : "Save Artist"}</span>
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
