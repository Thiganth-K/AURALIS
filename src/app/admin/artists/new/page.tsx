"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mic2, Upload, AlertCircle, Loader2 } from "lucide-react";

export default function AdminNewArtistPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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
        setImage(data.url);
      } else {
        setError(data.error || "Failed to upload image");
      }
    } catch {
      setError("Network error while uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Artist name is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        bio: bio.trim(),
        genres: genres.split(",").map((g) => g.trim()).filter(Boolean),
        image: image || undefined,
      };

      const res = await fetch("/api/admin/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create artist");
        setSubmitting(false);
        return;
      }

      router.push("/admin/artists");
    } catch {
      setError("Network error while creating artist");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 select-none font-mono">
      {/* Return to Roster Link */}
      <div>
        <Link
          href="/admin/artists"
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
          <span>[ RETURN TO ARTIST ROSTER ]</span>
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
              AURALIS // ARTIST REGISTRATION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-[#111111] uppercase">
            REGISTER ARTIST PROFILE
          </h1>
          <p className="text-xs text-[#7A7166] mt-1 tracking-wide">
            Create an authoritative artist record to connect with songs, albums, and featured signals.
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
              <span>ARTIST NAME *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "")
                  );
                }
              }}
              placeholder="e.g. Noir Avenue"
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
              <span>URL SLUG (AUTO-GENERATED)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="noir-avenue"
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
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>GENRES (COMMA-SEPARATED)</span>
            </label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="Electronic, Alternative, Ambient"
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
              <span>BIOGRAPHY</span>
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Artist background, musical influences, and origins..."
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none resize-none"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                color: "#111111",
                caretColor: "#F05A28",
              }}
            />
          </div>

          {/* Artist Photo Upload */}
          <div
            className="p-4 space-y-2.5"
            style={{
              backgroundColor: "#F6EEDE",
              border: "2px dashed #111111",
            }}
          >
            <label className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
              <span>ARTIST IMAGE / PHOTO</span>
            </label>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  image ||
                  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80"
                }
                alt="Artist Preview"
                className="w-14 h-14 object-cover shrink-0"
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
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>UPLOADING...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" style={{ color: "#F05A28" }} />
                    <span>[ SELECT PHOTO ]</span>
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

          <div className="pt-3 flex justify-end gap-3 border-t border-[#111111]/15">
            <Link
              href="/admin/artists"
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
              disabled={submitting || uploadingImage}
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
                <span>[ REGISTER ARTIST ]</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
