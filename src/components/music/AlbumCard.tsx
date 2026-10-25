"use client";

import React from "react";
import Link from "next/link";
import { Album } from "@/types";
import { Disc3 } from "lucide-react";

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link
      href={`/album/${album.id}`}
      className="group relative flex flex-col p-3 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/5 hover:border-white/10 transition-all duration-200 select-none"
    >
      {/* Vinyl sleeve depth effect */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#222222] mb-3 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.artworkUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Minimal Vinyl badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#A1A1AA] flex items-center gap-1">
          <Disc3 className="w-3 h-3 text-[#D7FF3F]" />
          <span>{album.releaseYear}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <h4 className="text-sm font-semibold text-white group-hover:text-[#D7FF3F] transition-colors truncate">
          {album.title}
        </h4>
        <p className="text-xs text-[#A1A1AA] truncate mt-0.5">
          {album.artistName} • {album.songCount} tracks
        </p>
      </div>
    </Link>
  );
}
