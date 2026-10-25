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
      className="group relative flex flex-col p-3 rounded-lg bg-[#0c0628] border border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.2)] hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all select-none"
    >
      {/* Vinyl record sleeve depth frame */}
      <div className="relative aspect-square w-full rounded overflow-hidden bg-[#180e38] mb-3 border border-[#8b5cf6]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.artworkUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Retro release badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#09041a]/90 border border-[#8b5cf6] text-[9px] font-pixel text-[#00f0ff] flex items-center gap-1 shadow-[0_0_8px_rgba(139,92,246,0.4)]">
          <Disc3 className="w-2.5 h-2.5 text-[#ff2a85]" />
          <span>{album.releaseYear}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <h4 className="text-sm font-pixel text-white group-hover:text-[#00f0ff] transition-colors truncate">
          {album.title}
        </h4>
        <p className="text-xs text-[#a79cd0] font-sans truncate mt-1">
          {album.artistName} • <span className="font-pixel text-[10px] text-[#ffbe0b]">{album.songCount} TRK</span>
        </p>
      </div>
    </Link>
  );
}
