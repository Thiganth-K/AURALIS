import { NextRequest, NextResponse } from "next/server";
import { getPublicPlaylists } from "@/services/playlistService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const playlists = await getPublicPlaylists(limit);

    return NextResponse.json({
      success: true,
      data: playlists,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED" || error?.message?.includes("bail out of prerendering")) {
      throw error;
    }
    console.error("API GET /api/playlists error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch playlists",
        },
      },
      { status: 500 }
    );
  }
}
