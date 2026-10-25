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
      className="group relative flex flex-col p-3 bg-[#111111] hover:bg-[#181818] border-2 border-[#262626] hover:border-[#D7FF3F] shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 select-none"
    >
      {/* Vinyl record sleeve depth frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#181818] mb-3 border-2 border-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.artworkUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Vinyl groove edge detail */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />

        {/* Retro release badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 border border-[#333333] text-[9px] font-pixel tracking-wider text-[#A1A1AA] flex items-center gap-1 shadow-[2px_2px_0px_#000]">
          <Disc3 className="w-2.5 h-2.5 text-[#D7FF3F]" />
          <span>{album.releaseYear}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <h4 className="text-sm font-pixel text-white group-hover:text-[#D7FF3F] transition-colors truncate">
          {album.title}
        </h4>
        <p className="text-xs text-[#A1A1AA] font-sans truncate mt-1">
          {album.artistName} • <span className="font-pixel text-[10px] text-[#71717A]">{album.songCount} TRK</span>
        </p>
      </div>
    </Link>
  );
}
