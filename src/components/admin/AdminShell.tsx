"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutGrid,
  Users,
  Music,
  Mic2,
  Disc3,
  ListMusic,
  Star,
  LogOut,
  Radio,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "DASHBOARD", href: "/admin", icon: LayoutGrid },
  { name: "USERS", href: "/admin/users", icon: Users },
  { name: "SONGS", href: "/admin/songs", icon: Music },
  { name: "ARTISTS", href: "/admin/artists", icon: Mic2 },
  { name: "ALBUMS", href: "/admin/albums", icon: Disc3 },
  { name: "PLAYLISTS", href: "/admin/playlists", icon: ListMusic },
  { name: "FEATURED", href: "/admin/featured", icon: Star },
  { name: "INSTRUCTIONS", href: "/admin/instructions", icon: BookOpen },
];

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/home");
      }
    }
  }, [user, isAdmin, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getSectionTitle = () => {
    if (pathname === "/admin") return "OVERVIEW";
    const segment = pathname.replace("/admin/", "").replace("/admin", "");
    return segment.toUpperCase() || "OVERVIEW";
  };

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none font-mono"
      style={{ backgroundColor: "#F6EEDE", color: "#111111" }}
    >
      {/* ── TOP HEADER (Full Width) ────────────────────────── */}
      <header
        className="h-14 px-5 flex items-center justify-between shrink-0 select-none z-30"
        style={{
          backgroundColor: "#FAF7EE",
          borderBottom: "2px solid #111111",
        }}
      >
        {/* Left: Soundwave Icon + Brand Title + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 mr-1"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Soundwave Bars Icon */}
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-[2.5px] h-6 px-0.5">
              <span className="w-[3px] bg-[#F05A28] h-3 rounded-sm" />
              <span className="w-[3px] bg-[#F05A28] h-5 rounded-sm" />
              <span className="w-[3px] bg-[#F05A28] h-6 rounded-sm" />
              <span className="w-[3px] bg-[#F05A28] h-4 rounded-sm" />
              <span className="w-[3px] bg-[#F05A28] h-2 rounded-sm" />
            </div>

            {/* AURALIS ADMIN / MUSIC SYSTEM */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs tracking-wider text-[#111111]">
                  AURALIS
                </span>
                <span
                  className="text-[8px] font-mono font-bold px-1 py-0.2 uppercase"
                  style={{
                    backgroundColor: "#FFF0ED",
                    border: "1px solid #F05A28",
                    color: "#F05A28",
                  }}
                >
                  ADMIN
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#7A7166] tracking-widest uppercase leading-none mt-0.5 font-bold">
                MUSIC SYSTEM
              </span>
            </div>
          </Link>

          {/* Vertical Separator */}
          <div className="h-4 w-[1.5px] bg-[#111111]/30 mx-3 hidden sm:block" />

          {/* Center Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[#111111]">
            <span className="text-[#111111]">CONTROL ROOM</span>
            <span className="text-[#7A7166]">/</span>
            <span className="text-[#111111]">[ {getSectionTitle()} ]</span>
          </div>
        </div>

        {/* Right Actions: NODE ONLINE + ADMIN PILL */}
        <div className="flex items-center gap-3">
          {/* Node Online Pill */}
          <div
            className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#F05A28] shrink-0 animate-pulse" />
            <span className="text-[#111111]">NODE // ONLINE</span>
          </div>

          {/* Admin User Dropdown Pill */}
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase px-2.5 py-1"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1.5px 1.5px 0px #111111",
            }}
          >
            <UserIcon className="w-3.5 h-3.5 text-[#111111]" />
            <span className="text-[#111111] hidden sm:inline text-[11px] tracking-wider">
              {user?.name?.toUpperCase() || "AURALIS ADMIN"}
            </span>
            <ChevronDown className="w-3 h-3 text-[#111111]" />
            <span
              className="text-[9px] font-bold px-1 uppercase"
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
              }}
            >
              SYS
            </span>
          </div>
        </div>
      </header>

      {/* ── MIDDLE ROW: SIDEBAR + MAIN CONTENT ────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className="hidden lg:flex w-64 flex-col select-none shrink-0 z-20 justify-between"
          style={{
            backgroundColor: "#FAF7EE",
            borderRight: "2px solid #111111",
          }}
        >
          {/* Top Section */}
          <div className="p-3 space-y-2">
            {/* Header with corner tick */}
            <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
              <span className="flex items-center gap-1.5 text-[#F05A28]">
                <span>▸</span>
                <span className="text-[#F05A28]">// CONTROL ROOM</span>
              </span>
              <span className="text-[#7A7166] text-xs">┐</span>
            </div>

            {/* Nav Items */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                    style={{
                      backgroundColor: isActive ? "#F05A28" : "transparent",
                      color: isActive ? "#111111" : "#111111",
                      border: isActive ? "2px solid #111111" : "2px solid transparent",
                      boxShadow: isActive ? "3px 3px 0px #111111" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#F6EEDE";
                        e.currentTarget.style.border = "2px solid #111111";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.border = "2px solid transparent";
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: "#111111" }}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold text-[#111111]">▶</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div
            className="p-3 space-y-2"
            style={{
              borderTop: "2px solid #111111",
              backgroundColor: "#FAF7EE",
            }}
          >
            {/* Public Stream Button */}
            <Link
              href="/home"
              className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase transition-all"
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
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#F05A28]" />
                <span>PUBLIC STREAM</span>
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-[#F05A28]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F05A28] animate-pulse inline-block" />
                <span>• LIVE</span>
              </span>
            </Link>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase transition-all cursor-pointer text-left"
              style={{
                backgroundColor: "#FAF7EE",
                color: "#F05A28",
                border: "1.5px solid #F05A28",
                boxShadow: "2px 2px 0px #111111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FFF0ED";
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FAF7EE";
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
              }}
            >
              <LogOut className="w-3.5 h-3.5 text-[#F05A28]" />
              <span>LOGOUT</span>
            </button>

            {/* Version Tag */}
            <div className="pt-1 text-[10px] font-mono text-[#7A7166] tracking-widest font-bold">
              / AURALIS // v1.0
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Modal */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex backdrop-blur-[2px]">
            <div
              className="w-64 h-full flex flex-col p-4 justify-between"
              style={{
                backgroundColor: "#FAF7EE",
                borderRight: "2px solid #111111",
                boxShadow: "4px 0px 0px #111111",
              }}
            >
              <div>
                <div
                  className="flex items-center justify-between pb-3 mb-4"
                  style={{ borderBottom: "2px solid #111111" }}
                >
                  <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                    AURALIS // ADMIN
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 border border-[#111111] bg-[#FAF7EE] text-[#111111]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5 overflow-y-auto">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider"
                      style={{
                        border: "1.5px solid #111111",
                        backgroundColor: pathname === item.href ? "#F05A28" : "#FAF7EE",
                        color: "#111111",
                      }}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#111111]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase text-[#F05A28] border border-[#F05A28] bg-[#FFF0ED]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main
          className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-7 flex flex-col justify-between"
          style={{ backgroundColor: "#F6EEDE" }}
        >
          <div className="flex-1">{children}</div>

          {/* Bottom Technical Status Line */}
          <div className="mt-8 pt-3 border-t border-[#111111]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono tracking-widest uppercase font-bold text-[#7A7166]">
            <span>MUSIC BUILT FOR REAL PEOPLE.</span>
            <div className="flex items-center gap-2">
              <span>24-BIT / 96kHz</span>
              <span className="text-[#F05A28] font-bold">///</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
