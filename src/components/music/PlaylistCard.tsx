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
      className="group relative flex flex-col p-3 bg-[#111111] hover:bg-[#181818] border-2 border-[#262626] hover:border-[#D7FF3F] shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 select-none"
    >
      {/* Cassette Header Bar */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#262626] text-[9px] font-pixel text-[#71717A]">
        <span>AURALIS TAPE</span>
        <span className="text-[#D7FF3F]">#CASSETTE</span>
      </div>

      {/* Artwork Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#181818] mb-2.5 border-2 border-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playlist.artworkUrl}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Cassette Spool Indicator effect */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 bg-black/70 border border-[#333333] shadow-[1px_1px_0px_#000] pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full border border-[#D7FF3F] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#D7FF3F]" />
          </div>
          <div className="h-[2px] flex-1 mx-2 bg-[#444444]" />
          <div className="w-2.5 h-2.5 rounded-full border border-[#D7FF3F] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#D7FF3F]" />
          </div>
        </div>

        {playlist.isCurated && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 border border-[#333333] text-[9px] font-pixel text-[#D7FF3F] flex items-center gap-1 shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-2.5 h-2.5 text-[#D7FF3F]" />
            <span>CURATED</span>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h4 className="text-sm font-pixel text-white group-hover:text-[#D7FF3F] transition-colors truncate">
          {playlist.name}
        </h4>
        <p className="text-xs text-[#71717A] font-sans line-clamp-1 mt-1 leading-relaxed">
          {playlist.description}
        </p>
      </div>
    </Link>
  );
}
