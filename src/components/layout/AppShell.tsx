"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalPlayer } from "@/components/player/GlobalPlayer";
import { MobilePlayer } from "@/components/player/MobilePlayer";
import { ExpandedPlayer } from "@/components/player/ExpandedPlayer";
import { QueueDrawer } from "@/components/player/QueueDrawer";
import { PlayerProvider } from "@/context/PlayerContext";
import { AuthProvider } from "@/context/AuthContext";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isDedicatedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/song/") ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <AuthProvider>
      <PlayerProvider>
        {isDedicatedRoute ? (
          <div className="min-h-screen w-screen overflow-x-hidden bg-[#FAF7EE] text-[#111111]">
            {children}
          </div>
        ) : (
          <div className="flex h-screen w-screen overflow-hidden bg-[#FAF7EE] text-[#111111] font-mono">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Column */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
              <TopBar />

              {/* Main Scrollable Content */}
              <main className="flex-1 overflow-y-auto pb-32 md:pb-28">
                {children}
              </main>

              {/* Playback Queue Drawer */}
              <QueueDrawer />

              {/* Desktop Persistent Player */}
              <div className="hidden md:block">
                <GlobalPlayer />
              </div>

              {/* Mobile Player (Mini docked bar) */}
              <MobilePlayer />

              {/* Fullscreen Expanded Cyber Player */}
              <ExpandedPlayer />

              {/* Mobile Bottom Dock */}
              <MobileNav />
            </div>
          </div>
        )}
      </PlayerProvider>
    </AuthProvider>
  );
}
