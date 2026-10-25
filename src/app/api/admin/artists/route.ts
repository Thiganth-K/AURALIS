import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Artist, Album, Song, AdminAudit } from "@/models";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    await connectDB();
    const artists = await Artist.find().sort({ createdAt: -1 }).lean();

    // Enrich with counts
    const enriched = await Promise.all(
      artists.map(async (art) => {
        const [albumCount, songCount] = await Promise.all([
          Album.countDocuments({ artistId: art._id }),
          Song.countDocuments({ artistId: art._id }),
        ]);
        return {
          ...art,
          id: art._id.toString(),
          albumCount,
          songCount,
        };
      })
    );

    return NextResponse.json({ success: true, artists: enriched });
  } catch (err: unknown) {
    console.error("Admin Artists GET error:", err);
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, bio, genres, image } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Artist name is required" }, { status: 400 });
    }

    let slug = body.slug?.trim()?.toLowerCase();
    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    await connectDB();

    // Check slug uniqueness
    const existing = await Artist.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const parsedGenres = Array.isArray(genres)
      ? genres
      : typeof genres === "string"
      ? genres.split(",").map((g: string) => g.trim()).filter(Boolean)
      : [];

    const artist = await Artist.create({
      name: name.trim(),
      slug,
      bio: bio?.trim() || "",
      genres: parsedGenres,
      image: image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      status: "active",
      createdBy: admin._id,
    });

    await AdminAudit.create({
      adminId: admin._id,
      action: "ARTIST_CREATED",
      resourceType: "artist",
      resourceId: artist._id.toString(),
      details: { name: artist.name, slug: artist.slug },
    });

    return NextResponse.json(
      {
        success: true,
        artist: {
          ...artist.toObject(),
          id: artist._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Admin Artists POST error:", err);
    return NextResponse.json({ error: "Failed to create artist" }, { status: 500 });
  }
}
