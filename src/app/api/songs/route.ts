import { NextRequest, NextResponse } from "next/server";
import { getSongs } from "@/services/songService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const genre = searchParams.get("genre") || undefined;
    const sortParam = searchParams.get("sort");

    const limit = limitParam ? parseInt(limitParam, 10) : 50;
    const sort = sortParam === "trending" || sortParam === "recent" ? sortParam : undefined;

    const songs = await getSongs({ limit, genre, sort });

    return NextResponse.json({
      success: true,
      data: songs,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED" || error?.message?.includes("bail out of prerendering")) {
      throw error;
    }
    console.error("API GET /api/songs error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch songs",
        },
      },
      { status: 500 }
    );
  }
}
