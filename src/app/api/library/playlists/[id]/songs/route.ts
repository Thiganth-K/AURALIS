import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Playlist, Song } from "@/models";
import { requireAuth } from "@/lib/auth";

export const instant = false;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { songId } = body;

    if (!songId) {
      return NextResponse.json({ error: "songId is required" }, { status: 400 });
    }

    await connectDB();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Owner or admin only
    if (playlist.ownerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Not playlist owner" }, { status: 403 });
    }

    // Verify song exists and is published
    const song = await Song.findOne({ _id: songId, status: "published" });
    if (!song) {
      return NextResponse.json({ error: "Song not found or not published" }, { status: 404 });
    }

    const alreadyExists = playlist.songs.some((s) => s.songId.toString() === songId);
    if (!alreadyExists) {
      playlist.songs.push({
        songId: song._id,
        position: playlist.songs.length + 1,
      });
      await playlist.save();
    }

    return NextResponse.json({
      success: true,
      message: "Song added to playlist",
      songCount: playlist.songs.length,
    });
  } catch (err: unknown) {
    console.error("Playlist add song error:", err);
    return NextResponse.json({ error: "Failed to add song to playlist" }, { status: 500 });
  }
}
