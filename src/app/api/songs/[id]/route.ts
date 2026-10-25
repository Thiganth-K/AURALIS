import { NextRequest, NextResponse } from "next/server";
import { getSongById } from "@/services/songService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const song = await getSongById(id);

    if (!song) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESOURCE_NOT_FOUND",
            message: "Song not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("API GET /api/songs/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch song",
        },
      },
      { status: 500 }
    );
  }
}
