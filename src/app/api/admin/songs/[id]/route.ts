import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Song, Album, Artist, AdminAudit } from "@/models";
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

    const song = await Song.findById(id)
      .populate("artistId", "name slug image")
      .populate("albumId", "title slug artworkUrl")
      .lean();

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      song: {
        ...song,
        id: song._id.toString(),
        artist: song.artistId,
        album: song.albumId,
      },
    });
  } catch (err: unknown) {
    console.error("Admin Song GET [id] error:", err);
    return NextResponse.json({ error: "Failed to fetch song" }, { status: 500 });
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

    const song = await Song.findById(id);
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const prevStatus = song.status;

    if (body.title) song.title = body.title.trim();
    if (body.artistId) {
      const art = await Artist.findById(body.artistId);
      if (art) song.artistId = art._id;
    }
    if (body.albumId !== undefined) {
      if (body.albumId) {
        const alb = await Album.findById(body.albumId);
        if (alb) song.albumId = alb._id;
      } else {
        song.albumId = undefined;
      }
    }
    if (body.audioUrl) song.audioUrl = body.audioUrl.trim();
    if (body.artworkUrl) song.artworkUrl = body.artworkUrl.trim();
    if (body.duration !== undefined) song.duration = Number(body.duration);
    if (body.genre) song.genre = body.genre.trim();
    if (body.releaseDate) song.releaseDate = new Date(body.releaseDate);
    if (body.explicit !== undefined) song.explicit = Boolean(body.explicit);

    if (body.status && ["draft", "published", "archived"].includes(body.status)) {
      song.status = body.status;
      if (body.status === "published" && prevStatus !== "published") {
        song.publishedAt = new Date();
      }
    }

    await song.save();

    const action =
      body.status === "published" && prevStatus !== "published"
        ? "SONG_PUBLISHED"
        : body.status === "archived" && prevStatus !== "archived"
        ? "SONG_ARCHIVED"
        : "SONG_UPDATED";

    await AdminAudit.create({
      adminId: admin._id,
      action,
      resourceType: "song",
      resourceId: song._id.toString(),
      details: body,
    });

    return NextResponse.json({
      success: true,
      song: {
        ...song.toObject(),
        id: song._id.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("Admin Song PATCH [id] error:", err);
    return NextResponse.json({ error: "Failed to update song" }, { status: 500 });
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

    const song = await Song.findByIdAndDelete(id);
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    await AdminAudit.create({
      adminId: admin._id,
      action: "SONG_DELETED",
      resourceType: "song",
      resourceId: id,
      details: { title: song.title },
    });

    return NextResponse.json({ success: true, message: "Song deleted successfully" });
  } catch (err: unknown) {
    console.error("Admin Song DELETE [id] error:", err);
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
