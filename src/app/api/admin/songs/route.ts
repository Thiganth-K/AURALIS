import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Song, Artist, Album, AdminAudit } from "@/models";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status"); // "all" | "published" | "draft" | "archived"
    const query = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    const songs = await Song.find(filter)
      .populate("artistId", "name slug image")
      .populate("albumId", "title slug artworkUrl")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = songs.map((s) => ({
      ...s,
      id: s._id.toString(),
      artist: s.artistId,
      album: s.albumId,
    }));

    return NextResponse.json({ success: true, songs: formatted });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && (err as { digest: string }).digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw err;
    }
    console.error("Admin Songs GET error:", err);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      artistId,
      albumId,
      audioUrl,
      artworkUrl,
      duration,
      genre,
      releaseDate,
      explicit,
      status, // "draft" | "published"
    } = body;

    // Required field validation per spec
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Song title is required" }, { status: 400 });
    }
    if (!artistId) {
      return NextResponse.json({ error: "Artist is required" }, { status: 400 });
    }
    if (!audioUrl || !audioUrl.trim()) {
      return NextResponse.json({ error: "Audio file URL is required" }, { status: 400 });
    }

    await connectDB();

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return NextResponse.json({ error: "Selected artist does not exist" }, { status: 400 });
    }

    let resolvedArtwork = artworkUrl?.trim();
    let albumDoc = null;
    if (albumId) {
      albumDoc = await Album.findById(albumId);
      if (!resolvedArtwork && albumDoc?.artworkUrl) {
        resolvedArtwork = albumDoc.artworkUrl;
      }
    }

    if (!resolvedArtwork) {
      resolvedArtwork =
        artist.image ||
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80";
    }

    let slug = body.slug?.trim()?.toLowerCase();
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const existingSlug = await Song.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const songStatus = status === "published" ? "published" : "draft";

    const song = await Song.create({
      title: title.trim(),
      slug,
      artistId: artist._id,
      albumId: albumDoc?._id || undefined,
      audioUrl: audioUrl.trim(),
      artworkUrl: resolvedArtwork,
      duration: duration ? Number(duration) : 180,
      genre: genre?.trim() || artist.genres?.[0] || "Alternative",
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      explicit: Boolean(explicit),
      status: songStatus,
      publishedAt: songStatus === "published" ? new Date() : undefined,
      uploadedBy: admin._id,
      playCount: 0,
    });

    await AdminAudit.create({
      adminId: admin._id,
      action: songStatus === "published" ? "SONG_PUBLISHED" : "SONG_CREATED",
      resourceType: "song",
      resourceId: song._id.toString(),
      details: { title: song.title, status: song.status, artist: artist.name },
    });

    return NextResponse.json(
      {
        success: true,
        song: {
          ...song.toObject(),
          id: song._id.toString(),
          artist: { id: artist._id.toString(), name: artist.name },
          album: albumDoc ? { id: albumDoc._id.toString(), title: albumDoc.title } : undefined,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Admin Songs POST error:", err);
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 });
  }
}
