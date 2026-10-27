import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  likedSongs: mongoose.Types.ObjectId[];
  followedArtists: mongoose.Types.ObjectId[];
  recentlyPlayed: {
    songId: mongoose.Types.ObjectId;
    playedAt: Date;
  }[];
  role: "user" | "admin";
  status: "active" | "suspended" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    likedSongs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
    followedArtists: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    recentlyPlayed: [
      {
        songId: { type: Schema.Types.ObjectId, ref: "Song", required: true },
        playedAt: { type: Date, default: Date.now },
      },
    ],
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    status: {
      type: String,
      enum: ["active", "suspended", "pending", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
