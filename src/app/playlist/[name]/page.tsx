import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getPlaylistById } from "@/services/playlistService";
import { PlaylistView } from "@/components/playlist/PlaylistView";
import { SongDTO } from "@/types/music";

export const instant = false;

interface PlaylistPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({
  params,
}: PlaylistPageProps): Promise<Metadata> {
  await connection();
  const { name } = await params;
  const playlist = await getPlaylistById(name);

  if (!playlist) {
    return {
      title: "Playlist Not Found — AURALIS",
    };
  }

  return {
    title: `${playlist.name} — Cassette Playlist // AURALIS HI-FI`,
    description:
      playlist.description ||
      `Listen to ${playlist.name} curated audio tape in Studio FLAC 24-bit 96kHz fidelity on Auralis.`,
  };
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  await connection();
  const { name } = await params;

  try {
    const playlist = await getPlaylistById(name);

    if (!playlist) {
      return notFound();
    }

    const songs: SongDTO[] = (playlist.songs || [])
      .map((ps) => ps.song)
      .filter((s): s is SongDTO => Boolean(s));

    return <PlaylistView playlist={playlist} songs={songs} />;
  } catch (error) {
    console.error("Error loading playlist page:", error);
    return notFound();
  }
}

