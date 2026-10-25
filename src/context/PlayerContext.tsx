"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Song, RepeatMode } from "@/types";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Song[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isQueueOpen: boolean;
  isExpandedPlayerOpen: boolean;
  likedSongIds: Set<string>;
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string) => void;
  setQueueOpen: (open: boolean) => void;
  setExpandedPlayerOpen: (open: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [isQueueOpen, setQueueOpen] = useState<boolean>(false);
  const [isExpandedPlayerOpen, setExpandedPlayerOpen] = useState<boolean>(false);
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(new Set());

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync song source
  // Sync liked songs from DB
  useEffect(() => {
    async function syncLiked() {
      try {
        const res = await fetch("/api/library/liked");
        if (res.ok) {
          const data = await res.json();
          if (data.ids && Array.isArray(data.ids)) {
            setLikedSongIds(new Set(data.ids));
          }
        }
      } catch {
        // Fallback to local
      }
    }
    syncLiked();
  }, []);

  const loadAndPlayTrack = useCallback((song: Song, autoPlay = true) => {
    setCurrentSong(song);
    setProgress(0);
    setDuration(song.duration || 180);

    if (audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
      if (autoPlay) {
        audioRef.current.play().then(() => {
          if (song.id && song.id.length === 24) {
            // Record listening history & increment play count in MongoDB
            fetch("/api/library/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ songId: song.id, durationPlayed: 0, completed: false }),
            }).catch(() => {});
          }
        }).catch((err) => {
          console.warn("Audio autoplay prevented or error:", err);
          setIsPlaying(false);
        });
      }
    }
  }, []);

  const playSong = useCallback(
    (song: Song, newQueue?: Song[]) => {
      if (newQueue && newQueue.length > 0) {
        setQueue(newQueue);
        const idx = newQueue.findIndex((s) => s.id === song.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      } else {
        const existingIdx = queue.findIndex((s) => s.id === song.id);
        if (existingIdx >= 0) {
          setQueueIndex(existingIdx);
        } else {
          setQueue((prev) => [song, ...prev]);
          setQueueIndex(0);
        }
      }
      loadAndPlayTrack(song, true);
    },
    [queue, loadAndPlayTrack]
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!audioRef.current.src || audioRef.current.src === "") {
        audioRef.current.src = currentSong.audioUrl;
      }
      audioRef.current.play().catch((err) => {
        console.warn("Playback prevented:", err);
      });
    }
  }, [isPlaying, currentSong]);

  const handleNextTrack = useCallback(() => {
    if (repeatMode === "one" && audioRef.current && currentSong) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
      return;
    }

    if (queue.length === 0) return;

    let nextIdx: number;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeatMode === "all") {
          nextIdx = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    setQueueIndex(nextIdx);
    const nextSong = queue[nextIdx];
    if (nextSong) {
      loadAndPlayTrack(nextSong, true);
    }
  }, [repeatMode, queue, isShuffle, queueIndex, currentSong, loadAndPlayTrack]);

  const previous = useCallback(() => {
    if (!audioRef.current) return;

    // If played more than 3 seconds, restart current track
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = repeatMode === "all" ? queue.length - 1 : 0;
    }

    setQueueIndex(prevIdx);
    const prevSong = queue[prevIdx];
    if (prevSong) {
      loadAndPlayTrack(prevSong, true);
    }
  }, [queue, queueIndex, repeatMode, loadAndPlayTrack]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue((prev) => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((songId: string) => {
    setQueue((prev) => prev.filter((s) => s.id !== songId));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentSong]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const toggleLike = useCallback((songId: string) => {
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyLiked = next.has(songId);
      if (isCurrentlyLiked) {
        next.delete(songId);
        fetch(`/api/library/liked/${songId}`, { method: "DELETE" }).catch(() => {});
      } else {
        next.add(songId);
        fetch(`/api/library/liked/${songId}`, { method: "POST" }).catch(() => {});
      }
      return next;
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        volume,
        isMuted,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        isQueueOpen,
        isExpandedPlayerOpen,
        likedSongIds,
        playSong,
        togglePlay,
        next: handleNextTrack,
        previous,
        seek,
        setVolume,
        toggleMute,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        setQueueOpen,
        setExpandedPlayerOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
