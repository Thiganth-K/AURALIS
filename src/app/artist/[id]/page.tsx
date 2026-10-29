import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getArtistById } from "@/services/artistService";
import { connectToDatabase } from "@/lib/mongodb";
import { Song, Album, Artist } from "@/models";
import { transformSongDocument } from "@/services/songService";
import { transformAlbumDocument } from "@/services/albumService";
import { ArtistDetailClient } from "./ArtistDetailClient";
import mongoose from "mongoose";

export const instant = false;

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const artist = await getArtistById(id);

  if (!artist) {
    return {
      title: "Artist Not Found — AURALIS",
    };
  }

  return {
    title: `${artist.name} — Artist Profile // AURALIS HI-FI`,
    description:
      artist.bio ||
      `Listen to ${artist.name} in studio FLAC 24-bit 96kHz fidelity on Auralis.`,
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  await connection();
  const { id } = await params;

  try {
    const artist = await getArtistById(id);
    if (!artist) return notFound();

    await connectToDatabase();
    const isObjectId = mongoose.Types.ObjectId.isValid(artist.id);
    const artistQuery = isObjectId ? { _id: artist.id } : { slug: artist.slug || id };
    const artistDoc = await Artist.findOne(artistQuery).lean();

    if (!artistDoc) return notFound();

    // Fetch all published songs for this artist
    const songDocs = await Song.find({
      artistId: artistDoc._id,
      status: "published",
    })
      .sort({ playCount: -1, releaseDate: -1 })
      .populate("albumId", "title slug artworkUrl")
      .lean();

    const songs = songDocs.map(transformSongDocument);

    // Fetch albums for this artist
    const albumDocs = await Album.find({ artistId: artistDoc._id })
      .sort({ releaseYear: -1, createdAt: -1 })
      .lean();

    const albums = albumDocs.map(transformAlbumDocument);

    return (
      <ArtistDetailClient
        artist={artist}
        songs={songs}
        albums={albums}
      />
    );
  } catch (err) {
    console.error("Error loading artist page:", err);
    return notFound();
  }
}

