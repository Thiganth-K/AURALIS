import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAlbum extends Document {
  title: string;
  slug: string;
  artistId: mongoose.Types.ObjectId;
  artworkUrl: string;
  releaseDate: Date;
  genres: string[];
  description?: string;
  status: "draft" | "published" | "archived";
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
      index: true,
    },
    artworkUrl: { type: String, required: true },
    releaseDate: { type: Date, required: true, index: true },
    genres: [{ type: String }],
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Album: Model<IAlbum> =
  mongoose.models.Album || mongoose.model<IAlbum>("Album", AlbumSchema);

export default Album;
