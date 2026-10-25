import { NextRequest, NextResponse } from "next/server";
import { getArtistById } from "@/services/artistService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artist = await getArtistById(id);

    if (!artist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESOURCE_NOT_FOUND",
            message: "Artist not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: artist,
    });
  } catch (error) {
    console.error("API GET /api/artists/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch artist",
        },
      },
      { status: 500 }
    );
  }
}
