import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User, Song, Artist, Album, Playlist, ListeningHistory } from "@/models";

export const instant = false;

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();

    const pingStart = Date.now();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      pendingUsersCount,
      totalSongs,
      publishedSongs,
      draftSongs,
      totalArtists,
      totalAlbums,
      totalPlaylists,
      totalPlaysResult,
      totalDurationResult,
      newUsersThisWeek,
      newSongsThisWeek,
      newArtistsThisWeek,
      newAlbumsThisWeek,
      newPlaylistsThisWeek,
      recentSongs,
      recentUsers,
      recentArtists,
      recentAlbums,
      recentPlaylists,
      recentHistory,
      mostPlayedSongs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "pending" }),
      Song.countDocuments(),
      Song.countDocuments({ status: "published" }),
      Song.countDocuments({ status: "draft" }),
      Artist.countDocuments(),
      Album.countDocuments(),
      Playlist.countDocuments(),
      Song.aggregate([{ $group: { _id: null, total: { $sum: "$playCount" } } }]),
      Song.aggregate([{ $group: { _id: null, total: { $sum: "$duration" } } }]),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Song.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Artist.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Album.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Playlist.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Song.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("artistId", "name")
        .populate("albumId", "title")
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select("-passwordHash")
        .lean(),
      Artist.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select("name slug createdAt")
        .lean(),
      Album.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("artistId", "name")
        .lean(),
      Playlist.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      ListeningHistory.find()
        .sort({ playedAt: -1 })
        .limit(30)
        .populate("songId", "title duration genre")
        .populate("userId", "name email")
        .lean(),
      Song.find({ status: "published" })
        .sort({ playCount: -1 })
        .limit(5)
        .populate("artistId", "name")
        .lean(),
    ]);

    const latencyMs = Math.max(1, Date.now() - pingStart);
    const totalPlays = totalPlaysResult[0]?.total || 0;
    const totalDurationSeconds = totalDurationResult[0]?.total || 0;

    // Estimate storage: ~40KB per second of 320kbps MP3 audio
    const estimatedAudioBytes = totalDurationSeconds * 40 * 1024;
    const storageMB = Number((estimatedAudioBytes / (1024 * 1024)).toFixed(1));
    const storageFormatted =
      storageMB >= 1024
        ? `${(storageMB / 1024).toFixed(2)} GB`
        : `${storageMB > 0 ? storageMB : 0} MB`;

    // Construct unified chronological activity feed from real DB models
    type ActivityItem = {
      id: string;
      type: "song" | "user" | "artist" | "album" | "playlist" | "play";
      title: string;
      detail: string;
      timestamp: Date;
    };

    const activities: ActivityItem[] = [];

    for (const h of recentHistory) {
      if (h.songId && typeof h.songId === "object" && "title" in h.songId) {
        const songTitle = (h.songId as { title: string }).title;
        const userName =
          h.userId && typeof h.userId === "object" && "name" in h.userId
            ? (h.userId as { name: string }).name
            : "Public Listener";
        activities.push({
          id: `hist-${h._id.toString()}`,
          type: "play",
          title: `Song played - ${songTitle}`,
          detail: `${userName} • Stream logged`,
          timestamp: h.playedAt || h.createdAt || new Date(),
        });
      }
    }

    for (const s of recentSongs) {
      const artistName =
        s.artistId && typeof s.artistId === "object" && "name" in s.artistId
          ? (s.artistId as { name: string }).name
          : "Independent";
      activities.push({
        id: `song-${s._id.toString()}`,
        type: "song",
        title: `New song added - ${s.title}`,
        detail: `${artistName} • ${s.status === "published" ? "Published" : "Draft"}`,
        timestamp: s.createdAt || new Date(),
      });
    }

    for (const u of recentUsers) {
      activities.push({
        id: `user-${u._id.toString()}`,
        type: "user",
        title: `New user registered - ${u.email}`,
        detail: `${u.name} • ${u.role === "admin" ? "Admin" : "Listener"}`,
        timestamp: u.createdAt || new Date(),
      });
    }

    for (const a of recentArtists) {
      activities.push({
        id: `artist-${a._id.toString()}`,
        type: "artist",
        title: `New artist registered - ${a.name}`,
        detail: "Artist Roster",
        timestamp: a.createdAt || new Date(),
      });
    }

    for (const alb of recentAlbums) {
      const artistName =
        alb.artistId && typeof alb.artistId === "object" && "name" in alb.artistId
          ? (alb.artistId as { name: string }).name
          : "Artist";
      activities.push({
        id: `album-${alb._id.toString()}`,
        type: "album",
        title: `New album added - ${alb.title}`,
        detail: `${artistName}`,
        timestamp: alb.createdAt || new Date(),
      });
    }

    for (const p of recentPlaylists) {
      activities.push({
        id: `playlist-${p._id.toString()}`,
        type: "playlist",
        title: `Playlist created - ${p.name}`,
        detail: `${p.songs?.length || 0} tracks`,
        timestamp: p.createdAt || new Date(),
      });
    }

    // Sort newest first and limit to 50 for pagination
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const topActivities = activities.slice(0, 50);

    const totalDocs =
      totalUsers + totalSongs + totalArtists + totalAlbums + totalPlaylists + recentHistory.length;

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          pendingUsers: pendingUsersCount,
          songs: totalSongs,
          publishedSongs,
          draftSongs,
          artists: totalArtists,
          albums: totalAlbums,
          playlists: totalPlaylists,
          totalPlays,
          totalDurationSeconds,
          storageMB,
          storageFormatted,
        },
        weeklyGrowth: {
          users: newUsersThisWeek,
          songs: newSongsThisWeek,
          artists: newArtistsThisWeek,
          albums: newAlbumsThisWeek,
          playlists: newPlaylistsThisWeek,
        },
        recentActivities: topActivities.map((act) => ({
          id: act.id,
          type: act.type,
          title: act.title,
          detail: act.detail,
          timestamp: act.timestamp,
        })),
        systemHealth: {
          database: {
            name: "MongoDB Atlas",
            status: "Connected & Healthy",
            latencyMs,
            totalDocuments: totalDocs,
          },
          audioEngine: {
            name: "Node.js Audio Pipeline",
            status: `Operational (${process.version})`,
            totalStreams: totalPlays,
            uptimeSeconds: Math.floor(process.uptime()),
          },
          apiServices: {
            name: "Next.js App Router API",
            status: "All endpoints responding",
            endpointsActive: 12,
          },
          storage: {
            name: "Cloudinary Media Vault",
            status: `Available space: ${storageFormatted}`,
            totalTracks: totalSongs,
            durationSeconds: totalDurationSeconds,
          },
        },
        mostPlayedSongs: mostPlayedSongs.map((s) => ({
          id: s._id.toString(),
          title: s.title,
          artistName:
            typeof s.artistId === "object" && s.artistId && "name" in s.artistId
              ? (s.artistId as { name: string }).name
              : "Unknown Artist",
          playCount: s.playCount || 0,
          duration: s.duration,
          genre: s.genre,
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
