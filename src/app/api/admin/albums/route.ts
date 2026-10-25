import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Album, Artist, Song, AdminAudit } from "@/models";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    await connectDB();
    const albums = await Album.find()
      .populate("artistId", "name slug image")
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(
      albums.map(async (alb) => {
        const songCount = await Song.countDocuments({ albumId: alb._id });
        return {
          ...alb,
          id: alb._id.toString(),
          artist: alb.artistId,
          songCount,
        };
      })
    );

    return NextResponse.json({ success: true, albums: enriched });
  } catch (err: unknown) {
    console.error("Admin Albums GET error:", err);
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, artistId, releaseDate, genres, description, artworkUrl, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Album title is required" }, { status: 400 });
    }
    if (!artistId) {
      return NextResponse.json({ error: "Artist selection is required" }, { status: 400 });
    }

    await connectDB();

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return NextResponse.json({ error: "Selected artist does not exist" }, { status: 400 });
    }

    let slug = body.slug?.trim()?.toLowerCase();
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const existing = await Album.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const parsedGenres = Array.isArray(genres)
      ? genres
      : typeof genres === "string"
      ? genres.split(",").map((g: string) => g.trim()).filter(Boolean)
      : [];

    const album = await Album.create({
      title: title.trim(),
      slug,
      artistId: artist._id,
      artworkUrl:
        artworkUrl ||
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80",
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      genres: parsedGenres,
      description: description?.trim() || "",
      status: status || "published",
      createdBy: admin._id,
    });

    await AdminAudit.create({
      adminId: admin._id,
      action: "ALBUM_CREATED",
      resourceType: "album",
      resourceId: album._id.toString(),
      details: { title: album.title, artistId: artist._id.toString() },
    });

    return NextResponse.json(
      {
        success: true,
        album: {
          ...album.toObject(),
          id: album._id.toString(),
          artist: { id: artist._id.toString(), name: artist.name },
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Admin Albums POST error:", err);
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
