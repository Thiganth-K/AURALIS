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
  FileAudio,
  Video,
  Film,
  Check,
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
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFilename, setVideoFilename] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
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
          if (aData.success) setArtists(aData.artists);
        }
        if (albumsRes.ok) {
          const albData = await albumsRes.json();
          if (albData.success) setAlbums(albData.albums);
        }
      } catch (err) {
        console.error("Failed to load options:", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadFormRelations();
  }, []);

  const availableAlbums = albumId
    ? albums
    : artistId
    ? albums.filter((a) => a.artistId === artistId)
    : albums;

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingAudio(true);
    setAudioFilename(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "audio");
      formData.append("resourceType", "video");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setAudioUrl(data.url);
        // If an MP4 was uploaded directly as the master signal, set videoUrl too
        if (file.name.toLowerCase().endsWith(".mp4") && !videoUrl) {
          setVideoUrl(data.url);
          setVideoFilename(file.name);
        }
        if (data.duration && !duration) {
          setDuration(Math.round(data.duration).toString());
        }
      } else {
        setError(data.error || "Failed to upload audio signal");
      }
    } catch {
      setError("Network error while uploading audio file");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingVideo(true);
    setVideoFilename(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "video");
      formData.append("resourceType", "video");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setVideoUrl(data.url);
        // If no audio signal yet, MP4 audio can also serve as the audioUrl
        if (!audioUrl) {
          setAudioUrl(data.url);
          setAudioFilename(file.name);
        }
      } else {
        setError(data.error || "Failed to upload MP4 video signal");
      }
    } catch {
      setError("Network error while uploading video file");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingArtwork(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "artwork");
      formData.append("resourceType", "image");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
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
        videoUrl: videoUrl || undefined,
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
    <div className="max-w-3xl mx-auto space-y-6 select-none font-mono">
      {/* Return to Catalog Link */}
      <div>
        <Link
          href="/admin/songs"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
          style={{
            backgroundColor: "#FAF7EE",
            color: "#111111",
            border: "1.5px solid #111111",
            boxShadow: "2px 2px 0px #111111",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F6EEDE";
            e.currentTarget.style.transform = "translate(-1px,-1px)";
            e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FAF7EE";
            e.currentTarget.style.transform = "translate(0,0)";
            e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[ RETURN TO CATALOG ]</span>
        </Link>
      </div>

      {/* Main Ingestion Form Card */}
      <div
        className="relative p-6 sm:p-8"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "4px 4px 0px #111111",
        }}
      >
        {/* Technical corner ticks */}
        <span className="absolute top-1.5 left-2 text-xs font-mono text-[#7A7166]">┌</span>
        <span className="absolute top-1.5 right-2 text-xs font-mono text-[#7A7166]">┐</span>
        <span className="absolute bottom-1.5 left-2 text-xs font-mono text-[#7A7166]">└</span>
        <span className="absolute bottom-1.5 right-2 text-xs font-mono text-[#7A7166]">┘</span>

        {/* Header */}
        <div className="pb-4 mb-6 border-b border-[#111111]/20">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: "#F05A28" }}
            >
              AURALIS // INGESTION PROTOCOL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-[#111111] uppercase">
            INGEST AUDIO MASTER SIGNAL
          </h1>
          <p className="text-xs text-[#7A7166] mt-1 tracking-wide">
            Upload master audio frequency file, sleeve artwork, and calibrate track metadata.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-3.5 flex items-center gap-2.5 text-xs font-bold uppercase"
            style={{
              backgroundColor: "#FFF0ED",
              border: "2px solid #D62828",
              color: "#D62828",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Track Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>TRACK TITLE *</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Night Drive"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none uppercase"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                color: "#111111",
                caretColor: "#F05A28",
              }}
            />
          </div>

          {/* Artist & Album Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                <span>ARTIST *</span>
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
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  color: "#111111",
                }}
              >
                <option value="">SELECT ARTIST...</option>
                {artists.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                <span>ALBUM SLEEVE</span>
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
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  color: "#111111",
                }}
              >
                <option value="">SINGLE (STANDALONE SIGNAL)</option>
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
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                <span>GENRE</span>
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Electronic, Synthwave"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none uppercase"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  color: "#111111",
                  caretColor: "#F05A28",
                }}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                <span>DURATION (SEC)</span>
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="180"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  color: "#111111",
                  caretColor: "#F05A28",
                }}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                <span>RELEASE DATE</span>
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none uppercase"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  color: "#111111",
                }}
              />
            </div>
          </div>

          {/* Audio File Ingestion Box */}
          <div
            className="p-4 sm:p-5 space-y-3"
            style={{
              backgroundColor: "#F6EEDE",
              border: "2px dashed #F05A28",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#111111]/15">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#111111]">
                <FileAudio className="w-4 h-4" style={{ color: "#F05A28" }} />
                <span>// AUDIO SIGNAL INPUT *</span>
              </label>
              {audioUrl && (
                <span className="text-[10px] font-bold text-[#15803D] uppercase flex items-center gap-1">
                  ✓ AUDIO MOUNTED
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#7A7166] tracking-wide">
              Ingest master audio frequency (FLAC, WAV, MP3, M4A). Cloudinary storage streaming encoded.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: "#F05A28",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e84e1d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F05A28";
                }}
              >
                {uploadingAudio ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>[ INGESTING SIGNAL... ]</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
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
                <span
                  className="text-[11px] font-bold uppercase px-2.5 py-1 truncate max-w-xs"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    color: "#111111",
                  }}
                >
                  {audioFilename}
                </span>
              )}
            </div>
          </div>

          {/* ── VIDEO SIGNAL INPUT (MP4 / MUSIC VIDEO - OPTIONAL) ── */}
          <div
            className="p-4 sm:p-5 space-y-3"
            style={{
              backgroundColor: "#F6EEDE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#111111]/15">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#111111]">
                <Film className="w-4 h-4" style={{ color: "#F05A28" }} />
                <span>// VIDEO SIGNAL INPUT (MP4 MUSIC VIDEO - OPTIONAL)</span>
              </label>
              {videoUrl && (
                <span className="text-[10px] font-bold text-[#15803D] uppercase flex items-center gap-1">
                  ✓ VIDEO MOUNTED
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#7A7166] tracking-wide">
              Ingest master video visual signal (.MP4, .WEBM, .MOV). Allows listeners to toggle and stream the music video in high fidelity.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFF0ED";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FAF7EE";
                }}
              >
                {uploadingVideo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>[ INGESTING VIDEO... ]</span>
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5 text-[#F05A28]" />
                    <span>[ SELECT MP4 VIDEO FILE ]</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                  className="hidden"
                />
              </label>

              {videoFilename && (
                <span
                  className="text-[11px] font-bold uppercase px-2.5 py-1 truncate max-w-xs"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    color: "#111111",
                  }}
                >
                  {videoFilename}
                </span>
              )}

              {videoUrl && (
                <div className="w-full pt-2">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-w-md h-36 object-contain bg-black border-2 border-[#111111]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sleeve Artwork Box */}
          <div
            className="p-4 sm:p-5 space-y-3"
            style={{
              backgroundColor: "#F6EEDE",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#111111]/15">
              <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                // SLEEVE ARTWORK (OPTIONAL)
              </label>
              {artworkUrl && (
                <span className="text-[10px] font-bold text-[#15803D] uppercase">
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
                className="w-16 h-16 object-cover shrink-0"
                style={{
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
              />

              <label
                className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: "#FAF7EE",
                  color: "#111111",
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFF0ED";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FAF7EE";
                }}
              >
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
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"
            style={{
              backgroundColor: "#F6EEDE",
              border: "2px solid #111111",
            }}
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                EXPLICIT ADVISORY
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExplicit(false)}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{
                    backgroundColor: !explicit ? "#FAF7EE" : "#F6EEDE",
                    color: !explicit ? "#111111" : "#7A7166",
                    border: "2px solid #111111",
                    boxShadow: !explicit ? "2px 2px 0px #111111" : "none",
                  }}
                >
                  [ CLEAN ]
                </button>
                <button
                  type="button"
                  onClick={() => setExplicit(true)}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{
                    backgroundColor: explicit ? "#FFF0ED" : "#F6EEDE",
                    color: explicit ? "#D62828" : "#7A7166",
                    border: "2px solid #111111",
                    boxShadow: explicit ? "2px 2px 0px #111111" : "none",
                  }}
                >
                  [ EXPLICIT ]
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                RELEASE STATE
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{
                    backgroundColor: status === "draft" ? "#FEF3C7" : "#F6EEDE",
                    color: status === "draft" ? "#B45309" : "#7A7166",
                    border: "2px solid #111111",
                    boxShadow: status === "draft" ? "2px 2px 0px #111111" : "none",
                  }}
                >
                  [ SAVE DRAFT ]
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{
                    backgroundColor: status === "published" ? "#F05A28" : "#F6EEDE",
                    color: status === "published" ? "#111111" : "#7A7166",
                    border: "2px solid #111111",
                    boxShadow: status === "published" ? "2px 2px 0px #111111" : "none",
                  }}
                >
                  [ PUBLISH ]
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex justify-end gap-3 border-t border-[#111111]/15">
            <Link
              href="/admin/songs"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                color: "#7A7166",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#111111";
                e.currentTarget.style.backgroundColor = "#F6EEDE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#7A7166";
                e.currentTarget.style.backgroundColor = "#FAF7EE";
              }}
            >
              [ CANCEL ]
            </Link>

            <button
              type="submit"
              disabled={submitting || uploadingAudio || uploadingArtwork}
              className="px-6 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
