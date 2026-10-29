import { connectToDatabase } from "@/lib/mongodb";
import { Playlist, User, Song, Artist, Album } from "@/models";
import { PlaylistDTO } from "@/types/music";
import { transformSongDocument } from "./songService";
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPlaylistDocument(doc: any): PlaylistDTO {
  const ownerName =
    doc.ownerId && typeof doc.ownerId === "object" && doc.ownerId.name
      ? doc.ownerId.name
      : "AURALIS";

  const ownerIdStr =
    doc.ownerId && typeof doc.ownerId === "object" && doc.ownerId._id
      ? doc.ownerId._id.toString()
      : doc.ownerId
      ? doc.ownerId.toString()
      : "";

  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || "",
    ownerId: ownerIdStr,
    ownerName,
    artworkUrl: doc.artworkUrl || "",
    songCount: doc.songs ? doc.songs.length : 0,
    isPublic: doc.isPublic ?? true,
    isCurated: doc.isCurated ?? false,
  };
}

export async function getPlaylists(limit = 20): Promise<PlaylistDTO[]> {
  await connectToDatabase();
  void User;

  const docs = await Playlist.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("ownerId", "name avatar")
    .lean();

  return docs.map(transformPlaylistDocument);
}

export async function getPublicPlaylists(limit = 10): Promise<PlaylistDTO[]> {
  await connectToDatabase();
  void User;

  const docs = await Playlist.find({ isPublic: true })
    .sort({ isCurated: -1, createdAt: -1 })
    .limit(limit)
    .populate("ownerId", "name avatar")
    .lean();

  return docs.map(transformPlaylistDocument);
}

export async function getPlaylistById(idOrSlug: string): Promise<PlaylistDTO | null> {
  await connectToDatabase();
  void User;
  void Song;
  void Artist;
  void Album;

  const raw = idOrSlug ? decodeURIComponent(idOrSlug).trim() : "";
  if (!raw) return null;

  const isObjectId = mongoose.Types.ObjectId.isValid(raw);
  const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const slugVariant = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const queryConditions: Record<string, unknown>[] = [
    { slug: raw.toLowerCase() },
    { slug: slugVariant },
    { name: new RegExp(`^${escaped}$`, "i") },
  ];
  if (isObjectId) {
    queryConditions.unshift({ _id: raw });
  }

  const doc = await Playlist.findOne({ $or: queryConditions })
    .populate("ownerId", "name avatar")
    .populate({
      path: "songs.songId",
      populate: [
        { path: "artistId", select: "name slug image" },
        { path: "albumId", select: "title slug artworkUrl" },
      ],
    })
    .lean();

  if (!doc) return null;

  const transformed = transformPlaylistDocument(doc);

  if (doc.songs && doc.songs.length > 0) {
    transformed.songs = doc.songs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => a.position - b.position)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        songId: item.songId?._id?.toString() || item.songId?.toString(),
        position: item.position,
        song: item.songId && typeof item.songId === "object" ? transformSongDocument(item.songId) : undefined,
      }));
  }

  return transformed;
}

export async function searchPlaylists(query: string, limit = 10): Promise<PlaylistDTO[]> {
  if (!query || query.trim().length === 0) return [];
  await connectToDatabase();
  void User;

  const regex = new RegExp(query.trim(), "i");
  const docs = await Playlist.find({
    isPublic: true,
    $or: [{ name: regex }, { description: regex }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("ownerId", "name avatar")
    .lean();

  return docs.map(transformPlaylistDocument);
}
