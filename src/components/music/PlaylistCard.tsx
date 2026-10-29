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
  const labelName = (playlist.name || "AURALIS TAPE").toUpperCase().slice(0, 18);
  const clipId = `label-clip-${playlist.id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

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

      {/* ── ACTUAL PIXEL CASSETTE TAPE ARTWORK WITH EMBEDDED ALBUM ART ── */}
      <div
        className="relative aspect-square w-full overflow-hidden mb-2.5 flex items-center justify-center p-1"
        style={{
          border: "1.5px solid #111111",
          backgroundColor: "#F2EADB",
        }}
      >
        <svg
          viewBox="5 11 90 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[2px_2px_0px_#111111] transition-transform duration-300 group-hover:scale-[1.02]"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="11" y="18" width="78" height="37" rx="1" />
            </clipPath>
          </defs>

          {/* ── Cassette Tape Main Shell ── */}
          <rect
            x="6"
            y="12"
            width="88"
            height="60"
            rx="3"
            fill="#242321"
            stroke="#111111"
            strokeWidth="2.5"
          />
          {/* Top edge bevel highlight */}
          <rect x="9" y="14" width="82" height="2" fill="#52504B" />

          {/* 4 Corner Screws */}
          <rect x="9" y="15" width="3" height="3" fill="#7A7166" />
          <rect x="88" y="15" width="3" height="3" fill="#7A7166" />
          <rect x="9" y="66" width="3" height="3" fill="#7A7166" />
          <rect x="88" y="66" width="3" height="3" fill="#7A7166" />

          {/* ── Cassette Inner First Box / Label Area (Cream #FAF7EE Base) ── */}
          <rect
            x="11"
            y="18"
            width="78"
            height="37"
            fill="#FAF7EE"
            stroke="#111111"
            strokeWidth="1.8"
          />

          {/* Image Filling the Cassette Inner Box! */}
          {playlist.artworkUrl && (
            <g clipPath={`url(#${clipId})`}>
              <image
                href={playlist.artworkUrl}
                x="11"
                y="18"
                width="78"
                height="37"
                preserveAspectRatio="xMidYMid slice"
                opacity="0.96"
              />
              {/* Subtle analog warm tint */}
              <rect
                x="11"
                y="18"
                width="78"
                height="37"
                fill="#FAF7EE"
                opacity="0.1"
              />
            </g>
          )}

          {/* Label Header Stripe in Signal Orange #F05A28 */}
          <rect x="11" y="18" width="78" height="8" fill="#F05A28" />

          {/* Side A Indicator Badge */}
          <rect x="13.5" y="19.5" width="5.5" height="5" fill="#FAF7EE" />
          <rect x="14.3" y="20.2" width="3.9" height="3.6" fill="#111111" />
          <text
            x="16.2"
            y="23.2"
            fontSize="3.2"
            fontWeight="900"
            fontFamily="monospace"
            textAnchor="middle"
            fill="#FAF7EE"
          >
            A
          </text>

          {/* Printed Playlist Name on Label */}
          <text
            x="21.5"
            y="23.5"
            fontSize="3.4"
            fontWeight="bold"
            fontFamily="monospace"
            fill="#FAF7EE"
            letterSpacing="0.04em"
          >
            {labelName}
          </text>

          {/* Retro tape format text with dark contour outline for readability over image */}
          <text
            x="14"
            y="30"
            fontSize="2.9"
            fontWeight="bold"
            fontFamily="monospace"
            fill="#FAF7EE"
            stroke="#111111"
            strokeWidth="0.6"
            paintOrder="stroke"
          >
            TYPE-I // 90 MIN
          </text>
          <text
            x="86"
            y="30"
            fontSize="2.9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="end"
            fill="#F05A28"
            stroke="#111111"
            strokeWidth="0.6"
            paintOrder="stroke"
          >
            {playlist.songCount || 0} TRACKS
          </text>

          {/* ── Central Tape Window Cutout (Smoked glass reveals image through window!) ── */}
          <rect
            x="23"
            y="33"
            width="54"
            height="18"
            rx="1.5"
            fill="rgba(18, 18, 18, 0.58)"
            stroke="#111111"
            strokeWidth="1.8"
          />
          {/* Visible magnetic tape ribbon */}
          <rect
            x="34"
            y="40.5"
            width="32"
            height="3.5"
            fill="#783D1B"
            opacity="0.9"
          />

          {/* Left Spool Reel with Spinning Gear Teeth on Hover */}
          <g className="transition-transform duration-700 ease-in-out group-hover:rotate-180 origin-[35px_42px]">
            <circle
              cx="35"
              cy="42"
              r="6.5"
              fill="#FAF7EE"
              stroke="#111111"
              strokeWidth="1.5"
            />
            <rect x="33.5" y="38.5" width="3" height="7" fill="#111111" />
            <rect x="31.5" y="40.5" width="7" height="3" fill="#111111" />
            <circle cx="35" cy="42" r="2.2" fill="#F05A28" />
          </g>

          {/* Right Spool Reel with Spinning Gear Teeth on Hover */}
          <g className="transition-transform duration-700 ease-in-out group-hover:rotate-180 origin-[65px_42px]">
            <circle
              cx="65"
              cy="42"
              r="6.5"
              fill="#FAF7EE"
              stroke="#111111"
              strokeWidth="1.5"
            />
            <rect x="63.5" y="38.5" width="3" height="7" fill="#111111" />
            <rect x="61.5" y="40.5" width="7" height="3" fill="#111111" />
            <circle cx="65" cy="42" r="2.2" fill="#F05A28" />
          </g>

          {/* Center Tape Level Hash Marks */}
          <rect x="47" y="36" width="6" height="1.2" fill="#FFFFFF" opacity="0.8" />
          <rect x="49" y="39" width="2" height="1" fill="#FFFFFF" opacity="0.8" />
          <rect x="49" y="44" width="2" height="1" fill="#FFFFFF" opacity="0.8" />
          <rect x="47" y="47" width="6" height="1.2" fill="#FFFFFF" opacity="0.8" />

          {/* ── Bottom Magnetic Tape Bridge (Trapezoid) ── */}
          <polygon
            points="16,72 23,57 77,57 84,72"
            fill="#2C2B29"
            stroke="#111111"
            strokeWidth="2"
          />
          {/* Dual Guide Holes */}
          <circle cx="27" cy="65.5" r="3" fill="#111111" />
          <circle cx="73" cy="65.5" r="3" fill="#111111" />
          {/* Magnetic Playback Head Aperture */}
          <rect x="43" y="61" width="14" height="7" fill="#111111" />
          <rect x="46" y="62.5" width="8" height="4" fill="#F05A28" />
          {/* Pin Rollers */}
          <circle cx="35.5" cy="65" r="1.8" fill="#E8DCC8" />
          <circle cx="64.5" cy="65" r="1.8" fill="#E8DCC8" />

          {/* Left Shell Specular Highlight */}
          <rect
            x="7.5"
            y="15"
            width="1.8"
            height="50"
            fill="#FFFFFF"
            opacity="0.2"
          />
        </svg>

        {/* Tactical Curated Pill Badge */}
        {playlist.isCurated && (
          <div
            className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold uppercase flex items-center gap-1 shadow-[1px_1px_0px_#111111]"
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
