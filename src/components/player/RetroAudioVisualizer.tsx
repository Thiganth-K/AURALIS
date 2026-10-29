"use client";

import React, { useEffect, useState } from "react";

interface RetroAudioVisualizerProps {
  isPlaying: boolean;
  side: "left" | "right";
  barsCount?: number;
}

export function RetroAudioVisualizer({
  isPlaying,
  side,
  barsCount = 20,
}: RetroAudioVisualizerProps) {
  // Generate initial heights for the spectrum bars
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: barsCount }, (_, i) => {
      const distFromCenter = side === "left" ? i / barsCount : 1 - i / barsCount;
      return Math.floor(25 + Math.sin(distFromCenter * Math.PI) * 55 + Math.random() * 15);
    })
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setHeights(() =>
        Array.from({ length: barsCount }, (_, i) => {
          const factor = side === "left" ? (i + 1) / barsCount : (barsCount - i) / barsCount;
          const base = 20 + Math.sin(factor * Math.PI) * 50;
          const fluctuation = Math.random() * 30;
          return Math.min(95, Math.max(15, Math.floor(base + fluctuation)));
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, side, barsCount]);

  // Color generator based on height/tier (Brutalist Audio VU meter: Ink Black -> Deep Orange -> International Orange -> Peak Red-Orange)
  const getBlockColor = (blockIndex: number, totalBlocks: number) => {
    const ratio = blockIndex / totalBlocks;
    if (ratio < 0.35) return "#111111"; // Ink black
    if (ratio < 0.65) return "#C44118"; // Deep warm orange
    if (ratio < 0.85) return "#F05A28"; // International orange
    return "#D62828"; // Peak red-orange
  };

  const maxBlocks = 16;

  return (
    <div
      className={`flex items-center gap-1 sm:gap-1.5 h-64 select-none pointer-events-none ${
        side === "left" ? "justify-end" : "justify-start"
      }`}
    >
      {heights.map((heightPercent, colIdx) => {
        const activeBlocksCount = Math.max(
          2,
          Math.round((heightPercent / 100) * maxBlocks)
        );

        return (
          <div
            key={colIdx}
            className="flex flex-col-reverse justify-start gap-[2.5px] w-2 sm:w-2.5 h-48 sm:h-56 transition-all duration-100"
          >
            {Array.from({ length: maxBlocks }).map((_, blockIdx) => {
              const isActive = blockIdx < activeBlocksCount;
              const color = getBlockColor(blockIdx, maxBlocks);

              return (
                <div
                  key={blockIdx}
                  className="w-full h-2 rounded-[1px] transition-all"
                  style={{
                    backgroundColor: isActive ? color : "#EAE3D2",
                    boxShadow: isActive ? "0 0 1px rgba(17,17,17,0.4)" : "none",
                    opacity: isActive ? 1 : 0.4,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
