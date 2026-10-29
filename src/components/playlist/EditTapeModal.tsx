"use client";

import React, { useState, useRef } from "react";
import { Playlist } from "@/types";
import {
  X,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";

interface EditTapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist;
  onSaved: (updatedPlaylist: Playlist) => void;
  onDeleted?: () => void;
}

const RETRO_CASSETTE_PRESETS = [
  "https://res.cloudinary.com/dvgllw3rq/image/upload/v1793273289/auralis/artwork/qclsrhggy4iytsp0drhq.jpg",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
];

export function EditTapeModal({
  isOpen,
  onClose,
  playlist,
  onSaved,
  onDeleted,
}: EditTapeModalProps) {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || "");
  const [artworkUrl, setArtworkUrl] = useState(playlist.artworkUrl || "");
  const [isPublic, setIsPublic] = useState(playlist.isPublic ?? true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if playlist changes
  React.useEffect(() => {
    if (playlist) {
      setName(playlist.name);
      setDescription(playlist.description || "");
      setArtworkUrl(playlist.artworkUrl || "");
      setIsPublic(playlist.isPublic ?? true);
    }
  }, [playlist]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "artwork");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setArtworkUrl(data.url);
      } else {
        setErrorMsg(data.error || "Failed to upload artwork image");
      }
    } catch (err) {
      console.error("Artwork upload error:", err);
      setErrorMsg("Error uploading image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Cassette name cannot be empty");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/library/playlists/${playlist.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          artworkUrl: artworkUrl.trim(),
          isPublic,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.playlist) {
        setSuccessMsg("Cassette tape updated successfully!");
        onSaved(data.playlist);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMsg(data.error || "Failed to update cassette");
      }
    } catch (err) {
      console.error("Update playlist error:", err);
      setErrorMsg("Network error updating cassette");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to eject and delete "${playlist.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/library/playlists/${playlist.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onClose();
        if (onDeleted) onDeleted();
      } else {
        setErrorMsg(data.error || "Failed to delete cassette tape");
      }
    } catch (err) {
      console.error("Delete playlist error:", err);
      setErrorMsg("Network error deleting cassette");
    } finally {
      setDeleting(false);
    }
  };

  const previewClipId = `edit-tape-preview-${playlist.id}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-[1px] animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 overflow-y-auto font-mono select-none">
        <div
          className="relative w-full max-w-xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "5px 5px 0px #111111",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Corner Crop Marks */}
          <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
          <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
          <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
          <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: "2px solid #111111" }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#F05A28] inline-block" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#111111]">
                TAPE EDITOR // CASSETTE SPECIFICATIONS
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 cursor-pointer transition-colors hover:bg-[#F6EEDE]"
              style={{ border: "1.5px solid #111111" }}
              aria-label="Close"
            >
              <X className="w-4 h-4 text-[#111111]" />
            </button>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div
              className="px-3 py-2 text-xs font-bold text-[#D62828] uppercase flex items-center gap-2"
              style={{
                backgroundColor: "#FFF0ED",
                border: "1.5px solid #D62828",
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              className="px-3 py-2 text-xs font-bold text-[#2A9D8F] uppercase flex items-center gap-2"
              style={{
                backgroundColor: "#EBFBFA",
                border: "1.5px solid #2A9D8F",
              }}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ── 1. CASSETTE ARTWORK PREVIEW & UPLOAD ── */}
            <div>
              <label className="block text-[11px] font-bold text-[#7A7166] uppercase mb-1.5">
                CASSETTE TAPE ARTWORK // LABEL INLAY IMAGE
              </label>

              <div
                className="p-3.5 flex flex-col sm:flex-row items-center gap-4"
                style={{
                  backgroundColor: "#F6EEDE",
                  border: "1.5px solid #111111",
                }}
              >
                {/* Real-time Pixel Cassette Preview */}
                <div className="w-40 h-28 shrink-0 flex items-center justify-center p-1 bg-[#FAF7EE] border border-[#111111]">
                  <svg
                    viewBox="5 11 90 62"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-[1.5px_1.5px_0px_#111111]"
                  >
                    <defs>
                      <clipPath id={previewClipId}>
                        <rect x="11" y="18" width="78" height="37" rx="1" />
                      </clipPath>
                    </defs>

                    {/* Shell */}
                    <rect x="6" y="12" width="88" height="60" rx="3" fill="#242321" stroke="#111111" strokeWidth="2" />
                    <rect x="9" y="14" width="82" height="2" fill="#52504B" />

                    {/* Inner Label Box with Image! */}
                    <rect x="11" y="18" width="78" height="37" fill="#FAF7EE" stroke="#111111" strokeWidth="1.5" />
                    {artworkUrl && (
                      <g clipPath={`url(#${previewClipId})`}>
                        <image
                          href={artworkUrl}
                          x="11"
                          y="18"
                          width="78"
                          height="37"
                          preserveAspectRatio="xMidYMid slice"
                          opacity="0.95"
                        />
                      </g>
                    )}

                    {/* Label Header Stripe */}
                    <rect x="11" y="18" width="78" height="8" fill="#F05A28" />
                    <text x="14" y="23.5" fontSize="3.2" fontWeight="bold" fontFamily="monospace" fill="#FAF7EE">
                      A  {(name || "TAPE").slice(0, 14).toUpperCase()}
                    </text>

                    {/* Tape Window */}
                    <rect x="23" y="33" width="54" height="18" rx="1.5" fill="rgba(18,18,18,0.6)" stroke="#111111" strokeWidth="1.5" />
                    <rect x="34" y="40.5" width="32" height="3.5" fill="#783D1B" opacity="0.9" />

                    {/* Spools */}
                    <circle cx="35" cy="42" r="6" fill="#FAF7EE" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="35" cy="42" r="2.5" fill="#F05A28" />
                    <circle cx="65" cy="42" r="6" fill="#FAF7EE" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="65" cy="42" r="2.5" fill="#F05A28" />
                  </svg>
                </div>

                {/* Upload & URL actions */}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1.5px solid #111111",
                        boxShadow: "1.5px 1.5px 0px #111111",
                        color: "#111111",
                      }}
                    >
                      <Upload className="w-3.5 h-3.5 text-[#F05A28]" />
                      <span>{uploadingImage ? "UPLOADING..." : "UPLOAD COVER ART"}</span>
                    </button>
                    <span className="text-[10px] text-[#7A7166]">PNG, JPG, WEBP</span>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={artworkUrl}
                      onChange={(e) => setArtworkUrl(e.target.value)}
                      placeholder="Or enter image URL https://..."
                      className="w-full px-2.5 py-1.5 text-[11px] text-[#111111] font-mono focus:outline-none"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1.5px solid #111111",
                      }}
                    />
                  </div>

                  {/* Presets */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[9.5px] font-bold text-[#7A7166] uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#F05A28]" />
                      PRESETS:
                    </span>
                    {RETRO_CASSETTE_PRESETS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setArtworkUrl(url)}
                        className="w-5 h-5 overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          border: artworkUrl === url ? "2px solid #F05A28" : "1px solid #111111",
                        }}
                        title={`Preset ${i + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. CASSETTE NAME ── */}
            <div>
              <label className="block text-[11px] font-bold text-[#7A7166] uppercase mb-1">
                CASSETTE TAPE TITLE
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. GOLDEN HOUR TAPE"
                className="w-full px-3 py-2 text-xs text-[#111111] uppercase font-mono tracking-wider focus:outline-none"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "1.5px solid #111111",
                  boxShadow: "1.5px 1.5px 0px #111111",
                }}
              />
            </div>

            {/* ── 3. CASSETTE DESCRIPTION ── */}
            <div>
              <label className="block text-[11px] font-bold text-[#7A7166] uppercase mb-1">
                SLEEVE NOTES / DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add liner notes, mood description, or recording context..."
                className="w-full px-3 py-2 text-xs text-[#111111] font-mono leading-relaxed focus:outline-none resize-none"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "1.5px solid #111111",
                  boxShadow: "1.5px 1.5px 0px #111111",
                }}
              />
            </div>

            {/* ── 4. BROADCAST PRIVACY ── */}
            <div className="flex items-center gap-3 p-3" style={{ backgroundColor: "#F6EEDE", border: "1.5px solid #111111" }}>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className="flex items-center gap-2 text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                {isPublic ? (
                  <>
                    <Globe className="w-4 h-4 text-[#F05A28]" />
                    <span className="text-[#111111]">PUBLIC BROADCAST (DISCOVERABLE)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#7A7166]" />
                    <span className="text-[#7A7166]">PRIVATE CASSETTE (ONLY YOU CAN VIEW)</span>
                  </>
                )}
              </button>
            </div>

            {/* ── MODAL FOOTER & ACTIONS ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3" style={{ borderTop: "1.5px solid rgba(17,17,17,0.15)" }}>
              {/* Delete Tape button */}
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[#D62828] hover:bg-[#FFF0ED]"
                style={{
                  border: "1.5px solid #D62828",
                  boxShadow: "1.5px 1.5px 0px #D62828",
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? "EJECTING..." : "DELETE TAPE"}</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-mono"
                  style={{
                    backgroundColor: "#FAF7EE",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "2px 2px 0px #111111",
                  }}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer font-mono disabled:opacity-50"
                  style={{
                    backgroundColor: "#F05A28",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "2.5px 2.5px 0px #111111",
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>SAVE CASSETTE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

