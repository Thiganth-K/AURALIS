import { connectToDatabase } from "@/lib/mongodb";
import { Song, Artist, Album } from "@/models";
import { SongDTO } from "@/types/music";
import { formatTime } from "@/lib/utils";
import mongoose from "mongoose";

// Helper to safely format raw/lean Mongo song document into client-safe SongDTO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformSongDocument(doc: any): SongDTO {
  const artistName =
    doc.artistId && typeof doc.artistId === "object" && doc.artistId.name
      ? doc.artistId.name
      : doc.artistName || "Unknown Artist";

  const artistIdStr =
    doc.artistId && typeof doc.artistId === "object" && doc.artistId._id
      ? doc.artistId._id.toString()
      : doc.artistId
      ? doc.artistId.toString()
      : "";

  const albumTitle =
    doc.albumId && typeof doc.albumId === "object" && doc.albumId.title
      ? doc.albumId.title
      : doc.albumTitle || undefined;

  const albumIdStr =
    doc.albumId && typeof doc.albumId === "object" && doc.albumId._id
      ? doc.albumId._id.toString()
      : doc.albumId
      ? doc.albumId.toString()
      : undefined;

  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    artistId: artistIdStr,
    artistName,
    albumId: albumIdStr,
    albumTitle,
    audioUrl: doc.audioUrl,
    artworkUrl: doc.artworkUrl,
    duration: doc.duration,
    durationFormatted: formatTime(doc.duration),
    genre: doc.genre,
    releaseDate: doc.releaseDate ? new Date(doc.releaseDate).toISOString() : new Date().toISOString(),
    playCount: doc.playCount || 0,
    explicit: doc.explicit || false,
  };
}

export async function getSongs(options: {
  limit?: number;
  genre?: string;
  sort?: "trending" | "recent";
} = {}): Promise<SongDTO[]> {
  await connectToDatabase();
  // Ensure related models are registered
  void Artist;
  void Album;

  const query: Record<string, unknown> = { status: "published" };
  if (options.genre) {
    query.genre = { $regex: new RegExp(`^${options.genre}$`, "i") };
  }

  let sortOption: Record<string, mongoose.SortOrder> = { createdAt: -1 };
  if (options.sort === "trending") {
    sortOption = { playCount: -1, releaseDate: -1 };
  } else if (options.sort === "recent") {
    sortOption = { releaseDate: -1 };
  }

  const limit = options.limit && options.limit > 0 ? options.limit : 50;

  const docs = await Song.find(query)
    .sort(sortOption)
    .limit(limit)
    .populate("artistId", "name slug image")
    .populate("albumId", "title slug artworkUrl")
    .lean();

  return docs.map(transformSongDocument);
}

export async function getSongById(id: string): Promise<SongDTO | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectToDatabase();
  void Artist;
  void Album;

  const doc = await Song.findById(id)
    .populate("artistId", "name slug image")
    .populate("albumId", "title slug artworkUrl")
    .lean();

  if (!doc) return null;
  return transformSongDocument(doc);
}

export async function getTrendingSongs(limit = 10): Promise<SongDTO[]> {
  return getSongs({ limit, sort: "trending" });
}

export async function getRecentlyPlayedSongs(limit = 10): Promise<SongDTO[]> {
  return getSongs({ limit, sort: "recent" });
}

export async function searchSongs(searchQuery: string, limit = 10): Promise<SongDTO[]> {
  if (!searchQuery || searchQuery.trim().length === 0) return [];
  await connectToDatabase();
  void Artist;
  void Album;

  const regex = new RegExp(searchQuery.trim(), "i");
  const docs = await Song.find({
    status: "published",
    $or: [{ title: regex }, { genre: regex }],
  })
    .sort({ playCount: -1 })
    .limit(limit)
    .populate("artistId", "name slug")
    .populate("albumId", "title slug")
    .lean();

  return docs.map(transformSongDocument);
}

export async function incrementPlayCount(songId: string): Promise<SongDTO | null> {
  if (!mongoose.Types.ObjectId.isValid(songId)) {
    return null;
  }

  await connectToDatabase();
  void Artist;
  void Album;

  const updatedDoc = await Song.findByIdAndUpdate(
    songId,
    { $inc: { playCount: 1 } },
    { new: true }
  )
    .populate("artistId", "name slug")
    .populate("albumId", "title slug")
    .lean();

  if (!updatedDoc) return null;
  return transformSongDocument(updatedDoc);
}
