"use client";

import React from "react";

export function SynthwaveHeroIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden pointer-events-none select-none flex items-center justify-end ${className}`}>
      <svg
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[280px] object-contain"
      >
        <defs>
          {/* Synthwave Sun Gradient */}
          <linearGradient id="synthSun" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff2a85" />
            <stop offset="60%" stopColor="#ff007f" />
            <stop offset="100%" stopColor="#ffbe0b" />
          </linearGradient>

          {/* Microphone Chrome Glow */}
          <linearGradient id="micChrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="35%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#ff2a85" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Radial Ambient Glow */}
          <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff2a85" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#5c32c4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#04020c" stopOpacity="0" />
          </radialGradient>

          {/* Equalizer Bar Glow */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background bloom */}
        <circle cx="340" cy="140" r="140" fill="url(#ambientGlow)" />

        {/* Retro Striped Synthwave Sun */}
        <g filter="url(#neonGlow)">
          <path d="M 280 140 A 60 60 0 0 1 400 140 Z" fill="url(#synthSun)" />
          <rect x="278" y="143" width="124" height="6" fill="url(#synthSun)" />
          <rect x="281" y="152" width="118" height="5" fill="url(#synthSun)" />
          <rect x="286" y="160" width="108" height="4" fill="url(#synthSun)" />
          <rect x="294" y="167" width="92" height="3" fill="url(#synthSun)" />
          <rect x="306" y="173" width="68" height="2" fill="url(#synthSun)" />
        </g>

        {/* Distant City Skyline Silhouette */}
        <g opacity="0.45">
          <rect x="200" y="155" width="22" height="60" fill="#180e38" />
          <rect x="225" y="140" width="18" height="75" fill="#130b2c" />
          <rect x="245" y="165" width="25" height="50" fill="#1d0a3d" />
          <rect x="272" y="150" width="16" height="65" fill="#160830" />
          <rect x="390" y="145" width="20" height="70" fill="#140b2e" />
          <rect x="412" y="160" width="24" height="55" fill="#180e38" />
          <rect x="438" y="135" width="22" height="80" fill="#100826" />
          <rect x="462" y="155" width="26" height="60" fill="#160c35" />

          {/* Tiny city window specks */}
          <circle cx="232" cy="150" r="1" fill="#00f0ff" opacity="0.7" />
          <circle cx="232" cy="160" r="1" fill="#ff2a85" opacity="0.7" />
          <circle cx="237" cy="155" r="1" fill="#d7ff3f" opacity="0.7" />
          <circle cx="445" cy="148" r="1" fill="#00f0ff" opacity="0.8" />
          <circle cx="452" cy="158" r="1" fill="#ffbe0b" opacity="0.8" />
        </g>

        {/* Ground Neon Grid Lines */}
        <line x1="160" y1="215" x2="490" y2="215" stroke="#5c32c4" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="180" y1="225" x2="480" y2="225" stroke="#ff2a85" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="200" y1="238" x2="470" y2="238" stroke="#00f0ff" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Audio Visualizer Neon Equalizer Bars at Base */}
        <g filter="url(#neonGlow)">
          <rect x="210" y="185" width="4" height="30" fill="#00f0ff" rx="1" />
          <rect x="218" y="170" width="4" height="45" fill="#00f0ff" rx="1" />
          <rect x="226" y="155" width="4" height="60" fill="#00ff88" rx="1" />
          <rect x="234" y="175" width="4" height="40" fill="#00ff88" rx="1" />
          <rect x="242" y="165" width="4" height="50" fill="#d7ff3f" rx="1" />
          <rect x="250" y="180" width="4" height="35" fill="#d7ff3f" rx="1" />
        </g>

        {/* Prominent Vintage Studio Microphone */}
        <g filter="url(#neonGlow)">
          {/* Microphone Outer Swivel U-Bracket */}
          <path
            d="M 322 135 C 322 185 410 185 410 135"
            stroke="#ff2a85"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Mount Knobs */}
          <circle cx="322" cy="135" r="4" fill="#00f0ff" />
          <circle cx="410" cy="135" r="4" fill="#ff2a85" />

          {/* Mic Stand Stem */}
          <rect x="362" y="185" width="8" height="45" fill="#5c32c4" />
          <rect x="352" y="226" width="28" height="7" rx="2" fill="#ff2a85" />

          {/* Microphone Capsule Body (Classic Ribbed Ellipse / Cylinder) */}
          <rect
            x="334"
            y="65"
            width="64"
            height="95"
            rx="32"
            fill="#09041a"
            stroke="url(#micChrome)"
            strokeWidth="3.5"
          />

          {/* Horizontal Acoustic Grille Ribs */}
          <line x1="337" y1="80" x2="395" y2="80" stroke="#00f0ff" strokeWidth="2.5" />
          <line x1="335" y1="92" x2="397" y2="92" stroke="#ff2a85" strokeWidth="2.5" />
          <line x1="334" y1="104" x2="398" y2="104" stroke="#00f0ff" strokeWidth="2.5" />
          <line x1="334" y1="116" x2="398" y2="116" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="335" y1="128" x2="397" y2="128" stroke="#ff2a85" strokeWidth="2.5" />
          <line x1="337" y1="140" x2="395" y2="140" stroke="#00f0ff" strokeWidth="2.5" />

          {/* Vertical Center Rib */}
          <line x1="366" y1="65" x2="366" y2="160" stroke="#ffbe0b" strokeWidth="2" strokeOpacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
