import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISong extends Document {
  title: string;
  slug: string;
  artistId: mongoose.Types.ObjectId;
  albumId?: mongoose.Types.ObjectId;
  audioUrl: string;
  artworkUrl: string;
  duration: number; // in seconds
  genre: string;
  releaseDate: Date;
  playCount: number;
  explicit: boolean;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, lowercase: true, trim: true, index: true },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
      index: true,
    },
    albumId: {
      type: Schema.Types.ObjectId,
      ref: "Album",
      index: true,
    },
    audioUrl: { type: String, required: true },
    artworkUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    genre: { type: String, required: true, index: true },
    releaseDate: { type: Date, required: true, index: true },
    playCount: { type: Number, default: 0, index: true },
    explicit: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    publishedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Compound indexes for public catalog and fast trending queries
SongSchema.index({ status: 1, playCount: -1, releaseDate: -1 });
SongSchema.index({ status: 1, genre: 1, playCount: -1 });

export const Song: Model<ISong> =
  mongoose.models.Song || mongoose.model<ISong>("Song", SongSchema);

export default Song;
