import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeaturedContent extends Document {
  key: string; // e.g. "home_featured"
  featuredSongId?: mongoose.Types.ObjectId;
  featuredAlbumId?: mongoose.Types.ObjectId;
  featuredArtistId?: mongoose.Types.ObjectId;
  featuredPlaylistId?: mongoose.Types.ObjectId;
  headline?: string;
  subheadline?: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeaturedContentSchema = new Schema<IFeaturedContent>(
  {
    key: { type: String, default: "home_featured", unique: true, index: true },
    featuredSongId: { type: Schema.Types.ObjectId, ref: "Song" },
    featuredAlbumId: { type: Schema.Types.ObjectId, ref: "Album" },
    featuredArtistId: { type: Schema.Types.ObjectId, ref: "Artist" },
    featuredPlaylistId: { type: Schema.Types.ObjectId, ref: "Playlist" },
    headline: { type: String, default: "Editorial Radio • FLAC 24-bit" },
    subheadline: { type: String, default: "Your personalized acoustic stream is tuned to high-fidelity audio." },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const FeaturedContent: Model<IFeaturedContent> =
  mongoose.models.FeaturedContent ||
  mongoose.model<IFeaturedContent>("FeaturedContent", FeaturedContentSchema);

export default FeaturedContent;
