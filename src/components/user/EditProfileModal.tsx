"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Upload,
  User,
  Key,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RETRO_AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
];

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if user changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "avatar");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setAvatar(data.url);
      } else {
        setErrorMsg(data.error || "Failed to upload avatar image");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      setErrorMsg("Error uploading image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Name cannot be empty");
      return;
    }

    if (showPasswordSection && newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("New passwords do not match");
        return;
      }
      if (!currentPassword) {
        setErrorMsg("Current password is required to change password");
        return;
      }
    }

    setSaving(true);
    try {
      const payload: {
        name: string;
        avatar: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        name: name.trim(),
        avatar: avatar.trim(),
      };

      if (showPasswordSection && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateProfile(payload);
      if (res.success) {
        setSuccessMsg("Profile updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSection(false);
        setTimeout(() => {
          onClose();
        }, 900);
      } else {
        setErrorMsg(res.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setErrorMsg("Network error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-[1px] animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 overflow-y-auto font-mono select-none">
        <div
          className="relative w-full max-w-lg p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "5px 5px 0px #111111",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Retro Corner Crop Marks */}
          <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
          <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
          <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
          <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

          {/* Header */}
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: "2px solid #111111" }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#F05A28] inline-block" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#111111]">
                USER PROFILE // CONSOLE SETTINGS
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

          {/* Feedback Badges */}
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
            {/* ── 1. AVATAR / PROFILE PHOTO SECTION ── */}
            <div>
              <label className="block text-[11px] font-bold text-[#7A7166] uppercase mb-2">
                PROFILE PHOTO // OPERATOR AVATAR
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5" style={{ backgroundColor: "#F6EEDE", border: "1.5px solid #111111" }}>
                {/* Photo Preview with Corner Marks */}
                <div className="relative w-20 h-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    }
                    alt={name || "User Avatar"}
                    className="w-full h-full object-cover"
                    style={{
                      border: "2px solid #111111",
                      boxShadow: "2px 2px 0px #111111",
                    }}
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Action & URL Input */}
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
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#FAF7EE";
                        e.currentTarget.style.transform = "translate(-0.5px,-0.5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FAF7EE";
                        e.currentTarget.style.transform = "";
                      }}
                    >
                      <Upload className="w-3.5 h-3.5 text-[#F05A28]" />
                      <span>{uploadingImage ? "UPLOADING..." : "UPLOAD PHOTO"}</span>
                    </button>

                    <span className="text-[10px] text-[#7A7166]">JPG, PNG, WEBP</span>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Or enter image URL https://..."
                      className="w-full px-2.5 py-1.5 text-[11px] text-[#111111] font-mono focus:outline-none"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1.5px solid #111111",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Preset Avatars */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#7A7166] uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F05A28]" />
                  PRESETS:
                </span>
                <div className="flex items-center gap-1.5">
                  {RETRO_AVATAR_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className="w-6 h-6 overflow-hidden cursor-pointer transition-transform hover:scale-110"
                      style={{
                        border: avatar === url ? "2px solid #F05A28" : "1px solid #111111",
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

            {/* ── 2. NAME & EMAIL ── */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#7A7166] uppercase mb-1">
                  DISPLAY NAME / OPERATOR HANDLE
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. ALEX CHEN"
                    className="w-full px-3 py-2 text-xs text-[#111111] uppercase font-mono tracking-wider focus:outline-none"
                    style={{
                      backgroundColor: "#FAF7EE",
                      border: "1.5px solid #111111",
                      boxShadow: "1.5px 1.5px 0px #111111",
                    }}
                  />
                  <User className="absolute right-3 top-2.5 w-3.5 h-3.5 text-[#7A7166]" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7A7166] uppercase mb-1">
                  ACCOUNT EMAIL (LOCKED)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 text-xs text-[#7A7166] font-mono tracking-wider cursor-not-allowed"
                  style={{
                    backgroundColor: "#F2EADB",
                    border: "1.5px solid #C8BFB0",
                  }}
                />
              </div>
            </div>

            {/* ── 3. OPTIONAL PASSWORD SECTION ── */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-xs font-bold uppercase text-[#F05A28] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{showPasswordSection ? "- HIDE PASSWORD SETTINGS" : "+ CHANGE ACCOUNT PASSWORD"}</span>
              </button>

              {showPasswordSection && (
                <div
                  className="mt-2.5 p-3.5 space-y-2.5 animate-in slide-in-from-top-2 duration-150"
                  style={{
                    backgroundColor: "#F6EEDE",
                    border: "1.5px solid #111111",
                  }}
                >
                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7166] uppercase mb-1">
                      CURRENT PASSWORD
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-2.5 py-1.5 text-xs text-[#111111] font-mono focus:outline-none"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1px solid #111111",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7166] uppercase mb-1">
                      NEW PASSWORD (MIN. 6 CHARACTERS)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-2.5 py-1.5 text-xs text-[#111111] font-mono focus:outline-none"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1px solid #111111",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7166] uppercase mb-1">
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-2.5 py-1.5 text-xs text-[#111111] font-mono focus:outline-none"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1px solid #111111",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── MODAL ACTIONS ── */}
            <div className="flex items-center justify-end gap-3 pt-3" style={{ borderTop: "1.5px solid rgba(17,17,17,0.15)" }}>
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
                    <span>SAVE PROFILE</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

