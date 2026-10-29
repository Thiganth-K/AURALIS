import { connectToDatabase } from "@/lib/mongodb";
import { Artist, Song } from "@/models";
import { ArtistDTO } from "@/types/music";
import { transformSongDocument } from "./songService";
import mongoose from "mongoose";

// Format follower count e.g. 1200000 -> "1.2M", 480000 -> "480K"
function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${Math.round(count / 1_000)}K`;
  }
  return String(count);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformArtistDocument(doc: any): ArtistDTO {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    image: doc.image,
    bio: doc.bio || "",
    genres: doc.genres || [],
    followerCount: doc.followerCount || 0,
    followersFormatted: formatFollowers(doc.followerCount || 0),
  };
}

export async function getArtists(limit = 20): Promise<ArtistDTO[]> {
  await connectToDatabase();
  const docs = await Artist.find().sort({ followerCount: -1 }).limit(limit).lean();
  return docs.map(transformArtistDocument);
}

export async function getFeaturedArtists(limit = 8): Promise<ArtistDTO[]> {
  return getArtists(limit);
}

export async function getArtistById(idOrSlug: string): Promise<ArtistDTO | null> {
  await connectToDatabase();
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);

  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
  const doc = await Artist.findOne(query).lean();
  if (!doc) return null;

  const artistDTO = transformArtistDocument(doc);

  // Fetch top 10 songs for this artist
  const songs = await Song.find({ artistId: doc._id, status: "published" })
    .sort({ playCount: -1 })
    .limit(10)
    .populate("artistId", "name slug image")
    .populate("albumId", "title slug artworkUrl")
    .lean();

  artistDTO.popularSongs = songs.map(transformSongDocument);
  return artistDTO;
}

export async function searchArtists(query: string, limit = 10): Promise<ArtistDTO[]> {
  if (!query || query.trim().length === 0) return [];
  await connectToDatabase();

  const regex = new RegExp(query.trim(), "i");
  const docs = await Artist.find({
    $or: [{ name: regex }, { genres: regex }],
  })
    .sort({ followerCount: -1 })
    .limit(limit)
    .lean();

  return docs.map(transformArtistDocument);
}
