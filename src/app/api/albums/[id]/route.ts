import { NextRequest, NextResponse } from "next/server";
import { getAlbumById } from "@/services/albumService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const album = await getAlbumById(id);

    if (!album) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESOURCE_NOT_FOUND",
            message: "Album not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: album,
    });
  } catch (error) {
    console.error("API GET /api/albums/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch album",
        },
      },
      { status: 500 }
    );
  }
}
