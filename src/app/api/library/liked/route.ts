import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, Song } from "@/models";
import { requireAuth } from "@/lib/auth";
import { transformSongDocument } from "@/services/songService";

export const instant = false;

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    await connectDB();
    const userDoc = await User.findById(user._id).lean();
    if (!userDoc || !userDoc.likedSongs || userDoc.likedSongs.length === 0) {
      return NextResponse.json({ success: true, songs: [], ids: [] });
    }

    const songs = await Song.find({
      _id: { $in: userDoc.likedSongs },
      status: "published",
    })
      .populate("artistId", "name slug image")
      .populate("albumId", "title slug artworkUrl")
      .lean();

    return NextResponse.json({
      success: true,
      songs: songs.map(transformSongDocument),
      ids: userDoc.likedSongs.map((id) => id.toString()),
    });
  } catch (err: unknown) {
    console.error("Library Liked GET error:", err);
    return NextResponse.json({ error: "Failed to fetch liked songs" }, { status: 500 });
  }
}
