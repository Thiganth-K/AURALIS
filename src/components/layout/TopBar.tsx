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
  Radio,
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
    <header className="sticky top-0 z-30 h-16 bg-[#050212]/95 backdrop-blur-md border-b-2 border-[#2d1b69] shadow-[0_4px_20px_rgba(45,27,105,0.25)] px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Navigation History & Console Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg bg-[#0a0520] border border-[#4d2db7] flex items-center justify-center text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_8px_rgba(0,240,255,0.4)] active:translate-y-0.5 transition-all"
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => router.forward()}
            className="w-8 h-8 rounded-lg bg-[#0a0520] border border-[#4d2db7] flex items-center justify-center text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_8px_rgba(0,240,255,0.4)] active:translate-y-0.5 transition-all"
            aria-label="Forward"
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Retro Terminal Search Panel */}
        <form
          onSubmit={handleSearchSubmit}
          className="ml-1 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#0a0520] border border-[#4d2db7] focus-within:border-[#00f0ff] focus-within:shadow-[0_0_12px_rgba(0,240,255,0.35)] rounded-lg transition-all w-64 md:w-80 lg:w-96 group"
        >
          <Search className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
          <span className="text-[#00f0ff] font-pixel text-xs select-none">&gt;</span>
          <input
            type="text"
            placeholder="Search AURALIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent font-pixel text-xs text-white placeholder-[#7a6ba8] focus:outline-none"
          />
        </form>
      </div>

      {/* Right: Audio Frequency Spec & Profile Terminal */}
      <div className="flex items-center gap-3">
        {/* Hi-Fi Audio Spec Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#02131d] border border-[#00f0ff] text-[11px] font-pixel text-[#00f0ff] rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)]">
          <Radio className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
          <span>FLAC // 24-BIT 96kHz</span>
        </div>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 bg-[#0a0520] hover:bg-[#120a35] border border-[#4d2db7] hover:border-[#00f0ff] rounded-lg shadow-[0_0_8px_rgba(77,45,183,0.25)] active:translate-y-0.5 transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                }
                alt={user.name}
                className="w-6 h-6 rounded object-cover border border-[#ff2a85]"
              />
              <span className="text-xs font-pixel text-white hidden sm:inline max-w-[120px] truncate">
                {user.name}
              </span>
              <span className="text-[10px] font-pixel text-[#00f0ff]">▾</span>
            </button>

            {/* Profile Retro Inset Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0c0628] border-2 border-[#5c32c4] rounded-lg shadow-[0_8px_24px_rgba(92,50,196,0.5)] z-50 p-2 space-y-1">
                <div className="px-3 py-2 border-b border-[#2d1b69] mb-1 bg-[#070318] rounded">
                  <p className="text-[11px] font-pixel text-white truncate font-bold">
                    {user.name}
                  </p>
                  <p className="text-[9px] font-mono text-[#a79cd0] truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 text-[8.5px] font-pixel px-1.5 py-0.5 bg-[#d7ff3f]/10 text-[#d7ff3f] border border-[#d7ff3f]/30 rounded uppercase">
                    {user.role} tier
                  </span>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-pixel text-[#d7ff3f] hover:bg-[#160c40] rounded transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>[ CMS CONTROL ]</span>
                  </Link>
                )}

                <Link
                  href="/library"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-pixel text-[#a79cd0] hover:text-white hover:bg-[#160c40] rounded transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>[ AUDIO ARCHIVE ]</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-pixel text-red-400 hover:bg-red-500/10 rounded transition-colors text-left"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#d7ff3f] text-black font-pixel text-xs font-bold shadow-[0_0_10px_rgba(215,255,63,0.4)] hover:bg-[#cbf532] transition-all"
          >
            <LogIn className="w-3 h-3" />
            <span>LOGIN</span>
          </Link>
        )}
      </div>
    </header>
  );
}
