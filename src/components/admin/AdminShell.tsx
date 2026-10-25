"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Music,
  Mic2,
  Disc3,
  ListMusic,
  Star,
  LogOut,
  ExternalLink,
  Shield,
  Loader2,
  Menu,
  X,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Songs", href: "/admin/songs", icon: Music },
  { name: "Artists", href: "/admin/artists", icon: Mic2 },
  { name: "Albums", href: "/admin/albums", icon: Disc3 },
  { name: "Playlists", href: "/admin/playlists", icon: ListMusic },
  { name: "Featured", href: "/admin/featured", icon: Star },
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
        router.push("/");
      }
    }
  }, [user, isAdmin, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090909] text-white select-none">
      {/* Admin Sidebar - Desktop Retro Console */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0e0e0e] border-r-2 border-[#242424] shadow-[4px_0px_0px_#000] select-none shrink-0 z-20">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b-2 border-[#242424] bg-[#121212]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#D7FF3F] border border-black flex items-center justify-center text-black font-pixel text-xs shadow-[2px_2px_0px_#000]">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="font-pixel text-xs tracking-wider text-white">
                AURALIS
              </span>
              <span className="text-[9px] font-pixel text-[#D7FF3F] ml-1.5 px-1 py-0.5 border border-[#2e2e2e] bg-[#181818] uppercase">
                CONTROL
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[9px] font-pixel uppercase tracking-widest text-[#71717A]">
            // CONTROL ROOM
          </div>
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
                className={`flex items-center justify-between px-3 py-2 text-xs font-pixel transition-all border-2 ${
                  isActive
                    ? "bg-[#D7FF3F] text-black border-black shadow-[2px_2px_0px_#000] font-bold"
                    : "border-transparent text-[#A1A1AA] hover:text-white hover:bg-[#141414] hover:border-[#2a2a2a]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-black" : "text-[#71717A]"}`} />
                  <span>{item.name.toUpperCase()}</span>
                </div>
                {isActive && <span className="text-[10px] text-black font-bold">▶</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t-2 border-[#242424] space-y-2 bg-[#111111]">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-1.5 text-xs font-pixel text-[#A1A1AA] hover:text-white bg-[#141414] border border-[#2a2a2a] shadow-[1px_1px_0px_#000]"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3 h-3 text-[#D7FF3F]" />
              <span>PUBLIC STREAM</span>
            </span>
            <span className="text-[9px] text-[#D7FF3F]">[ LIVE ]</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-pixel text-red-400 hover:text-red-300 bg-[#141414] border border-[#2a2a2a] shadow-[1px_1px_0px_#000] active:translate-y-0.5 text-left"
          >
            <LogOut className="w-3 h-3" />
            <span>[ EJECT / LOGOUT ]</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 bg-[#0e0e0e] border-b-2 border-[#242424] px-6 flex items-center justify-between shrink-0 shadow-[0_2px_0px_#000]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 border border-[#2e2e2e] bg-[#141414] text-[#A1A1AA] hover:text-white"
            >
              {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 text-xs font-pixel">
              <span className="text-[#71717A]">CONTROL ROOM</span>
              <span className="text-[#D7FF3F]">/</span>
              <span className="text-white uppercase">
                {pathname.replace("/admin/", "").replace("/admin", "Overview") || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#141414] border border-[#242424] shadow-[1px_1px_0px_#000]">
              <div className="w-2 h-2 bg-[#D7FF3F] animate-pulse" />
              <span className="text-[10px] font-pixel text-[#A1A1AA]">
                NODE // ONLINE
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-pixel bg-[#141414] border border-[#242424] px-2 py-1 shadow-[1px_1px_0px_#000]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={user?.name || "Admin"}
                className="w-5 h-5 border border-black object-cover"
              />
              <span className="text-white hidden sm:inline text-[11px]">
                {user?.name?.toUpperCase() || "ADMIN"}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Modal */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
            <div className="w-64 bg-[#0e0e0e] h-full flex flex-col p-4 border-r-2 border-[#242424]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#242424] mb-3">
                <span className="font-pixel text-xs text-white">AURALIS // CMS</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 border border-[#2e2e2e] bg-[#141414] text-[#71717A] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-pixel text-[#A1A1AA] hover:text-white hover:bg-[#141414]"
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.name.toUpperCase()}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Scrollable Main Admin Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
