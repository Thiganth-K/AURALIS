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
      className="group flex flex-col items-center text-center p-3 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/5 hover:border-white/10 transition-all duration-200 select-none"
    >
      {/* Circular Artist Image with glowing border on hover */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#222222] mb-3 shadow-lg border border-white/10 group-hover:border-[#D7FF3F]/50 transition-colors duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <h4 className="text-sm font-semibold text-white group-hover:text-[#D7FF3F] transition-colors truncate w-full px-2">
        {artist.name}
      </h4>
      <p className="text-xs text-[#71717A] truncate w-full mt-0.5">
        {artist.genres[0] || "Artist"} • {artist.followersFormatted} fans
      </p>
    </Link>
  );
}
