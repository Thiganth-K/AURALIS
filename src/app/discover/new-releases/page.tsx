import { Metadata } from "next";
import { connection } from "next/server";
import { getSongs } from "@/services/songService";
import { getNewReleases } from "@/services/albumService";
import { getPublicPlaylists } from "@/services/playlistService";
import { NewReleasesClient } from "@/components/discover/NewReleasesClient";
import { Song, Album, Playlist } from "@/types";

export const instant = false;

export const metadata: Metadata = {
  title: "New Releases // Fresh Dispatches — AURALIS",
  description:
    "Freshly minted studio releases, new singles, and analog tape dispatches on Auralis.",
};

export default async function NewReleasesPage() {
  await connection();

  let songs: Song[] = [];
  let albums: Album[] = [];
  let playlists: Playlist[] = [];

  try {
    const [fetchedSongs, fetchedAlbums, fetchedPlaylists] = await Promise.all([
      getSongs({ limit: 30, sort: "recent" }),
      getNewReleases(18),
      getPublicPlaylists(8),
    ]);

    songs = fetchedSongs;
    albums = fetchedAlbums;
    playlists = fetchedPlaylists;
  } catch (error) {
    console.error("Error loading new releases:", error);
  }

  return (
    <NewReleasesClient
      songs={songs}
      albums={albums}
      playlists={playlists}
    />
  );
}

