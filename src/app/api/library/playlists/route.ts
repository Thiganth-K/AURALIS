import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Playlist, Song } from "@/models";
import { requireAuth } from "@/lib/auth";

export const instant = false;

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    await connectDB();
    const playlists = await Playlist.find({
      ownerId: user._id,
      status: "active",
    })
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = playlists.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      artworkUrl: p.artworkUrl,
      songCount: p.songs?.length || 0,
      isPublic: p.isPublic,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ success: true, playlists: formatted });
  } catch (err: unknown) {
    console.error("Library Playlists GET error:", err);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, artworkUrl, isPublic, songIds } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Playlist name is required" }, { status: 400 });
    }

    await connectDB();

    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await Playlist.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let songsList: { songId: string; position: number }[] = [];
    if (Array.isArray(songIds) && songIds.length > 0) {
      const validSongs = await Song.find({ _id: { $in: songIds }, status: "published" }).select("_id");
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
      ownerId: user._id,
      artworkUrl:
        artworkUrl ||
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
      songs: songsList,
      isPublic: isPublic !== undefined ? isPublic : false,
      isCurated: false,
      status: "active",
      createdBy: user._id,
    });

    return NextResponse.json(
      {
        success: true,
        playlist: {
          ...playlist.toObject(),
          id: playlist._id.toString(),
          songCount: songsList.length,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Library Playlists POST error:", err);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}
