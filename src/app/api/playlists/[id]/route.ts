import { NextRequest, NextResponse } from "next/server";
import { getPlaylistById } from "@/services/playlistService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playlist = await getPlaylistById(id);

    if (!playlist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESOURCE_NOT_FOUND",
            message: "Playlist not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error("API GET /api/playlists/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch playlist",
        },
      },
      { status: 500 }
    );
  }
}
