"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Disc3, Upload, AlertCircle, Loader2 } from "lucide-react";

interface ArtistOption {
  id: string;
  name: string;
}

export default function AdminNewAlbumPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [releaseDate, setReleaseDate] = useState("2026-01-01");

  useEffect(() => {
    try {
      setReleaseDate(new Date().toISOString().split("T")[0]);
    } catch {}
  }, []);
  const [genres, setGenres] = useState("");
  const [description, setDescription] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");

  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await fetch("/api/admin/artists");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.artists.length > 0) {
            setArtists(data.artists);
            setArtistId(data.artists[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load artists:", err);
      } finally {
        setLoadingArtists(false);
      }
    }
    fetchArtists();
  }, []);

  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingArtwork(true);
    setError(null);

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
        setArtworkUrl(data.url);
      } else {
        setError(data.error || "Failed to upload artwork");
      }
    } catch {
      setError("Network error while uploading artwork");
    } finally {
      setUploadingArtwork(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Album title is required");
      return;
    }
    if (!artistId) {
      setError("Please select a registered database artist");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        artistId,
        releaseDate,
        genres: genres.split(",").map((g) => g.trim()).filter(Boolean),
        description: description.trim(),
        artworkUrl: artworkUrl || undefined,
        status: "published",
      };

      const res = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create album");
        setSubmitting(false);
        return;
      }

      router.push("/admin/albums");
    } catch {
      setError("Network error while creating album");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <Link
          href="/admin/albums"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-[#D7FF3F]" />
            <span>Create New Album Release</span>
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Publish an album or EP linking directly to a registered artist in MongoDB.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-2xl bg-[#121212] border border-white/5 shadow-2xl">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Album Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Horizon"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Artist (Database Relationship) *
            </label>
            <select
              required
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              disabled={loadingArtists}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            >
              {loadingArtists ? (
                <option>Loading artists...</option>
              ) : (
                artists.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.name}
                  </option>
                ))
              )}
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
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Genres
              </label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Synthwave, Electronic"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Description / Concept Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Album concept, themes, and liner notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Album Artwork
            </label>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artworkUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&auto=format&fit=crop&q=80"}
                alt="Artwork Preview"
                className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors">
                {uploadingArtwork ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#D7FF3F]" />
                    <span>Upload Artwork</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleArtworkUpload}
                  disabled={uploadingArtwork}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-white/5">
            <Link
              href="/admin/albums"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploadingArtwork}
              className="px-5 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Album...</span>
                </>
              ) : (
                <span>Save Album</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
