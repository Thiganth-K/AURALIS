import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Artist, Album, Song, AdminAudit } from "@/models";
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
    const artist = await Artist.findById(id).lean();
    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const [albums, songs] = await Promise.all([
      Album.find({ artistId: id }).lean(),
      Song.find({ artistId: id }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      artist: {
        ...artist,
        id: artist._id.toString(),
        albums,
        songs,
      },
    });
  } catch (err: unknown) {
    console.error("Admin Artist GET [id] error:", err);
    return NextResponse.json({ error: "Failed to fetch artist" }, { status: 500 });
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

    const artist = await Artist.findById(id);
    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    if (body.name) artist.name = body.name.trim();
    if (body.bio !== undefined) artist.bio = body.bio.trim();
    if (body.image) artist.image = body.image;
    if (body.status) artist.status = body.status;
    if (body.genres) {
      artist.genres = Array.isArray(body.genres)
        ? body.genres
        : body.genres.split(",").map((g: string) => g.trim()).filter(Boolean);
    }

    await artist.save();

    await AdminAudit.create({
      adminId: admin._id,
      action: "ARTIST_UPDATED",
      resourceType: "artist",
      resourceId: artist._id.toString(),
      details: body,
    });

    return NextResponse.json({
      success: true,
      artist: {
        ...artist.toObject(),
        id: artist._id.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("Admin Artist PATCH [id] error:", err);
    return NextResponse.json({ error: "Failed to update artist" }, { status: 500 });
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

    const artist = await Artist.findByIdAndDelete(id);
    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    await AdminAudit.create({
      adminId: admin._id,
      action: "ARTIST_DELETED",
      resourceType: "artist",
      resourceId: id,
      details: { name: artist.name },
    });

    return NextResponse.json({ success: true, message: "Artist deleted successfully" });
  } catch (err: unknown) {
    console.error("Admin Artist DELETE [id] error:", err);
    return NextResponse.json({ error: "Failed to delete artist" }, { status: 500 });
  }
}
