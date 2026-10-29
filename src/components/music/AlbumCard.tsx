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
      className="group relative flex flex-col p-3 transition-all select-none font-mono"
      style={{
        backgroundColor: "#FAF7EE",
        border: "2px solid #111111",
        boxShadow: "3px 3px 0px #111111",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-1.5px,-1.5px)";
        e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
        e.currentTarget.style.backgroundColor = "#F6EEDE";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
        e.currentTarget.style.backgroundColor = "#FAF7EE";
      }}
    >
      {/* Corner crop ticks */}
      <span className="absolute top-1 left-1.5 text-[10px] font-mono leading-none select-none text-[#F05A28]">
        ┌
      </span>
      <span className="absolute bottom-1 right-1.5 text-[10px] font-mono leading-none select-none text-[#F05A28]">
        ┘
      </span>

      {/* Vinyl record sleeve depth frame */}
      <div
        className="relative aspect-square w-full overflow-hidden mb-2.5"
        style={{ border: "1.5px solid #111111", backgroundColor: "#F6EEDE" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.artworkUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Retro release badge */}
        <div
          className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase flex items-center gap-1"
          style={{
            backgroundColor: "#FAF7EE",
            border: "1px solid #111111",
            color: "#111111",
          }}
        >
          <Disc3 className="w-2.5 h-2.5 text-[#F05A28]" />
          <span>{album.releaseYear}</span>
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <h4 className="text-xs font-bold uppercase text-[#111111] group-hover:text-[#F05A28] transition-colors truncate">
          {album.title}
        </h4>
        <p className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
          {album.artistName} • <span className="font-bold text-[#F05A28]">{album.songCount} TRK</span>
        </p>
      </div>
    </Link>
  );
}
