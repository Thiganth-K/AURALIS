import { connectToDatabase } from "@/lib/mongodb";
import { Album, Artist, Song } from "@/models";
import { AlbumDTO } from "@/types/music";
import { transformSongDocument } from "./songService";
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformAlbumDocument(doc: any): AlbumDTO {
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

  const releaseDateObj = doc.releaseDate ? new Date(doc.releaseDate) : new Date();

  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    artistId: artistIdStr,
    artistName,
    artworkUrl: doc.artworkUrl,
    releaseDate: releaseDateObj.toISOString(),
    releaseYear: releaseDateObj.getFullYear(),
    genres: doc.genres || [],
    description: doc.description || "",
    songCount: doc.songCount || 0,
  };
}

export async function getAlbums(limit = 20): Promise<AlbumDTO[]> {
  await connectToDatabase();
  void Artist;

  const docs = await Album.find()
    .sort({ releaseDate: -1 })
    .limit(limit)
    .populate("artistId", "name slug")
    .lean();

  // Compute track count per album
  const albumsWithCount = await Promise.all(
    docs.map(async (albumDoc) => {
      const count = await Song.countDocuments({ albumId: albumDoc._id, status: "published" });
      const transformed = transformAlbumDocument(albumDoc);
      transformed.songCount = count;
      return transformed;
    })
  );

  return albumsWithCount;
}

export async function getNewReleases(limit = 6): Promise<AlbumDTO[]> {
  return getAlbums(limit);
}

export async function getAlbumById(idOrSlug: string): Promise<AlbumDTO | null> {
  await connectToDatabase();
  void Artist;

  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const doc = await Album.findOne(query)
    .populate("artistId", "name slug image")
    .lean();

  if (!doc) return null;

  const transformed = transformAlbumDocument(doc);

  // Fetch tracklist
  const songs = await Song.find({ albumId: doc._id, status: "published" })
    .sort({ createdAt: 1 })
    .populate("artistId", "name slug")
    .lean();

  transformed.songs = songs.map(transformSongDocument);
  transformed.songCount = songs.length;

  return transformed;
}

export async function searchAlbums(query: string, limit = 10): Promise<AlbumDTO[]> {
  if (!query || query.trim().length === 0) return [];
  await connectToDatabase();
  void Artist;

  const regex = new RegExp(query.trim(), "i");
  const docs = await Album.find({
    $or: [{ title: regex }, { genres: regex }],
  })
    .sort({ releaseDate: -1 })
    .limit(limit)
    .populate("artistId", "name slug")
    .lean();

  return docs.map(transformAlbumDocument);
}
