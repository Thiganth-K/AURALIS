"use client";

import React from "react";
import Link from "next/link";
import { Playlist } from "@/types";
import { Sparkles } from "lucide-react";

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className="group relative flex flex-col p-3 rounded-lg bg-[#0c0628] border border-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.2)] hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all select-none"
    >
      {/* Cassette Header Bar */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#2d1b69] text-[9px] font-pixel text-[#a79cd0]">
        <span>AURALIS TAPE</span>
        <span className="text-[#00f59b]">#CASSETTE</span>
      </div>

      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded overflow-hidden bg-[#180e38] mb-2.5 border border-[#00f59b]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playlist.artworkUrl}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Cassette Spool Indicator effect */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded bg-black/75 border border-[#2d1b69] pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full border border-[#00f59b] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#00f59b]" />
          </div>
          <div className="h-[2px] flex-1 mx-2 bg-[#4d2db7]" />
          <div className="w-2.5 h-2.5 rounded-full border border-[#00f59b] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#00f59b]" />
          </div>
        </div>

        {playlist.isCurated && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#09041a]/90 border border-[#00f59b] text-[9px] font-pixel text-[#00f59b] flex items-center gap-1 shadow-[0_0_8px_rgba(0,245,155,0.4)]">
            <Sparkles className="w-2.5 h-2.5 text-[#00f59b]" />
            <span>CURATED</span>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h4 className="text-sm font-pixel text-white group-hover:text-[#00f0ff] transition-colors truncate">
          {playlist.name}
        </h4>
        <p className="text-xs text-[#a79cd0] font-sans line-clamp-1 mt-1 leading-relaxed">
          {playlist.description}
        </p>
      </div>
    </Link>
  );
}
