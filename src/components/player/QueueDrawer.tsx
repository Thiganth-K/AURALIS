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
    <div
      className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 flex flex-col font-mono select-none animate-in slide-in-from-right duration-150"
      style={{
        backgroundColor: "#FAF7EE",
        borderLeft: "2px solid #111111",
        boxShadow: "-4px 0px 0px #111111",
      }}
    >
      {/* Drawer Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{
          borderBottom: "2px solid #111111",
          backgroundColor: "#F6EEDE",
        }}
      >
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4" style={{ color: "#F05A28" }} />
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
            AURALIS // PLAY QUEUE
          </h3>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5"
            style={{
              backgroundColor: "#FFF0ED",
              color: "#F05A28",
              border: "1px solid #F05A28",
            }}
          >
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="px-2 py-0.5 text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                boxShadow: "1px 1px 0px #111111",
                color: "#D62828",
              }}
              title="Clear upcoming queue"
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          )}
          <button
            onClick={() => setQueueOpen(false)}
            className="p-1 cursor-pointer transition-colors"
            style={{
              backgroundColor: "#FAF7EE",
              border: "1.5px solid #111111",
              boxShadow: "1px 1px 0px #111111",
              color: "#111111",
            }}
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
          <h4
            className="text-[10px] font-bold uppercase mb-2 px-1 flex items-center gap-1.5"
            style={{ color: "#F05A28" }}
          >
            <span>{"// NOW PLAYING"}</span>
          </h4>
          {currentSong ? (
            <div
              className="flex items-center gap-3 p-2.5 transition-all"
              style={{
                backgroundColor: "#F6EEDE",
                border: "2px solid #111111",
                boxShadow: "2.5px 2.5px 0px #111111",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSong.artworkUrl}
                alt={currentSong.title}
                className="w-10 h-10 object-cover shrink-0"
                style={{ border: "1.5px solid #111111" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#111111] uppercase truncate">
                  {currentSong.title}
                </p>
                <p className="text-[11px] font-mono text-[#7A7166] truncate mt-0.5">
                  {currentSong.artistName}
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#7A7166] font-bold">
                {currentSong.durationFormatted}
              </span>
            </div>
          ) : (
            <p className="text-xs text-[#7A7166] italic px-1">NO TRACK ACTIVE</p>
          )}
        </div>

        {/* Up Next List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A7166]">
              {"// UP NEXT"}
            </h4>
            <span className="text-[9px] font-mono font-bold text-[#7A7166]">
              {upNext.length} TRACKS
            </span>
          </div>

          {upNext.length === 0 ? (
            <div
              className="p-5 text-center text-[#7A7166] text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "#F6EEDE",
                border: "1.5px solid #111111",
              }}
            >
              QUEUE EMPTY. SELECT TRACKS OR CASSETTES.
            </div>
          ) : (
            <div className="space-y-1.5">
              {upNext.map((song, i) => (
                <div
                  key={`${song.id}-${i}`}
                  className="group flex items-center justify-between p-2 transition-all cursor-pointer"
                  style={{
                    backgroundColor: "#FAF7EE",
                    border: "1.5px solid #111111",
                    boxShadow: "1.5px 1.5px 0px #111111",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F6EEDE";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FAF7EE";
                  }}
                >
                  <div
                    onClick={() => playSong(song)}
                    className="flex items-center gap-2.5 min-w-0 flex-1"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#7A7166] w-4 text-center">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.artworkUrl}
                      alt={song.title}
                      className="w-7 h-7 object-cover shrink-0"
                      style={{ border: "1px solid #111111" }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#111111] uppercase truncate group-hover:text-[#F05A28] transition-colors">
                        {song.title}
                      </p>
                      <p className="text-[10px] font-mono text-[#7A7166] truncate">
                        {song.artistName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => playSong(song)}
                      className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer transition-all"
                      style={{
                        backgroundColor: "#F05A28",
                        color: "#111111",
                        border: "1px solid #111111",
                      }}
                      title="Play track"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromQueue(song.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer transition-all"
                      style={{
                        backgroundColor: "#FAF7EE",
                        color: "#D62828",
                        border: "1px solid #D62828",
                      }}
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
