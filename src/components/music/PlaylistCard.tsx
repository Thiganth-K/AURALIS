"use client";

import React from "react";
import Link from "next/link";
import { Playlist } from "@/types";
import { Sparkles } from "lucide-react";

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const targetParam = playlist.name || playlist.slug || playlist.id;

  return (
    <Link
      href={`/playlist/${encodeURIComponent(targetParam)}`}
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

      {/* Cassette Header Bar */}
      <div
        className="flex items-center justify-between pb-1.5 mb-2 text-[9px] font-bold uppercase tracking-wider text-[#7A7166]"
        style={{ borderBottom: "1.5px solid rgba(17,17,17,0.15)" }}
      >
        <span>AURALIS TAPE</span>
        <span style={{ color: "#F05A28" }}>#CASSETTE</span>
      </div>

      {/* Artwork Container */}
      <div
        className="relative aspect-square w-full overflow-hidden mb-2.5"
        style={{ border: "1.5px solid #111111", backgroundColor: "#F6EEDE" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playlist.artworkUrl}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Cassette Spool Indicator effect */}
        <div
          className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 pointer-events-none"
          style={{
            backgroundColor: "rgba(250,247,238,0.9)",
            border: "1px solid #111111",
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #111111" }}
          >
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#F05A28" }} />
          </div>
          <div className="h-[1.5px] flex-1 mx-2" style={{ backgroundColor: "#111111" }} />
          <div
            className="w-2.5 h-2.5 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #111111" }}
          >
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#F05A28" }} />
          </div>
        </div>

        {playlist.isCurated && (
          <div
            className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold uppercase flex items-center gap-1"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1px solid #111111",
              color: "#F05A28",
            }}
          >
            <Sparkles className="w-2.5 h-2.5 text-[#F05A28]" />
            <span>CURATED</span>
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <h4 className="text-xs font-bold uppercase text-[#111111] group-hover:text-[#F05A28] transition-colors truncate">
          {playlist.name}
        </h4>
        <p className="text-[11px] text-[#7A7166] font-mono truncate mt-0.5">
          {playlist.songCount} TRACKS
        </p>
      </div>
    </Link>
  );
}
