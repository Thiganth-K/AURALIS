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
    <div className="px-6 md:px-10 py-8 space-y-8 max-w-7xl mx-auto">
      {/* Search Input Bar */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717A]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search published songs, artists, albums, or playlists..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#141414] border border-white/10 text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-[#D7FF3F] transition-all shadow-xl"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7FF3F] animate-spin" />
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "songs", "artists", "albums", "playlists"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono capitalize transition-all shrink-0 ${
                category === cat
                  ? "bg-[#D7FF3F] text-black font-semibold"
                  : "bg-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Content */}
      {!debouncedQuery ? (
        <div className="py-20 text-center space-y-2">
          <p className="text-sm font-semibold text-white">Explore the AURALIS catalog</p>
          <p className="text-xs text-[#71717A]">
            Type a track title, genre, artist, or album name above to discover verified music.
          </p>
        </div>
      ) : loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D7FF3F] animate-spin" />
        </div>
      ) : !hasResults ? (
        <div className="py-20 text-center space-y-2">
          <p className="text-sm font-semibold text-white">No matches found for &quot;{debouncedQuery}&quot;</p>
          <p className="text-xs text-[#71717A]">
            Only published songs and verified releases appear in the public catalog.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Songs Section */}
          {(category === "all" || category === "songs") && songs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span>Songs</span>
              </h2>
              <div className="rounded-xl border border-white/5 bg-[#121212] overflow-hidden divide-y divide-white/5">
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
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <Mic2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span>Artists</span>
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
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <Disc3 className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span>Albums</span>
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
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <ListMusic className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span>Playlists</span>
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
