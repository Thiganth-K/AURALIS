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
      className="group flex flex-col items-center text-center p-3 bg-[#111111] hover:bg-[#181818] border-2 border-[#262626] hover:border-[#D7FF3F] shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 select-none"
    >
      {/* Circular Artist Image with stepped pixel framing */}
      <div className="relative w-28 h-28 p-1 mb-3 bg-[#181818] border-2 border-[#262626] group-hover:border-[#D7FF3F] shadow-[2px_2px_0px_#000] transition-colors duration-150">
        <div className="w-full h-full rounded-full overflow-hidden border border-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>
      </div>

      <h4 className="text-sm font-pixel text-white group-hover:text-[#D7FF3F] transition-colors truncate w-full px-1">
        {artist.name}
      </h4>
      <div className="mt-1 flex items-center justify-center gap-1.5 w-full">
        <span className="text-[10px] font-pixel text-[#D7FF3F] bg-[#181818] border border-[#2e2e2e] px-1 py-0.5 truncate max-w-[80px]">
          {artist.genres[0] || "ARTIST"}
        </span>
        <span className="text-[10px] font-pixel text-[#71717A]">
          {artist.followersFormatted}
        </span>
      </div>
    </Link>
  );
}
