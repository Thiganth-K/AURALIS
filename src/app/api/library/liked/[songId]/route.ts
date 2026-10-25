import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, Song } from "@/models";
import { requireAuth } from "@/lib/auth";

export const instant = false;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ songId: string }> }
) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    const { songId } = await params;
    await connectDB();

    const song = await Song.findById(songId);
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { likedSongs: song._id },
    });

    return NextResponse.json({
      success: true,
      liked: true,
      songId,
    });
  } catch (err: unknown) {
    console.error("Library Like POST error:", err);
    return NextResponse.json({ error: "Failed to like song" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ songId: string }> }
) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    const { songId } = await params;
    await connectDB();

    await User.findByIdAndUpdate(user._id, {
      $pull: { likedSongs: songId },
    });

    return NextResponse.json({
      success: true,
      liked: false,
      songId,
    });
  } catch (err: unknown) {
    console.error("Library Like DELETE error:", err);
    return NextResponse.json({ error: "Failed to unlike song" }, { status: 500 });
  }
}
