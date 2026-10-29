import { Metadata } from "next";
import { connection } from "next/server";
import { getTrendingSongs } from "@/services/songService";
import { getFeaturedArtists } from "@/services/artistService";
import { getPublicPlaylists } from "@/services/playlistService";
import { TopChartsClient } from "@/components/discover/TopChartsClient";
import { Song, Artist, Playlist } from "@/types";

export const instant = false;

export const metadata: Metadata = {
  title: "Top Charts // Frequency Leaders — AURALIS",
  description:
    "Official AURALIS top charts and broadcast rankings. Stream verified trending tracks, top transmitting artists, and popular cassette tapes.",
};

export default async function TopChartsPage() {
  await connection();

  let songs: Song[] = [];
  let artists: Artist[] = [];
  let playlists: Playlist[] = [];

  try {
    const [fetchedSongs, fetchedArtists, fetchedPlaylists] = await Promise.all([
      getTrendingSongs(30),
      getFeaturedArtists(12),
      getPublicPlaylists(8),
    ]);

    songs = fetchedSongs;
    artists = fetchedArtists;
    playlists = fetchedPlaylists;
  } catch (error) {
    console.error("Error loading top charts:", error);
  }

  return (
    <TopChartsClient
      songs={songs}
      artists={artists}
      playlists={playlists}
    />
  );
}

