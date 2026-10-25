import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Song, AdminAudit } from "@/models";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export async function POST(
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

    const song = await Song.findById(id);
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    song.status = "published";
    song.publishedAt = new Date();
    await song.save();

    await AdminAudit.create({
      adminId: admin._id,
      action: "SONG_PUBLISHED",
      resourceType: "song",
      resourceId: song._id.toString(),
      details: { title: song.title },
    });

    return NextResponse.json({
      success: true,
      message: "Song published successfully",
      song: {
        id: song._id.toString(),
        title: song.title,
        status: song.status,
        publishedAt: song.publishedAt,
      },
    });
  } catch (err: unknown) {
    console.error("Admin Publish Song error:", err);
    return NextResponse.json({ error: "Failed to publish song" }, { status: 500 });
  }
}
