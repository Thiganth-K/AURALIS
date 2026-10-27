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
    <div className="max-w-2xl mx-auto space-y-6 select-none font-mono">
      {/* Return to Discography Link */}
      <div>
        <Link
          href="/admin/albums"
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
          <span>[ RETURN TO DISCOGRAPHY ]</span>
        </Link>
      </div>

      {/* Form Container */}
      <div
        className="relative p-6 sm:p-7"
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
        <div className="pb-4 mb-5 border-b border-[#111111]/20">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: "#F05A28" }}
            >
              AURALIS // DISCOGRAPHY RELEASE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-[#111111] uppercase">
            CREATE ALBUM RELEASE
          </h1>
          <p className="text-xs text-[#7A7166] mt-1 tracking-wide">
            Provision a new long-play album or EP catalog record with sleeve artwork and liner notes.
          </p>
        </div>

        {error && (
          <div
            className="mb-5 p-3 flex items-center gap-2 text-xs font-bold uppercase"
            style={{
              backgroundColor: "#FFF0ED",
              border: "1.5px solid #D62828",
              color: "#D62828",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>ALBUM TITLE *</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. After Hours"
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
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>PRIMARY ARTIST *</span>
            </label>
            {loadingArtists ? (
              <div className="py-2 text-xs text-[#7A7166]">FETCHING ARTISTS...</div>
            ) : (
              <select
                required
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  color: "#111111",
                }}
              >
                {artists.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
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

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
                <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
                <span>GENRES</span>
              </label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Synthwave, Pop"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none uppercase"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  color: "#111111",
                  caretColor: "#F05A28",
                }}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>DESCRIPTION / LINER NOTES</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Record release notes, credits, and production context..."
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
            className="p-4 space-y-2.5"
            style={{
              backgroundColor: "#F6EEDE",
              border: "2px dashed #111111",
            }}
          >
            <label className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
              <span>SLEEVE ARTWORK COVER</span>
            </label>
            <div className="flex items-center gap-4">
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
                  border: "2px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                  color: "#111111",
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
                    <span>UPLOADING...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                    <span>[ SELECT ARTWORK ]</span>
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

          <div className="pt-3 flex justify-end gap-3 border-t border-[#111111]/15">
            <Link
              href="/admin/albums"
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
              disabled={submitting || uploadingArtwork}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
                  <span>COMMITTING...</span>
                </>
              ) : (
                <span>[ CREATE ALBUM ]</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
