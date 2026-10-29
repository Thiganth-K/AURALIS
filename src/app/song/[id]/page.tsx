import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getSongById, getTrendingSongs } from "@/services/songService";
import { SongDeckView } from "@/components/song/SongDeckView";

export const instant = false;

interface SongPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SongPageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const song = await getSongById(id);

  if (!song) {
    return {
      title: "Song Not Found — AURALIS",
    };
  }

  return {
    title: `${song.title} — ${song.artistName} // AURALIS HI-FI`,
    description: `Listen to ${song.title} by ${song.artistName} in Studio FLAC 24-bit 96kHz fidelity on Auralis.`,
  };
}

export default async function SongPage({ params }: SongPageProps) {
  await connection();
  const { id } = await params;
  try {
    const song = await getSongById(id);
    if (!song) {
      return notFound();
    }
    const trendingSongs = await getTrendingSongs(15);
    return <SongDeckView song={song} playlistContext={trendingSongs} />;
  } catch {
    return notFound();
  }
}
