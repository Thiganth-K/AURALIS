import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Song, ListeningHistory, User } from "@/models";
import { getSessionUser } from "@/lib/auth";
import { transformSongDocument } from "@/services/songService";
import mongoose from "mongoose";

export const instant = false;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_ID", message: "Invalid song ID" } },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. Confirm published song & 3. Increment play count
    const updatedSong = await Song.findOneAndUpdate(
      { _id: id, status: "published" },
      { $inc: { playCount: 1 } },
      { new: true }
    )
      .populate("artistId", "name slug image")
      .populate("albumId", "title slug artworkUrl")
      .lean();

    if (!updatedSong) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND_OR_UNPUBLISHED",
            message: "Song not found or not published",
          },
        },
        { status: 404 }
      );
    }

    // 4. Record listening history if user is authenticated
    const sessionUser = await getSessionUser(request);
    if (sessionUser) {
      const playedAt = new Date();
      await Promise.all([
        ListeningHistory.create({
          userId: sessionUser._id,
          songId: updatedSong._id,
          playedAt,
          durationPlayed: 0,
          completed: false,
        }),
        User.findByIdAndUpdate(sessionUser._id, {
          $push: {
            recentlyPlayed: {
              $each: [{ songId: updatedSong._id, playedAt }],
              $position: 0,
              $slice: 50,
            },
          },
        }),
      ]);
    }

    // 5. Return success
    return NextResponse.json({
      success: true,
      data: transformSongDocument(updatedSong),
    });
  } catch (error) {
    console.error("API POST /api/songs/[id]/play error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Failed to record play",
        },
      },
      { status: 500 }
    );
  }
}
