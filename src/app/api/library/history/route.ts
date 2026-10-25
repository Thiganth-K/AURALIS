import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ListeningHistory, User, Song } from "@/models";
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
    const history = await ListeningHistory.find({ userId: user._id })
      .sort({ playedAt: -1 })
      .limit(30)
      .populate({
        path: "songId",
        populate: [
          { path: "artistId", select: "name slug image" },
          { path: "albumId", select: "title slug artworkUrl" },
        ],
      })
      .lean();

    const formatted = history
      .filter((h) => h.songId)
      .map((h) => ({
        id: h._id.toString(),
        playedAt: h.playedAt,
        durationPlayed: h.durationPlayed,
        completed: h.completed,
        song: transformSongDocument(h.songId),
      }));

    return NextResponse.json({ success: true, history: formatted });
  } catch (err: unknown) {
    console.error("Library History GET error:", err);
    return NextResponse.json({ error: "Failed to fetch listening history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    const body = await req.json();
    const { songId, durationPlayed, completed } = body;

    if (!songId) {
      return NextResponse.json({ error: "songId is required" }, { status: 400 });
    }

    await connectDB();

    const song = await Song.findById(songId);
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const playedAt = new Date();

    // 1. Create ListeningHistory document
    const historyItem = await ListeningHistory.create({
      userId: user._id,
      songId: song._id,
      playedAt,
      durationPlayed: durationPlayed ? Number(durationPlayed) : 0,
      completed: Boolean(completed),
    });

    // 2. Increment song play count
    await Song.findByIdAndUpdate(song._id, { $inc: { playCount: 1 } });

    // 3. Update user recentlyPlayed
    await User.findByIdAndUpdate(user._id, {
      $push: {
        recentlyPlayed: {
          $each: [{ songId: song._id, playedAt }],
          $position: 0,
          $slice: 50,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        historyId: historyItem._id.toString(),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Library History POST error:", err);
    return NextResponse.json({ error: "Failed to record listening history" }, { status: 500 });
  }
}
