"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  LogOut,
  LogIn,
  Sliders,
} from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090909]/95 backdrop-blur-md border-b-2 border-black shadow-[0_2px_0_rgba(255,255,255,0.05)] px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Navigation History & Console Search */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 rounded-none bg-[#141414] border border-white/15 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#D7FF3F] shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          aria-label="Back"
          title="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => router.forward()}
          className="w-8 h-8 rounded-none bg-[#141414] border border-white/15 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#D7FF3F] shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          aria-label="Forward"
          title="Forward"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Retro Terminal Search Panel */}
        <form
          onSubmit={handleSearchSubmit}
          className="ml-2 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-white/15 focus-within:border-[#D7FF3F] shadow-[2px_2px_0px_#000] transition-all w-64 md:w-80 group"
        >
          <span className="text-[#D7FF3F] font-pixel text-xs font-bold select-none">&gt;</span>
          <input
            type="text"
            placeholder="Search AURALIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent font-pixel text-xs text-white placeholder-[#71717A] focus:outline-none"
          />
          <button type="submit" aria-label="Submit search">
            <Search className="w-3.5 h-3.5 text-[#71717A] group-focus-within:text-[#D7FF3F] shrink-0 transition-colors" />
          </button>
        </form>
      </div>

      {/* Right: Audio Frequency Spec & Profile Terminal */}
      <div className="flex items-center gap-3">
        {/* Hi-Fi Audio Spec Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] border border-[#D7FF3F]/30 text-[10px] font-pixel text-[#D7FF3F] shadow-[1px_1px_0px_#000]">
          <span className="w-1.5 h-1.5 bg-[#D7FF3F] animate-pulse inline-block" />
          <span>FLAC // 24-BIT 96kHz</span>
        </div>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 bg-[#141414] hover:bg-[#1a1a1a] border border-white/15 hover:border-[#D7FF3F] shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                }
                alt={user.name}
                className="w-6 h-6 object-cover border border-white/10"
              />
              <span className="text-xs font-pixel text-white hidden sm:inline max-w-[120px] truncate">
                {user.name}
              </span>
              <span className="text-[10px] font-pixel text-[#D7FF3F]">▼</span>
            </button>

            {/* Profile Retro Inset Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000] z-50 p-2 space-y-1">
                <div className="px-3 py-2 border-b border-white/10 mb-1 bg-[#090909]">
                  <p className="text-[11px] font-pixel text-white truncate font-bold">
                    {user.name}
                  </p>
                  <p className="text-[9px] font-mono text-[#71717A] truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 text-[8.5px] font-pixel px-1.5 py-0.2 bg-[#D7FF3F]/10 text-[#D7FF3F] border border-[#D7FF3F]/20 uppercase">
                    {user.role} tier
                  </span>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-pixel text-[#D7FF3F] hover:bg-[#1c1c1c] border border-transparent hover:border-[#D7FF3F]/40 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>[ CMS CONTROL ]</span>
                  </Link>
                )}

                <Link
                  href="/library"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-pixel text-[#A1A1AA] hover:text-white hover:bg-[#1c1c1c] border border-transparent hover:border-white/10 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>[ AUDIO ARCHIVE ]</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-pixel text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>[ EJECT / SIGN OUT ]</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="retro-btn retro-btn-primary"
          >
            <LogIn className="w-3 h-3" />
            <span>LOGIN</span>
          </Link>
        )}
      </div>
    </header>
  );
}
