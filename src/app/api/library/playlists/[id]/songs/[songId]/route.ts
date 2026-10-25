import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Playlist } from "@/models";
import { requireAuth } from "@/lib/auth";

export const instant = false;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; songId: string }> }
) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, songId } = await params;
    await connectDB();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Owner or admin only
    if (playlist.ownerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Not playlist owner" }, { status: 403 });
    }

    playlist.songs = playlist.songs.filter((s) => s.songId.toString() !== songId);
    playlist.songs.forEach((s, idx) => {
      s.position = idx + 1;
    });

    await playlist.save();

    return NextResponse.json({
      success: true,
      message: "Song removed from playlist",
      songCount: playlist.songs.length,
    });
  } catch (err: unknown) {
    console.error("Playlist remove song error:", err);
    return NextResponse.json({ error: "Failed to remove song from playlist" }, { status: 500 });
  }
}
