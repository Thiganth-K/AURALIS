"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { X, Play, Trash2, ListMusic } from "lucide-react";

export function QueueDrawer() {
  const {
    isQueueOpen,
    setQueueOpen,
    queue,
    queueIndex,
    currentSong,
    playSong,
    removeFromQueue,
    clearQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  const upNext = queue.slice(queueIndex + 1);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-[#0c0c0c] border-l-2 border-[#262626] shadow-[-4px_0px_0px_#000] flex flex-col animate-in slide-in-from-right duration-150">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b-2 border-[#222] bg-[#111111]">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-[#D7FF3F]" />
          <h3 className="text-xs font-pixel text-white tracking-wider">
            AURALIS // PLAY QUEUE
          </h3>
          <span className="text-[10px] font-pixel text-[#D7FF3F] bg-[#181818] border border-[#2e2e2e] px-1.5 py-0.5 shadow-[1px_1px_0px_#000]">
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="px-1.5 py-0.5 border border-[#2e2e2e] bg-[#141414] text-[10px] font-pixel text-[#71717A] hover:text-red-400 hover:border-red-500/50 transition-colors flex items-center gap-1 shadow-[1px_1px_0px_#000]"
              title="Clear upcoming queue"
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          )}
          <button
            onClick={() => setQueueOpen(false)}
            className="p-1 border border-[#2e2e2e] bg-[#141414] text-[#71717A] hover:text-white shadow-[1px_1px_0px_#000]"
            aria-label="Close queue"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
        {/* Now Playing */}
        <div>
          <h4 className="text-[10px] font-pixel text-[#D7FF3F] mb-2 px-1 flex items-center gap-1.5">
            <span>{"// NOW PLAYING"}</span>
          </h4>
          {currentSong ? (
            <div className="flex items-center gap-3 p-2.5 bg-[#141414] border-2 border-[#D7FF3F] shadow-[2px_2px_0px_#000]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSong.artworkUrl}
                alt={currentSong.title}
                className="w-10 h-10 border border-black object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-pixel text-[#D7FF3F] truncate">
                  {currentSong.title}
                </p>
                <p className="text-[11px] font-sans text-[#A1A1AA] truncate">
                  {currentSong.artistName}
                </p>
              </div>
              <span className="text-[10px] font-pixel text-[#71717A]">
                {currentSong.durationFormatted}
              </span>
            </div>
          ) : (
            <p className="text-xs text-[#71717A] font-pixel italic px-1">NO TRACK ACTIVE</p>
          )}
        </div>

        {/* Up Next List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-[10px] font-pixel text-[#A1A1AA]">
              {"// UP NEXT"}
            </h4>
            <span className="text-[9px] font-pixel text-[#71717A]">
              {upNext.length} TRACKS
            </span>
          </div>

          {upNext.length === 0 ? (
            <div className="p-5 text-center bg-[#111111] border-2 border-[#222] text-[#71717A] text-xs font-pixel">
              QUEUE EMPTY. INSERT CASSETTES OR DISCS.
            </div>
          ) : (
            <div className="space-y-1">
              {upNext.map((song, i) => (
                <div
                  key={`${song.id}-${i}`}
                  className="group flex items-center justify-between p-2 bg-[#111111] hover:bg-[#181818] border border-[#222] hover:border-[#D7FF3F] transition-colors"
                >
                  <div
                    onClick={() => playSong(song)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="text-[9px] font-pixel text-[#71717A] w-4 text-center">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.artworkUrl}
                      alt={song.title}
                      className="w-7 h-7 border border-black object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-pixel text-white truncate group-hover:text-[#D7FF3F] transition-colors">
                        {song.title}
                      </p>
                      <p className="text-[11px] font-sans text-[#71717A] truncate">
                        {song.artistName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playSong(song)}
                      className="opacity-0 group-hover:opacity-100 p-1 border border-[#2a2a2a] bg-[#161616] text-[#D7FF3F] shadow-[1px_1px_0px_#000]"
                      title="Play track"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(song.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 border border-[#2a2a2a] bg-[#161616] text-[#71717A] hover:text-red-400 shadow-[1px_1px_0px_#000]"
                      title="Remove from queue"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
