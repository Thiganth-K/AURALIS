"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, Music, Disc3, Mic2, ListMusic, Loader2 } from "lucide-react";
import { Song, Album, Artist, Playlist } from "@/types";
import { SongRow } from "@/components/music/SongRow";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState<"all" | "songs" | "artists" | "albums" | "playlists">("all");

  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sync debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
      if (query.trim()) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query, router]);

  // Execute search API request
  useEffect(() => {
    if (!debouncedQuery) {
      setSongs([]);
      setArtists([]);
      setAlbums([]);
      setPlaylists([]);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCurrent) return;
        if (data.success && data.data) {
          setSongs(data.data.songs || []);
          setArtists(data.data.artists || []);
          setAlbums(data.data.albums || []);
          setPlaylists(data.data.playlists || []);
        }
      })
      .catch((err) => console.error("Search error:", err))
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  const hasResults =
    songs.length > 0 || artists.length > 0 || albums.length > 0 || playlists.length > 0;

  return (
    <div className="px-6 md:px-10 py-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Retro Search Command Console */}
      <div className="space-y-4">
        <div className="relative max-w-2xl bg-[#111111] border-2 border-[#2e2e2e] shadow-[3px_3px_0px_#000] focus-within:border-[#D7FF3F] transition-colors">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[#D7FF3F] font-pixel text-xs">
            <span>&gt;</span>
          </div>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH AURALIS_ (title, artist, album, genre)"
            className="w-full pl-8 pr-10 py-3.5 bg-transparent font-pixel text-xs text-white placeholder-[#555] focus:outline-none"
          />
          {loading && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7FF3F] animate-spin" />
          )}
        </div>

        {/* Category Tactical Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "songs", "artists", "albums", "playlists"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 text-xs font-pixel uppercase transition-all shrink-0 border-2 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                category === cat
                  ? "bg-[#D7FF3F] text-black border-black font-bold"
                  : "bg-[#141414] text-[#A1A1AA] border-[#262626] hover:text-white hover:border-[#444]"
              }`}
            >
              [ {cat} ]
            </button>
          ))}
        </div>
      </div>

      {/* Results Content */}
      {!debouncedQuery ? (
        <div className="py-20 text-center space-y-2 border-2 border-[#222] bg-[#111111] p-8 shadow-[3px_3px_0px_#000] max-w-md mx-auto">
          <p className="text-sm font-pixel text-white">// AURALIS CATALOG SEARCH</p>
          <p className="text-xs font-sans text-[#71717A]">
            Type a track title, genre, artist, or album name above to discover verified music.
          </p>
        </div>
      ) : loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-[#D7FF3F] animate-spin" />
          <span className="text-xs font-pixel text-[#71717A]">SCANNING FREQUENCIES...</span>
        </div>
      ) : !hasResults ? (
        <div className="py-16 text-center space-y-3 border-2 border-[#262626] bg-[#111111] p-8 shadow-[3px_3px_0px_#000] max-w-md mx-auto">
          <p className="text-sm font-pixel text-[#D7FF3F]">// NO SIGNAL MATCHES</p>
          <p className="text-xs font-sans text-[#71717A]">
            No verified releases found matching &quot;{debouncedQuery}&quot;. Check spelling or explore trending signals.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Songs Section */}
          {(category === "all" || category === "songs") && songs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-pixel uppercase tracking-wider text-[#D7FF3F] flex items-center gap-2">
                <Music className="w-3.5 h-3.5" />
                <span>// SONGS ({songs.length})</span>
              </h2>
              <div className="border-2 border-[#242424] bg-[#0e0e0e] shadow-[3px_3px_0px_#000] p-2 space-y-1">
                {songs.map((song, index) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={index}
                    playlistContext={songs}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Artists Section */}
          {(category === "all" || category === "artists") && artists.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-pixel uppercase tracking-wider text-[#D7FF3F] flex items-center gap-2">
                <Mic2 className="w-3.5 h-3.5" />
                <span>// ARTISTS ({artists.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {(category === "all" || category === "albums") && albums.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-pixel uppercase tracking-wider text-[#D7FF3F] flex items-center gap-2">
                <Disc3 className="w-3.5 h-3.5" />
                <span>// ALBUMS ({albums.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}

          {/* Playlists Section */}
          {(category === "all" || category === "playlists") && playlists.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-pixel uppercase tracking-wider text-[#D7FF3F] flex items-center gap-2">
                <ListMusic className="w-3.5 h-3.5" />
                <span>// PLAYLISTS ({playlists.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D7FF3F] animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
