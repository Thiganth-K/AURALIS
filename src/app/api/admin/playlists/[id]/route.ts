import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Playlist, Song, AdminAudit } from "@/models";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const playlist = await Playlist.findById(id)
      .populate("ownerId", "name email role")
      .lean();

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Populate songs in order
    const songIds = playlist.songs.map((s) => s.songId);
    const songsData = await Song.find({ _id: { $in: songIds } })
      .populate("artistId", "name slug image")
      .populate("albumId", "title slug artworkUrl")
      .lean();

    const songMap = new Map(songsData.map((s) => [s._id.toString(), s]));
    const orderedSongs = playlist.songs
      .map((ps) => songMap.get(ps.songId.toString()))
      .filter(Boolean)
      .map((s) => ({
        ...s,
        id: s!._id.toString(),
        artist: (s as any).artistId,
        album: (s as any).albumId,
      }));

    return NextResponse.json({
      success: true,
      playlist: {
        ...playlist,
        id: playlist._id.toString(),
        songs: orderedSongs,
      },
    });
  } catch (err: unknown) {
    console.error("Admin Playlist GET [id] error:", err);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    if (body.name) playlist.name = body.name.trim();
    if (body.description !== undefined) playlist.description = body.description.trim();
    if (body.artworkUrl) playlist.artworkUrl = body.artworkUrl;
    if (body.isCurated !== undefined) playlist.isCurated = Boolean(body.isCurated);
    if (body.isPublic !== undefined) playlist.isPublic = Boolean(body.isPublic);
    if (body.status) playlist.status = body.status;

    if (Array.isArray(body.songIds)) {
      playlist.songs = body.songIds.map((sId: string, idx: number) => ({
        songId: sId as any,
        position: idx + 1,
      }));
    }

    await playlist.save();

    await AdminAudit.create({
      adminId: admin._id,
      action: "PLAYLIST_UPDATED",
      resourceType: "playlist",
      resourceId: playlist._id.toString(),
      details: body,
    });

    return NextResponse.json({
      success: true,
      playlist: {
        ...playlist.toObject(),
        id: playlist._id.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("Admin Playlist PATCH [id] error:", err);
    return NextResponse.json({ error: "Failed to update playlist" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const playlist = await Playlist.findByIdAndDelete(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    await AdminAudit.create({
      adminId: admin._id,
      action: "PLAYLIST_DELETED",
      resourceType: "playlist",
      resourceId: id,
      details: { name: playlist.name },
    });

    return NextResponse.json({ success: true, message: "Playlist deleted successfully" });
  } catch (err: unknown) {
    console.error("Admin Playlist DELETE [id] error:", err);
    return NextResponse.json({ error: "Failed to delete playlist" }, { status: 500 });
  }
}
