"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { EditProfileModal } from "@/components/user/EditProfileModal";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  LogOut,
  LogIn,
  Sliders,
  ChevronDown,
  User,
} from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
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
    <header
      className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between select-none font-mono"
      style={{
        backgroundColor: "#FAF7EE",
        borderBottom: "2px solid #111111",
      }}
    >
      {/* Left: Navigation History & Console Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: "#111111",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F6EEDE";
              e.currentTarget.style.transform = "translate(-0.5px,-0.5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FAF7EE";
              e.currentTarget.style.transform = "";
            }}
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => router.forward()}
            className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
              color: "#111111",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F6EEDE";
              e.currentTarget.style.transform = "translate(-0.5px,-0.5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FAF7EE";
              e.currentTarget.style.transform = "";
            }}
            aria-label="Forward"
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Retro Terminal Search Panel */}
        <form
          onSubmit={handleSearchSubmit}
          className="ml-1 hidden sm:flex items-center gap-2.5 px-3 py-1.5 transition-all w-64 md:w-80 lg:w-96"
          style={{
            backgroundColor: "#FAF7EE",
            border: "2px solid #111111",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "#F05A28" }} />
          <span className="font-bold text-xs select-none" style={{ color: "#F05A28" }}>&gt;</span>
          <input
            type="text"
            placeholder="Search AURALIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#111111] placeholder-[#7A7166]/60 focus:outline-none uppercase font-mono tracking-wide"
            style={{ caretColor: "#F05A28" }}
          />
        </form>
      </div>

      {/* Right: Audio Frequency Spec & Profile Terminal */}
      <div className="flex items-center gap-3">
        {/* Hi-Fi Audio Spec Badge */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1.5px solid #111111",
            boxShadow: "1.5px 1.5px 0px #111111",
            color: "#111111",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse shrink-0"
            style={{ backgroundColor: "#F05A28" }}
          />
          <span>FLAC // 24-BIT 96kHz</span>
        </div>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                boxShadow: "1.5px 1.5px 0px #111111",
                color: "#111111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F6EEDE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FAF7EE";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                }
                alt={user.name}
                className="w-6 h-6 object-cover shrink-0"
                style={{ border: "1px solid #111111" }}
              />
              <span className="hidden sm:inline text-[11px] tracking-wider max-w-[130px] truncate">
                {user.name.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 text-[#111111]" />
              <span
                className="text-[9px] font-bold px-1"
                style={{
                  backgroundColor: isAdmin ? "#111111" : "#F05A28",
                  color: "#FFFFFF",
                }}
              >
                {isAdmin ? "SYS" : "USER"}
              </span>
            </button>

            {/* Profile Retro Inset Dropdown Menu */}
            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 z-50 p-1.5 space-y-1 font-mono text-xs"
                style={{
                  backgroundColor: "#FAF7EE",
                  border: "2px solid #111111",
                  boxShadow: "3px 3px 0px #111111",
                }}
              >
                <div
                  className="px-3 py-2 mb-1"
                  style={{
                    backgroundColor: "#F6EEDE",
                    border: "1px solid #111111",
                  }}
                >
                  <p className="text-xs text-[#111111] truncate font-bold uppercase">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#7A7166] truncate mt-0.5">
                    {user.email}
                  </p>
                  <span
                    className="inline-block mt-1 text-[8.5px] font-bold px-1.5 py-0.5 uppercase"
                    style={{
                      backgroundColor: "#FFF0ED",
                      color: "#F05A28",
                      border: "1px solid #F05A28",
                    }}
                  >
                    {user.role} tier
                  </span>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 font-bold uppercase transition-colors hover:bg-[#F6EEDE] text-[#111111]"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#F05A28]" />
                    <span>[ CMS CONTROL ]</span>
                  </Link>
                )}

                {/* Edit Profile Action */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsEditProfileOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 font-bold uppercase transition-colors hover:bg-[#F6EEDE] text-[#111111] text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#F05A28]" />
                  <span>[ EDIT PROFILE ]</span>
                </button>

                <Link
                  href="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 font-bold uppercase transition-colors hover:bg-[#F6EEDE] text-[#7A7166] hover:text-[#111111]"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#F05A28]" />
                  <span>[ OPERATOR DESK ]</span>
                </Link>

                <Link
                  href="/library"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 font-bold uppercase transition-colors hover:bg-[#F6EEDE] text-[#7A7166] hover:text-[#111111]"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#F05A28]" />
                  <span>[ AUDIO ARCHIVE ]</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 font-bold uppercase text-[#D62828] hover:bg-[#FFF0ED] transition-colors text-left cursor-pointer"
                  style={{ borderTop: "1px solid rgba(17,17,17,0.15)" }}
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
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              backgroundColor: "#F05A28",
              color: "#111111",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e84e1d";
              e.currentTarget.style.transform = "translate(-1px,-1px)";
              e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F05A28";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
            }}
          >
            <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>LOGIN</span>
          </Link>
        )}
      </div>

      {/* Profile Edit Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </header>
  );
}
