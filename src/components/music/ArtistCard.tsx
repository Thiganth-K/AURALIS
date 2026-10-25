"use client";

import React from "react";
import Link from "next/link";
import { Artist } from "@/types";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group flex flex-col items-center text-center p-3 rounded-lg bg-[#0c0628] border border-[#ff9e00] shadow-[0_0_12px_rgba(255,158,0,0.2)] hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all select-none"
    >
      {/* Circular Artist Image with cyber ring framing */}
      <div className="relative w-28 h-28 p-1 mb-3 rounded-full bg-[#180e38] border-2 border-[#ff9e00] group-hover:border-[#00f0ff] shadow-[0_0_10px_rgba(255,158,0,0.3)] transition-colors duration-150">
        <div className="w-full h-full rounded-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>
      </div>

      <h4 className="text-sm font-pixel text-white group-hover:text-[#00f0ff] transition-colors truncate w-full px-1">
        {artist.name}
      </h4>
      <div className="mt-1 flex items-center justify-center gap-1.5 w-full">
        <span className="text-[10px] font-pixel text-[#ffbe0b] bg-[#1a0e03] border border-[#ff9e00]/50 rounded px-1.5 py-0.5 truncate max-w-[80px]">
          {artist.genres[0] || "ARTIST"}
        </span>
        <span className="text-[10px] font-pixel text-[#a79cd0]">
          {artist.followersFormatted}
        </span>
      </div>
    </Link>
  );
}
