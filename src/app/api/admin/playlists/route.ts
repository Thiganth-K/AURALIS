import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Playlist, Song, AdminAudit } from "@/models";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    await connectDB();
    const playlists = await Playlist.find()
      .populate("ownerId", "name email role")
      .sort({ isCurated: -1, createdAt: -1 })
      .lean();

    const formatted = playlists.map((p) => ({
      ...p,
      id: p._id.toString(),
      owner: p.ownerId,
      songCount: p.songs?.length || 0,
    }));

    return NextResponse.json({ success: true, playlists: formatted });
  } catch (err: unknown) {
    console.error("Admin Playlists GET error:", err);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, artworkUrl, isCurated, isPublic, songIds } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Playlist name is required" }, { status: 400 });
    }

    await connectDB();

    let slug = body.slug?.trim()?.toLowerCase();
    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const existing = await Playlist.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Verify songs if provided
    let songsList: { songId: string; position: number }[] = [];
    if (Array.isArray(songIds) && songIds.length > 0) {
      const validSongs = await Song.find({ _id: { $in: songIds } }).select("_id");
      const validIds = new Set(validSongs.map((s) => s._id.toString()));
      songsList = songIds
        .filter((id: string) => validIds.has(id))
        .map((id: string, idx: number) => ({
          songId: id,
          position: idx + 1,
        }));
    }

    const playlist = await Playlist.create({
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      ownerId: admin._id,
      artworkUrl:
        artworkUrl ||
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
      songs: songsList,
      isPublic: isPublic !== undefined ? isPublic : true,
      isCurated: isCurated !== undefined ? isCurated : true,
      status: "active",
      createdBy: admin._id,
    });

    await AdminAudit.create({
      adminId: admin._id,
      action: "PLAYLIST_CREATED",
      resourceType: "playlist",
      resourceId: playlist._id.toString(),
      details: { name: playlist.name, isCurated: playlist.isCurated },
    });

    return NextResponse.json(
      {
        success: true,
        playlist: {
          ...playlist.toObject(),
          id: playlist._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Admin Playlists POST error:", err);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}
