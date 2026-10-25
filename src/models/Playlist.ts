import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlaylistSong {
  songId: mongoose.Types.ObjectId;
  position: number;
}

export interface IPlaylist extends Document {
  name: string;
  slug: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  artworkUrl: string;
  songs: IPlaylistSong[];
  isPublic: boolean;
  isCurated: boolean;
  status: "active" | "archived";
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSongSchema = new Schema<IPlaylistSong>(
  {
    songId: {
      type: Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const PlaylistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, default: "" },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    artworkUrl: { type: String, default: "" },
    songs: [PlaylistSongSchema],
    isPublic: { type: Boolean, default: true, index: true },
    isCurated: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Playlist: Model<IPlaylist> =
  mongoose.models.Playlist ||
  mongoose.model<IPlaylist>("Playlist", PlaylistSchema);

export default Playlist;
