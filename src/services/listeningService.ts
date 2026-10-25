import { connectToDatabase } from "@/lib/mongodb";
import { ListeningHistory, User, Song, Artist, Album } from "@/models";
import { ListeningHistoryDTO } from "@/types/music";
import { transformSongDocument } from "./songService";
import mongoose from "mongoose";

export async function recordListening(
  userId: string,
  songId: string,
  durationPlayed: number,
  completed = false
): Promise<ListeningHistoryDTO | null> {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(songId)) {
    return null;
  }

  await connectToDatabase();

  const record = await ListeningHistory.create({
    userId: new mongoose.Types.ObjectId(userId),
    songId: new mongoose.Types.ObjectId(songId),
    durationPlayed,
    completed,
    playedAt: new Date(),
  });

  // Also update User.recentlyPlayed
  await User.findByIdAndUpdate(userId, {
    $push: {
      recentlyPlayed: {
        $each: [{ songId: new mongoose.Types.ObjectId(songId), playedAt: new Date() }],
        $position: 0,
        $slice: 50, // Keep last 50
      },
    },
  });

  return {
    id: record._id.toString(),
    userId,
    songId,
    playedAt: record.playedAt.toISOString(),
    durationPlayed: record.durationPlayed,
    completed: record.completed,
  };
}

export async function getRecentlyPlayed(
  userId: string,
  limit = 20
): Promise<ListeningHistoryDTO[]> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }

  await connectToDatabase();
  void Song;
  void Artist;
  void Album;

  const records = await ListeningHistory.find({ userId })
    .sort({ playedAt: -1 })
    .limit(limit)
    .populate({
      path: "songId",
      populate: [
        { path: "artistId", select: "name slug image" },
        { path: "albumId", select: "title slug artworkUrl" },
      ],
    })
    .lean();

  return records.map((r) => ({
    id: r._id.toString(),
    userId: r.userId.toString(),
    songId: r.songId?._id ? r.songId._id.toString() : r.songId.toString(),
    playedAt: r.playedAt.toISOString(),
    durationPlayed: r.durationPlayed,
    completed: r.completed,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    song: r.songId && typeof r.songId === "object" ? transformSongDocument(r.songId as any) : undefined,
  }));
}
