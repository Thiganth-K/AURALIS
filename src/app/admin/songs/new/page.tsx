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
  const [releaseDate, setReleaseDate] = useState("2026-01-01");
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
    <div className="max-w-3xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-[#242424]">
        <Link
          href="/admin/songs"
          className="p-1.5 border border-[#2e2e2e] bg-[#141414] text-[#A1A1AA] hover:text-white shadow-[1px_1px_0px_#000] active:translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-pixel text-white tracking-wide flex items-center gap-2">
            <Music className="w-4 h-4 text-[#D7FF3F]" />
            <span>INGEST AUDIO MASTER SIGNAL</span>
          </h1>
          <p className="text-xs font-sans text-[#A1A1AA]">
            Upload master audio frequency file, sleeve artwork, and calibrate track metadata.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-[#111111] border-2 border-[#262626] shadow-[5px_5px_0px_#000]">
        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border-2 border-red-500/40 text-red-400 text-xs font-pixel flex items-center gap-2.5 shadow-[2px_2px_0px_#000]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Track Title */}
          <div>
            <label className="block text-xs font-pixel text-white mb-1.5">
              TRACK TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Night Drive"
              className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F] shadow-[inset_1px_1px_0px_#000]"
            />
          </div>

          {/* Artist & Album Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-pixel text-white mb-1.5">
                ARTIST (SOURCE OF TRUTH) *
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
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F] shadow-[inset_1px_1px_0px_#000]"
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
              <label className="block text-xs font-pixel text-white mb-1.5">
                ALBUM SLEEVE (OPTIONAL SINGLE)
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
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F] shadow-[inset_1px_1px_0px_#000]"
              >
                <option value="">Single (Standalone Signal)</option>
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
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                GENRE
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Electronic, Synthwave"
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                DURATION (SEC)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="180"
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                RELEASE DATE
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>
          </div>

          {/* Retro Audio File Upload Panel */}
          <div className="p-4 bg-[#141414] border-2 border-[#2a2a2a] shadow-[2px_2px_0px_#000] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#222]">
              <label className="text-xs font-pixel text-[#D7FF3F] flex items-center gap-2">
                <FileAudio className="w-3.5 h-3.5" />
                <span>// AUDIO SIGNAL INPUT *</span>
              </label>
              {audioUrl && (
                <span className="text-[10px] font-pixel text-emerald-400 flex items-center gap-1">
                  ✓ AUDIO READY
                </span>
              )}
            </div>

            <p className="text-[11px] font-sans text-[#71717A]">
              Drop master audio frequency (FLAC, WAV, MP3, M4A) to transcode and upload to Cloudinary.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label className="cursor-pointer retro-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-xs font-pixel">
                {uploadingAudio ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D7FF3F]" />
                    <span>[ INGESTING SIGNAL... ]</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#D7FF3F]" />
                    <span>[ SELECT AUDIO FILE ]</span>
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
                <span className="text-[10px] font-pixel text-[#A1A1AA] truncate max-w-xs bg-[#181818] border border-[#2e2e2e] px-2 py-1">
                  {audioFilename}
                </span>
              )}
            </div>
          </div>

          {/* Retro Artwork Upload Panel */}
          <div className="p-4 bg-[#141414] border-2 border-[#2a2a2a] shadow-[2px_2px_0px_#000] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#222]">
              <label className="text-xs font-pixel text-white">
                // SLEEVE ARTWORK (OPTIONAL)
              </label>
              {artworkUrl && (
                <span className="text-[10px] font-pixel text-[#D7FF3F]">
                  ✓ SLEEVE MOUNTED
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  artworkUrl ||
                  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80"
                }
                alt="Artwork Preview"
                className="w-14 h-14 border-2 border-black object-cover shrink-0 shadow-[2px_2px_0px_#000]"
              />

              <label className="cursor-pointer retro-btn-secondary inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-pixel">
                {uploadingArtwork ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>[ UPLOADING... ]</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>[ MOUNT ARTWORK ]</span>
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

          {/* Publishing Settings: Clean/Explicit & Draft/Published Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#141414] border-2 border-[#262626]">
            <div>
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-2">
                EXPLICIT ADVISORY
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExplicit(false)}
                  className={`px-3 py-1 text-xs font-pixel border-2 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                    !explicit
                      ? "bg-white text-black border-black font-bold"
                      : "bg-[#181818] border-[#333] text-[#A1A1AA]"
                  }`}
                >
                  [ CLEAN ]
                </button>
                <button
                  type="button"
                  onClick={() => setExplicit(true)}
                  className={`px-3 py-1 text-xs font-pixel border-2 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                    explicit
                      ? "bg-red-500 text-white border-black font-bold"
                      : "bg-[#181818] border-[#333] text-[#A1A1AA]"
                  }`}
                >
                  [ EXPLICIT ]
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-2">
                RELEASE STATE
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`px-3 py-1 text-xs font-pixel uppercase border-2 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                    status === "draft"
                      ? "bg-amber-400 text-black border-black font-bold"
                      : "bg-[#181818] border-[#333] text-[#A1A1AA]"
                  }`}
                >
                  [ SAVE DRAFT ]
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`px-3 py-1 text-xs font-pixel uppercase border-2 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                    status === "published"
                      ? "bg-[#D7FF3F] text-black border-black font-bold"
                      : "bg-[#181818] border-[#333] text-[#A1A1AA]"
                  }`}
                >
                  [ PUBLISH ]
                </button>
              </div>
            </div>
          </div>

          {/* Command Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <Link
              href="/admin/songs"
              className="retro-btn-ghost px-4 py-2 text-xs font-pixel"
            >
              [ CANCEL ]
            </Link>
            <button
              type="submit"
              disabled={submitting || uploadingAudio || uploadingArtwork}
              className="retro-btn-primary px-6 py-2 text-xs font-pixel flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>[ COMMITTING TRANSMISSION... ]</span>
                </>
              ) : (
                <span>
                  {status === "published" ? "[ PUBLISH SONG ]" : "[ SAVE DRAFT ]"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
