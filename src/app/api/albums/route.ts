import { NextRequest, NextResponse } from "next/server";
import { getAlbums } from "@/services/albumService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const albums = await getAlbums(limit);

    return NextResponse.json({
      success: true,
      data: albums,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED" || error?.message?.includes("bail out of prerendering")) {
      throw error;
    }
    console.error("API GET /api/albums error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch albums",
        },
      },
      { status: 500 }
    );
  }
}
