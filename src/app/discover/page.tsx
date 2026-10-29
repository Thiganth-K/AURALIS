import { Metadata } from "next";
import { connection } from "next/server";
import { getTrendingSongs } from "@/services/songService";
import { getNewReleases } from "@/services/albumService";
import { getFeaturedArtists } from "@/services/artistService";
import { getPublicPlaylists } from "@/services/playlistService";
import { DiscoverClient } from "@/components/discover/DiscoverClient";
import { Song, Album, Artist, Playlist } from "@/types";

export const instant = false;

export const metadata: Metadata = {
  title: "Discover Signals — AURALIS",
  description:
    "Explore high-fidelity acoustic broadcasts, emerging frequencies, and curated analog tape releases on Auralis.",
};

export default async function DiscoverPage() {
  await connection();

  let songs: Song[] = [];
  let albums: Album[] = [];
  let artists: Artist[] = [];
  let playlists: Playlist[] = [];

  try {
    const [fetchedSongs, fetchedAlbums, fetchedArtists, fetchedPlaylists] =
      await Promise.all([
        getTrendingSongs(30),
        getNewReleases(12),
        getFeaturedArtists(12),
        getPublicPlaylists(8),
      ]);

    songs = fetchedSongs;
    albums = fetchedAlbums;
    artists = fetchedArtists;
    playlists = fetchedPlaylists;
  } catch (error) {
    console.error("Error loading discover data:", error);
  }

  return (
    <DiscoverClient
      songs={songs}
      albums={albums}
      artists={artists}
      playlists={playlists}
    />
  );
}

