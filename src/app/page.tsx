import { connection } from "next/server";
import { getTrendingSongs } from "@/services/songService";
import { getNewReleases } from "@/services/albumService";
import { getFeaturedArtists } from "@/services/artistService";
import { getPublicPlaylists } from "@/services/playlistService";
import { connectDB } from "@/lib/mongodb";
import { FeaturedContent } from "@/models";
import { transformSongDocument } from "@/services/songService";
import { HomeClient } from "@/components/home/HomeClient";
import { Song, Album, Artist, Playlist } from "@/types";

export const instant = false;

export default async function HomePage() {
  await connection();

  let trendingSongs: Song[] = [];
  let recentAlbums: Album[] = [];
  let featuredArtists: Artist[] = [];
  let curatedPlaylists: Playlist[] = [];
  let featuredMeta: {
    headline?: string;
    subheadline?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featuredSong?: any;
  } = {};

  try {
    await connectDB();
    const [songs, albums, artists, playlists, featuredDoc] = await Promise.all([
      getTrendingSongs(10),
      getNewReleases(6),
      getFeaturedArtists(8),
      getPublicPlaylists(5),
      FeaturedContent.findOne({ key: "home_featured" })
        .populate({
          path: "featuredSongId",
          populate: [
            { path: "artistId", select: "name slug image" },
            { path: "albumId", select: "title slug artworkUrl" },
          ],
        })
        .lean(),
    ]);

    trendingSongs = songs;
    recentAlbums = albums;
    featuredArtists = artists;
    curatedPlaylists = playlists;

    if (featuredDoc) {
      featuredMeta = {
        headline: featuredDoc.headline,
        subheadline: featuredDoc.subheadline,
        featuredSong: featuredDoc.featuredSongId
          ? transformSongDocument(featuredDoc.featuredSongId)
          : undefined,
      };
    }
  } catch (error) {
    console.warn("Database connection issue on HomePage:", error);
    trendingSongs = [];
    recentAlbums = [];
    featuredArtists = [];
    curatedPlaylists = [];
  }

  return (
    <HomeClient
      trendingSongs={trendingSongs}
      recentAlbums={recentAlbums}
      featuredArtists={featuredArtists}
      curatedPlaylists={curatedPlaylists}
      featuredMeta={featuredMeta}
    />
  );
}
