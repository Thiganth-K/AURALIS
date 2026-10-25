"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  User as UserIcon,
  Shield,
  LogOut,
  LogIn,
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
    <header className="sticky top-0 z-30 h-16 bg-[#090909]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
      {/* Left: Navigation History */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-[#181818] border border-white/5 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white/10 transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => router.forward()}
          className="w-8 h-8 rounded-full bg-[#181818] border border-white/5 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white/10 transition-colors"
          aria-label="Forward"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Search bar inside top bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="ml-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-white/5 focus-within:border-white/20 transition-all w-64 md:w-80"
        >
          <Search className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-[#71717A] focus:outline-none"
          />
        </form>
      </div>

      {/* Right: Membership Tier & Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Hi-Fi Tier Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181818] border border-[#D7FF3F]/20 text-[11px] font-mono text-[#D7FF3F]">
          <Sparkles className="w-3 h-3 text-[#D7FF3F]" />
          <span>FLAC 24-bit • Hi-Fi</span>
        </div>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-[#141414] hover:bg-[#181818] border border-white/5 hover:border-white/10 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                }
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-white/10"
              />
              <span className="text-xs font-medium text-white hidden sm:inline max-w-[120px] truncate">
                {user.name}
              </span>
              {isAdmin && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D7FF3F]/10 text-[#D7FF3F] font-mono uppercase">
                  Admin
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#181818] border border-white/10 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[#71717A] truncate">
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#A1A1AA]">
                      Role: {user.role}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#D7FF3F] hover:bg-[#D7FF3F]/10 transition-colors font-medium"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#D7FF3F]" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  href="/library"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Your Library</span>
                </Link>

                <div className="border-t border-white/5 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in</span>
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-[#D7FF3F] transition-colors text-xs font-medium"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
