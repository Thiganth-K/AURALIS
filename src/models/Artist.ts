import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArtist extends Document {
  name: string;
  slug: string;
  image: string;
  bio: string;
  genres: string[];
  followerCount: number;
  status: "active" | "archived";
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
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
    image: { type: String, required: true },
    bio: { type: String, default: "" },
    genres: [{ type: String, index: true }],
    followerCount: { type: Number, default: 0 },
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

export const Artist: Model<IArtist> =
  mongoose.models.Artist || mongoose.model<IArtist>("Artist", ArtistSchema);

export default Artist;
