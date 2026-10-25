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

interface AdminLayoutProps {
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?redirect=" + encodeURIComponent(pathname));
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, isAdmin, isLoading, router, pathname]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="h-screen w-screen bg-[#090909] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#D7FF3F] animate-spin" />
        <span className="text-xs font-mono text-[#A1A1AA] tracking-wider uppercase">
          Verifying Admin Authorization...
        </span>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090909] text-white font-sans">
      {/* Admin Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0e0e0e] border-r border-white/5 select-none shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D7FF3F] flex items-center justify-center text-black font-black text-sm">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wider text-white">
                AURALIS
              </span>
              <span className="text-[10px] font-mono text-[#D7FF3F] ml-1.5 px-1.5 py-0.5 rounded bg-[#D7FF3F]/10 uppercase font-semibold">
                CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#71717A]">
            Catalog & System
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#D7FF3F] text-black font-semibold shadow-md shadow-[#D7FF3F]/10"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-black" : "text-[#71717A]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors border border-white/5"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Public Stream</span>
            </span>
            <span className="text-[10px] text-[#71717A] font-mono">Live</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 bg-[#0e0e0e]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-[#A1A1AA] hover:text-white"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#71717A]">Control Center</span>
              <span className="text-[#71717A]">/</span>
              <span className="font-semibold text-white capitalize">
                {pathname.replace("/admin/", "").replace("/admin", "Overview") || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#141414] border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-[#A1A1AA]">
                Live Cluster
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-white/10"
              />
              <span className="font-medium text-white hidden sm:inline">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Modal */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
            <div className="w-64 bg-[#0e0e0e] h-full flex flex-col p-4 border-r border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <span className="font-bold text-sm text-white">AURALIS CMS</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded text-[#71717A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
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
