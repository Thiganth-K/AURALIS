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
      className="group relative flex flex-col p-3 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/5 hover:border-white/10 transition-all duration-200 select-none"
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#222222] mb-3 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playlist.artworkUrl}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {playlist.isCurated && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#D7FF3F] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D7FF3F]" />
            <span>Curated</span>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h4 className="text-sm font-semibold text-white group-hover:text-[#D7FF3F] transition-colors truncate">
          {playlist.name}
        </h4>
        <p className="text-xs text-[#71717A] line-clamp-2 mt-1 leading-relaxed">
          {playlist.description}
        </p>
      </div>
    </Link>
  );
}
