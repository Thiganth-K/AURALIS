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
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-[#111111]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-[#D7FF3F]" />
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
            Playback Queue
          </h3>
          <span className="text-xs font-mono text-[#71717A] bg-[#181818] px-2 py-0.5 rounded-full">
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="p-1.5 text-xs text-[#71717A] hover:text-red-400 transition-colors flex items-center gap-1"
              title="Clear upcoming queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
          <button
            onClick={() => setQueueOpen(false)}
            className="p-1 rounded-lg text-[#71717A] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close queue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
        {/* Now Playing */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-2 px-1">
            Now Playing
          </h4>
          {currentSong ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181818] border border-[#D7FF3F]/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSong.artworkUrl}
                alt={currentSong.title}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#D7FF3F] truncate">
                  {currentSong.title}
                </p>
                <p className="text-xs text-[#A1A1AA] truncate">
                  {currentSong.artistName}
                </p>
              </div>
              <span className="text-xs font-mono text-[#71717A]">
                {currentSong.durationFormatted}
              </span>
            </div>
          ) : (
            <p className="text-xs text-[#71717A] italic px-1">No track active</p>
          )}
        </div>

        {/* Up Next List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
              Up Next
            </h4>
            <span className="text-[10px] text-[#71717A]">
              {upNext.length} tracks
            </span>
          </div>

          {upNext.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-[#141414] border border-white/5 text-[#71717A] text-xs">
              No upcoming songs in queue. Play an album or add songs.
            </div>
          ) : (
            <div className="space-y-1">
              {upNext.map((song, i) => (
                <div
                  key={`${song.id}-${i}`}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#181818] transition-colors"
                >
                  <div
                    onClick={() => playSong(song)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.artworkUrl}
                      alt={song.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate group-hover:text-[#D7FF3F] transition-colors">
                        {song.title}
                      </p>
                      <p className="text-[11px] text-[#71717A] truncate">
                        {song.artistName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playSong(song)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#71717A] hover:text-[#D7FF3F] transition-all"
                      title="Play track"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(song.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#71717A] hover:text-red-400 transition-all"
                      title="Remove from queue"
                    >
                      <X className="w-3.5 h-3.5" />
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
