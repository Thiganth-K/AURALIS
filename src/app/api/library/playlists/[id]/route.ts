import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Playlist, Song } from "@/models";
import { requireAuth } from "@/lib/auth";
import { transformSongDocument } from "@/services/songService";

export const instant = false;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    await connectDB();

    const playlist = await Playlist.findById(id).lean();
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // If private, only owner or admin can view
    if (!playlist.isPublic) {
      if (!user || (user._id.toString() !== playlist.ownerId.toString() && user.role !== "admin")) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    const songIds = playlist.songs.map((s) => s.songId);
    const songsData = await Song.find({ _id: { $in: songIds }, status: "published" })
      .populate("artistId", "name slug image")
      .populate("albumId", "title slug artworkUrl")
      .lean();

    const songMap = new Map(songsData.map((s) => [s._id.toString(), s]));
    const orderedSongs = playlist.songs
      .map((ps) => songMap.get(ps.songId.toString()))
      .filter(Boolean)
      .map((s) => transformSongDocument(s));

    return NextResponse.json({
      success: true,
      playlist: {
        ...playlist,
        id: playlist._id.toString(),
        songs: orderedSongs,
        songCount: orderedSongs.length,
      },
    });
  } catch (err: unknown) {
    console.error("Library Playlist GET [id] error:", err);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}

export async function PATCH(
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
    await connectDB();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Only owner or admin can edit
    if (playlist.ownerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: You cannot modify this playlist" }, { status: 403 });
    }

    if (body.name) playlist.name = body.name.trim();
    if (body.description !== undefined) playlist.description = body.description.trim();
    if (body.artworkUrl) playlist.artworkUrl = body.artworkUrl;
    if (body.isPublic !== undefined) playlist.isPublic = Boolean(body.isPublic);

    // Add single song
    if (body.addSongId) {
      const exists = playlist.songs.some((s) => s.songId.toString() === body.addSongId);
      if (!exists) {
        playlist.songs.push({
          songId: body.addSongId as any,
          position: playlist.songs.length + 1,
        });
      }
    }

    // Remove single song
    if (body.removeSongId) {
      playlist.songs = playlist.songs.filter((s) => s.songId.toString() !== body.removeSongId);
      // Re-index positions
      playlist.songs.forEach((s, idx) => {
        s.position = idx + 1;
      });
    }

    // Reorder / set songs list
    if (Array.isArray(body.songIds)) {
      playlist.songs = body.songIds.map((sId: string, idx: number) => ({
        songId: sId as any,
        position: idx + 1,
      }));
    }

    await playlist.save();

    return NextResponse.json({
      success: true,
      playlist: {
        ...playlist.toObject(),
        id: playlist._id.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("Library Playlist PATCH [id] error:", err);
    return NextResponse.json({ error: "Failed to update playlist" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    if (playlist.ownerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: You cannot delete this playlist" }, { status: 403 });
    }

    await Playlist.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Playlist deleted successfully" });
  } catch (err: unknown) {
    console.error("Library Playlist DELETE [id] error:", err);
    return NextResponse.json({ error: "Failed to delete playlist" }, { status: 500 });
  }
}
