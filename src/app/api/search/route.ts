import { NextRequest, NextResponse } from "next/server";
import { searchSongs } from "@/services/songService";
import { searchArtists } from "@/services/artistService";
import { searchAlbums } from "@/services/albumService";
import { searchPlaylists } from "@/services/playlistService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          songs: [],
          artists: [],
          albums: [],
          playlists: [],
        },
      });
    }

    const [songs, artists, albums, playlists] = await Promise.all([
      searchSongs(query, 10),
      searchArtists(query, 6),
      searchAlbums(query, 6),
      searchPlaylists(query, 6),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        songs,
        artists,
        albums,
        playlists,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED" || error?.message?.includes("bail out of prerendering")) {
      throw error;
    }
    console.error("API GET /api/search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Search failed",
        },
      },
      { status: 500 }
    );
  }
}
