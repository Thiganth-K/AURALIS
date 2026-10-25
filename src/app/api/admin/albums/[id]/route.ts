import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Album, Song, AdminAudit } from "@/models";
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
    const album = await Album.findById(id).populate("artistId", "name slug image").lean();
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const songs = await Song.find({ albumId: id }).lean();

    return NextResponse.json({
      success: true,
      album: {
        ...album,
        id: album._id.toString(),
        artist: album.artistId,
        songs,
      },
    });
  } catch (err: unknown) {
    console.error("Admin Album GET [id] error:", err);
    return NextResponse.json({ error: "Failed to fetch album" }, { status: 500 });
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

    const album = await Album.findById(id);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    if (body.title) album.title = body.title.trim();
    if (body.artistId) album.artistId = body.artistId;
    if (body.artworkUrl) album.artworkUrl = body.artworkUrl;
    if (body.releaseDate) album.releaseDate = new Date(body.releaseDate);
    if (body.description !== undefined) album.description = body.description.trim();
    if (body.status) album.status = body.status;
    if (body.genres) {
      album.genres = Array.isArray(body.genres)
        ? body.genres
        : body.genres.split(",").map((g: string) => g.trim()).filter(Boolean);
    }

    await album.save();

    await AdminAudit.create({
      adminId: admin._id,
      action: "ALBUM_UPDATED",
      resourceType: "album",
      resourceId: album._id.toString(),
      details: body,
    });

    return NextResponse.json({
      success: true,
      album: {
        ...album.toObject(),
        id: album._id.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("Admin Album PATCH [id] error:", err);
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
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

    const album = await Album.findByIdAndDelete(id);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    // Detach songs from deleted album
    await Song.updateMany({ albumId: id }, { $unset: { albumId: "" } });

    await AdminAudit.create({
      adminId: admin._id,
      action: "ALBUM_DELETED",
      resourceType: "album",
      resourceId: id,
      details: { title: album.title },
    });

    return NextResponse.json({ success: true, message: "Album deleted successfully" });
  } catch (err: unknown) {
    console.error("Admin Album DELETE [id] error:", err);
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
  }
}
