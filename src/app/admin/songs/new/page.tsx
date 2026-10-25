"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Music,
  Upload,
  AlertCircle,
  Loader2,
  CheckCircle2,
  FileAudio,
  Radio,
} from "lucide-react";

interface ArtistOption {
  id: string;
  name: string;
  image?: string;
  genres?: string[];
}

interface AlbumOption {
  id: string;
  title: string;
  artistId: string;
  artworkUrl?: string;
}

export default function AdminNewSongPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [albums, setAlbums] = useState<AlbumOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Form Fields
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("180");
  const [explicit, setExplicit] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("published");

  // Media Uploads
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFilename, setAudioFilename] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadFormRelations() {
      try {
        const [artistsRes, albumsRes] = await Promise.all([
          fetch("/api/admin/artists"),
          fetch("/api/admin/albums"),
        ]);
        if (artistsRes.ok) {
          const aData = await artistsRes.json();
          if (aData.success) {
            setArtists(aData.artists);
            if (aData.artists.length > 0) {
              setArtistId(aData.artists[0].id);
              if (aData.artists[0].genres?.[0]) {
                setGenre(aData.artists[0].genres[0]);
              }
            }
          }
        }
        if (albumsRes.ok) {
          const albData = await albumsRes.json();
          if (albData.success) {
            setAlbums(albData.albums);
          }
        }
      } catch (err) {
        console.error("Failed to load options:", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadFormRelations();
  }, []);

  // Filter albums matching selected artist
  const availableAlbums = albums.filter((alb) => !artistId || alb.artistId === artistId);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional audio duration probe
    const audioObj = new Audio(URL.createObjectURL(file));
    audioObj.onloadedmetadata = () => {
      if (audioObj.duration && !isNaN(audioObj.duration)) {
        setDuration(Math.round(audioObj.duration).toString());
      }
    };

    setUploadingAudio(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "audio");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAudioUrl(data.url);
        setAudioFilename(data.filename || file.name);
      } else {
        setError(data.error || "Failed to upload audio file");
      }
    } catch {
      setError("Network error while uploading audio file");
    } finally {
      setUploadingAudio(false);
    }
  };

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
      setError("Song title is required");
      return;
    }
    if (!artistId) {
      setError("Please select an artist");
      return;
    }
    if (!audioUrl) {
      setError("Please upload an audio file (mp3, wav, m4a, ogg)");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        artistId,
        albumId: albumId || undefined,
        audioUrl,
        artworkUrl: artworkUrl || undefined,
        duration: Number(duration) || 180,
        genre: genre.trim() || "Electronic",
        releaseDate,
        explicit,
        status,
      };

      const res = await fetch("/api/admin/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create song");
        setSubmitting(false);
        return;
      }

      router.push("/admin/songs");
    } catch {
      setError("Network error while creating song");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <Link
          href="/admin/songs"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Music className="w-5 h-5 text-[#D7FF3F]" />
            <span>Ingest & Publish Audio Track</span>
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Upload master audio file, artwork, and define metadata for catalog delivery.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-2xl bg-[#121212] border border-white/5 shadow-2xl">
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Track Title */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Track Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Cyberpunk"
              className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          {/* Artist & Album Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Artist (Source of Truth) *
              </label>
              <select
                required
                value={artistId}
                onChange={(e) => {
                  setArtistId(e.target.value);
                  const selected = artists.find((a) => a.id === e.target.value);
                  if (selected?.genres?.[0] && !genre) {
                    setGenre(selected.genres[0]);
                  }
                }}
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

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Album (Optional Single if empty)
              </label>
              <select
                value={albumId}
                onChange={(e) => {
                  setAlbumId(e.target.value);
                  const selAlb = albums.find((a) => a.id === e.target.value);
                  if (selAlb?.artworkUrl && !artworkUrl) {
                    setArtworkUrl(selAlb.artworkUrl);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              >
                <option value="">Single (No Album)</option>
                {availableAlbums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Genre, Duration, Release Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Electronic, Synthwave"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="180"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Release Date
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>
          </div>

          {/* Audio File Upload Box */}
          <div className="p-4 rounded-xl bg-[#181818] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-[#D7FF3F]" />
                <span>Audio Stream File (mp3, wav, m4a, ogg) *</span>
              </label>
              {audioUrl && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#71717A]">
              Audio binaries are stored securely in storage and linked via URL.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white transition-colors">
                {uploadingAudio ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D7FF3F]" />
                    <span>Uploading audio master...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#D7FF3F]" />
                    <span>Choose Audio File</span>
                  </>
                )}
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/m4a,audio/ogg"
                  onChange={handleAudioUpload}
                  disabled={uploadingAudio}
                  className="hidden"
                />
              </label>

              {audioFilename && (
                <span className="text-xs font-mono text-[#A1A1AA] truncate max-w-xs">
                  {audioFilename}
                </span>
              )}
            </div>
          </div>

          {/* Artwork Upload Box */}
          <div className="p-4 rounded-xl bg-[#181818] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Track Artwork (Optional — will inherit Album/Artist if empty)
              </label>
            </div>

            <div className="flex items-center gap-4 pt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  artworkUrl ||
                  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80"
                }
                alt="Artwork Preview"
                className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
              />

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors">
                {uploadingArtwork ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading artwork...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Artwork</span>
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

          {/* Publishing Settings: Explicit & Draft/Published Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Explicit Advisory
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExplicit(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    !explicit
                      ? "bg-white text-black font-semibold"
                      : "bg-white/5 text-[#A1A1AA]"
                  }`}
                >
                  Clean
                </button>
                <button
                  type="button"
                  onClick={() => setExplicit(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    explicit
                      ? "bg-red-500 text-white font-semibold"
                      : "bg-white/5 text-[#A1A1AA]"
                  }`}
                >
                  Explicit (E)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Initial Release State
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
                    status === "draft"
                      ? "bg-amber-400 text-black font-semibold"
                      : "bg-white/5 text-[#A1A1AA]"
                  }`}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
                    status === "published"
                      ? "bg-[#D7FF3F] text-black font-bold"
                      : "bg-white/5 text-[#A1A1AA]"
                  }`}
                >
                  Publish Immediately
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <Link
              href="/admin/songs"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploadingAudio || uploadingArtwork}
              className="px-6 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Registering Track...</span>
                </>
              ) : (
                <span>
                  {status === "published" ? "Save & Publish Song" : "Save as Draft"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
