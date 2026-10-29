"use client";

import React, { useState, useEffect } from "react";
import { Song } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { ListMusic, Plus, Check, X, Loader2, Sparkles, Disc3 } from "lucide-react";

interface PlaylistSummary {
  id: string;
  name: string;
  songCount: number;
}

interface AddToTapeModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToTapeModal({ song, isOpen, onClose }: AddToTapeModalProps) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Quick create tape state
  const [newTapeName, setNewTapeName] = useState("");
  const [creatingTape, setCreatingTape] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;
    setLoading(true);
    fetch("/api/library/playlists")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.playlists)) {
          setPlaylists(data.playlists);
        }
      })
      .catch((err) => console.error("Failed to fetch user playlists:", err))
      .finally(() => setLoading(false));
  }, [isOpen, user]);

  if (!isOpen || !song) return null;

  const handleAddSongToTape = async (playlistId: string, tapeName: string) => {
    try {
      setAddingToId(playlistId);
      const res = await fetch(`/api/library/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: song.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAddedIds((prev) => new Set(prev).add(playlistId));
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId ? { ...p, songCount: data.songCount || p.songCount + 1 } : p
          )
        );
        setFeedbackMsg(`✓ RECORDED TO "${tapeName.toUpperCase()}"`);
        setTimeout(() => setFeedbackMsg(null), 2500);
      } else {
        alert(data.error || "Failed to add song to tape");
      }
    } catch (err) {
      console.error("Add song to tape error:", err);
      alert("Error adding song to tape");
    } finally {
      setAddingToId(null);
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTapeName.trim() || creatingTape) return;
    try {
      setCreatingTape(true);
      const createRes = await fetch("/api/library/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTapeName.trim(),
          description: `Custom cassette tape recorded on Auralis`,
          songIds: [song.id],
        }),
      });
      const createData = await createRes.json();
      if (createRes.ok && createData.success) {
        const newPl: PlaylistSummary = {
          id: createData.playlist.id || createData.playlist._id,
          name: createData.playlist.name,
          songCount: 1,
        };
        setPlaylists((prev) => [newPl, ...prev]);
        setAddedIds((prev) => new Set(prev).add(newPl.id));
        setNewTapeName("");
        setShowCreateInput(false);
        setFeedbackMsg(`✓ CREATED & RECORDED TO "${newPl.name.toUpperCase()}"`);
        setTimeout(() => setFeedbackMsg(null), 2500);
      } else {
        alert(createData.error || "Failed to create new tape");
      }
    } catch (err) {
      console.error("Create tape error:", err);
      alert("Failed to create cassette tape");
    } finally {
      setCreatingTape(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 relative"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "6px 6px 0px #111111",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Technical Corner Ticks */}
        <span className="absolute top-1.5 left-2 text-sm font-bold text-[#F05A28]">┌</span>
        <span className="absolute top-1.5 right-2 text-sm font-bold text-[#F05A28]">┐</span>
        <span className="absolute bottom-1.5 left-2 text-sm font-bold text-[#F05A28]">└</span>
        <span className="absolute bottom-1.5 right-2 text-sm font-bold text-[#F05A28]">┘</span>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#111111]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F05A28] animate-pulse" />
            <h3 className="text-sm font-black uppercase text-[#111111] tracking-wide">
              RECORD SIGNAL TO TAPE
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#7A7166] hover:text-[#111111] hover:bg-[#F6EEDE] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Song Preview Box */}
        <div
          className="flex items-center gap-3 p-2.5 mb-4"
          style={{
            backgroundColor: "#F6EEDE",
            border: "1.5px solid #111111",
            boxShadow: "2px 2px 0px #111111",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={song.artworkUrl}
            alt={song.title}
            className="w-10 h-10 object-cover shrink-0"
            style={{ border: "1px solid #111111" }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase text-[#111111] truncate">
              {song.title}
            </p>
            <p className="text-[11px] text-[#F05A28] font-bold uppercase truncate mt-0.5">
              {song.artistName}
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#7A7166] shrink-0">
            {song.durationFormatted}
          </span>
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div
            className="mb-3 px-3 py-1.5 text-xs font-bold uppercase text-center animate-fade-in"
            style={{
              backgroundColor: "#FFF0ED",
              color: "#F05A28",
              border: "1px solid #F05A28",
            }}
          >
            {feedbackMsg}
          </div>
        )}

        {/* Not Logged In Notice */}
        {!user ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-xs text-[#7A7166]">
              Please sign in to record tracks into your personal cassette library.
            </p>
            <a
              href="/login"
              className="inline-block px-4 py-2 text-xs font-bold uppercase bg-[#F05A28] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]"
            >
              SIGN IN TO AURALIS
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Tape Roster Section */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#7A7166]">
              <span>SELECT CASSETTE TAPE:</span>
              <button
                type="button"
                onClick={() => setShowCreateInput(!showCreateInput)}
                className="text-[#F05A28] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>[ + NEW TAPE ]</span>
              </button>
            </div>

            {/* Quick Create Tape Form */}
            {showCreateInput && (
              <form onSubmit={handleCreateAndAdd} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="NEW TAPE NAME..."
                  value={newTapeName}
                  onChange={(e) => setNewTapeName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#FAF7EE] text-[#111111] placeholder-[#7A7166] border-2 border-[#111111] focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={creatingTape || !newTapeName.trim()}
                  className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-[#F05A28] text-[#111111] border-2 border-[#111111] shadow-[1.5px_1.5px_0px_#111111] disabled:opacity-50 cursor-pointer"
                >
                  {creatingTape ? "..." : "RECORD"}
                </button>
              </form>
            )}

            {/* List of Tapes */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-[#7A7166] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#F05A28]" />
                  <span>READING CASSETTE ARCHIVE...</span>
                </div>
              ) : playlists.length === 0 ? (
                <div className="p-6 text-center space-y-2 bg-[#F6EEDE] border-1 border-[#111111]">
                  <ListMusic className="w-6 h-6 mx-auto text-[#7A7166]" />
                  <p className="text-xs font-bold uppercase text-[#111111]">
                    NO CASSETTES RECORDED YET
                  </p>
                  <p className="text-[11px] text-[#7A7166]">
                    Create your first tape above to record this track.
                  </p>
                </div>
              ) : (
                playlists.map((pl) => {
                  const isAdded = addedIds.has(pl.id);
                  const isAdding = addingToId === pl.id;

                  return (
                    <div
                      key={pl.id}
                      className="flex items-center justify-between p-2.5 transition-all"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1.5px solid #111111",
                        boxShadow: "2px 2px 0px #111111",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="text-xs">📼</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase text-[#111111] truncate">
                            {pl.name}
                          </p>
                          <p className="text-[10px] text-[#7A7166]">
                            {pl.songCount} {pl.songCount === 1 ? "TRACK" : "TRACKS"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddSongToTape(pl.id, pl.name)}
                        disabled={isAdded || isAdding}
                        className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-default"
                        style={{
                          backgroundColor: isAdded ? "#FAF7EE" : "#F05A28",
                          color: isAdded ? "#7A7166" : "#111111",
                          border: "1.5px solid #111111",
                          boxShadow: isAdded ? "none" : "1.5px 1.5px 0px #111111",
                        }}
                      >
                        {isAdding ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>RECORDING...</span>
                          </>
                        ) : isAdded ? (
                          <>
                            <Check className="w-3 h-3 text-[#F05A28]" />
                            <span>ON TAPE</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>RECORD</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Modal Footer Done Button */}
        <div className="mt-5 pt-3 border-t-2 border-[#111111] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FAF7EE] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#F6EEDE] transition-all cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}

