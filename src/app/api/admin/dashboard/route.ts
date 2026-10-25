import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User, Song, Artist, Album, Playlist, ListeningHistory } from "@/models";

export const instant = false;

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();

    const [
      totalUsers,
      totalSongs,
      totalArtists,
      totalAlbums,
      totalPlaylists,
      totalPlaysResult,
      recentlyAddedSongs,
      recentlyRegisteredUsers,
      mostPlayedSongs,
    ] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Artist.countDocuments(),
      Album.countDocuments(),
      Playlist.countDocuments(),
      Song.aggregate([{ $group: { _id: null, total: { $sum: "$playCount" } } }]),
      Song.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("artistId", "name")
        .populate("albumId", "title")
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-passwordHash")
        .lean(),
      Song.find({ status: "published" })
        .sort({ playCount: -1 })
        .limit(5)
        .populate("artistId", "name")
        .lean(),
    ]);

    const totalPlays = totalPlaysResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalSongs,
          totalArtists,
          totalAlbums,
          totalPlaylists,
          totalPlays,
        },
        recentlyAddedSongs: recentlyAddedSongs.map((s) => ({
          id: s._id.toString(),
          title: s.title,
          artistName: typeof s.artistId === "object" && s.artistId && "name" in s.artistId ? s.artistId.name : "Unknown",
          albumTitle: typeof s.albumId === "object" && s.albumId && "title" in s.albumId ? s.albumId.title : undefined,
          status: s.status,
          playCount: s.playCount,
          createdAt: s.createdAt,
        })),
        recentlyRegisteredUsers: recentlyRegisteredUsers.map((u) => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
        })),
        mostPlayedSongs: mostPlayedSongs.map((s) => ({
          id: s._id.toString(),
          title: s.title,
          artistName: typeof s.artistId === "object" && s.artistId && "name" in s.artistId ? s.artistId.name : "Unknown",
          playCount: s.playCount,
          duration: s.duration,
        })),
      },
    });
  } catch (error) {
    const isForbidden = error instanceof Error && error.message === "FORBIDDEN";
    const isUnauthorized = error instanceof Error && error.message === "UNAUTHORIZED";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isForbidden ? "FORBIDDEN" : isUnauthorized ? "UNAUTHORIZED" : "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to load admin dashboard",
        },
      },
      { status: isForbidden ? 403 : isUnauthorized ? 401 : 500 }
    );
  }
}
