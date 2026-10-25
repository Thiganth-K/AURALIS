import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeaturedContent, Song, Album, Artist, Playlist, AdminAudit } from "@/models";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export async function GET(req: NextRequest) {
  try {
    // Both admin and public can read, but admin check provides editing context if needed
    await connectDB();
    let featured = await FeaturedContent.findOne({ key: "home_featured" })
      .populate({
        path: "featuredSongId",
        populate: { path: "artistId", select: "name slug image" },
      })
      .populate({
        path: "featuredAlbumId",
        populate: { path: "artistId", select: "name slug image" },
      })
      .populate("featuredArtistId")
      .populate("featuredPlaylistId")
      .lean();

    if (!featured) {
      // Create initial featured doc if doesn't exist yet
      const sampleSong = await Song.findOne({ status: "published" }).lean();
      const sampleAlbum = await Album.findOne().lean();
      const sampleArtist = await Artist.findOne().lean();
      const samplePlaylist = await Playlist.findOne().lean();

      featured = await FeaturedContent.create({
        key: "home_featured",
        featuredSongId: sampleSong?._id,
        featuredAlbumId: sampleAlbum?._id,
        featuredArtistId: sampleArtist?._id,
        featuredPlaylistId: samplePlaylist?._id,
        headline: "Editorial Radio • FLAC 24-bit",
        subheadline: "Curated high-fidelity acoustic streams from verified AURALIS artists.",
      });
    }

    return NextResponse.json({ success: true, featured });
  } catch (err: unknown) {
    console.error("Featured Content GET error:", err);
    return NextResponse.json({ error: "Failed to fetch featured content" }, { status: 500 });
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
      featuredSongId,
      featuredAlbumId,
      featuredArtistId,
      featuredPlaylistId,
      headline,
      subheadline,
    } = body;

    await connectDB();

    const featured = await FeaturedContent.findOneAndUpdate(
      { key: "home_featured" },
      {
        $set: {
          featuredSongId: featuredSongId || undefined,
          featuredAlbumId: featuredAlbumId || undefined,
          featuredArtistId: featuredArtistId || undefined,
          featuredPlaylistId: featuredPlaylistId || undefined,
          headline: headline?.trim() || "Editorial Radio • FLAC 24-bit",
          subheadline: subheadline?.trim() || "Curated high-fidelity acoustic streams from verified AURALIS artists.",
          updatedBy: admin._id,
        },
      },
      { upsert: true, new: true }
    )
      .populate({
        path: "featuredSongId",
        populate: { path: "artistId", select: "name slug image" },
      })
      .populate("featuredAlbumId")
      .populate("featuredArtistId")
      .populate("featuredPlaylistId");

    await AdminAudit.create({
      adminId: admin._id,
      action: "FEATURED_UPDATED",
      resourceType: "featured",
      resourceId: featured._id.toString(),
      details: body,
    });

    return NextResponse.json({ success: true, featured });
  } catch (err: unknown) {
    console.error("Featured Content POST error:", err);
    return NextResponse.json({ error: "Failed to update featured content" }, { status: 500 });
  }
}
