import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminAudit extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  resourceType: "song" | "artist" | "album" | "user" | "playlist" | "featured";
  resourceId?: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const AdminAuditSchema = new Schema<IAdminAudit>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, index: true },
    resourceType: {
      type: String,
      enum: ["song", "artist", "album", "user", "playlist", "featured"],
      required: true,
      index: true,
    },
    resourceId: { type: String, index: true },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AdminAudit: Model<IAdminAudit> =
  mongoose.models.AdminAudit ||
  mongoose.model<IAdminAudit>("AdminAudit", AdminAuditSchema);

export default AdminAudit;
