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
      className="group flex flex-col items-center text-center p-3 transition-all select-none font-mono relative"
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

      {/* Header bar matching AlbumCard / PlaylistCard format */}
      <div
        className="flex items-center justify-between pb-1.5 mb-2 w-full text-[9px] font-bold uppercase tracking-wider text-[#7A7166]"
        style={{ borderBottom: "1.5px solid rgba(17,17,17,0.15)" }}
      >
        <span>TRANSMITTER</span>
        <span style={{ color: "#F05A28" }}>#ARTIST</span>
      </div>

      {/* Artist Portrait Image - SAME SIZE (aspect-square w-full) as Albums & Tapes */}
      <div
        className="relative aspect-square w-full p-1 mb-2.5 rounded-full overflow-hidden flex items-center justify-center shrink-0"
        style={{
          border: "2px solid #111111",
          backgroundColor: "#F6EEDE",
          boxShadow: "2px 2px 0px #111111",
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
            loading="lazy"
          />
        </div>
      </div>

      <h4 className="text-xs font-bold uppercase text-[#111111] group-hover:text-[#F05A28] transition-colors truncate w-full px-1">
        {artist.name}
      </h4>
      <div className="mt-1 flex items-center justify-center gap-1.5 w-full">
        <span
          className="text-[9px] font-bold uppercase px-1.5 py-0.5 truncate max-w-[85px]"
          style={{
            backgroundColor: "#FFF0ED",
            color: "#F05A28",
            border: "1px solid #F05A28",
          }}
        >
          {artist.genres[0] || "ARTIST"}
        </span>
        <span className="text-[10px] text-[#7A7166] font-mono">
          {artist.followersFormatted}
        </span>
      </div>
    </Link>
  );
}
