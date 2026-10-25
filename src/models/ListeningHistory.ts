import mongoose, { Schema, Document, Model } from "mongoose";

export interface IListeningHistory extends Document {
  userId: mongoose.Types.ObjectId;
  songId: mongoose.Types.ObjectId;
  playedAt: Date;
  durationPlayed: number;
  completed: boolean;
  createdAt: Date;
}

const ListeningHistorySchema = new Schema<IListeningHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    songId: {
      type: Schema.Types.ObjectId,
      ref: "Song",
      required: true,
      index: true,
    },
    playedAt: { type: Date, default: Date.now, index: true },
    durationPlayed: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ListeningHistorySchema.index({ userId: 1, playedAt: -1 });
ListeningHistorySchema.index({ songId: 1, playedAt: -1 });

export const ListeningHistory: Model<IListeningHistory> =
  mongoose.models.ListeningHistory ||
  mongoose.model<IListeningHistory>("ListeningHistory", ListeningHistorySchema);

export default ListeningHistory;
