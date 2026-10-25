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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <Link
          href="/admin/artists"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-[#D7FF3F]" />
            <span>Register Artist Profile</span>
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Create a verified database artist record to connect with songs and albums.
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
              Artist Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                }
              }}
              placeholder="e.g. Noir Avenue"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              URL Slug (auto-generated)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="noir-avenue"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Genres (comma separated)
            </label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
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
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Artist background, musical influences, and origins..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Artist Image / Photo
            </label>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80"}
                alt="Artist Preview"
                className="w-14 h-14 rounded-full object-cover border border-white/10 shrink-0"
              />
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors">
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#D7FF3F]" />
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

          <div className="pt-3 flex justify-end gap-3 border-t border-white/5">
            <Link
              href="/admin/artists"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-5 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Artist...</span>
                </>
              ) : (
                <span>Save Artist</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
