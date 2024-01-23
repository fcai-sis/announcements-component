import { userModelName } from "@fcai-sis/shared-models";
import mongoose, { InferSchemaType, Schema } from "mongoose";

export const announcementSeverities = ["info", "warning", "danger"] as const;
export type AnnouncementSeverity = typeof announcementSeverities[number];

const announcementSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: userModelName,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  severity: {
    type: String,
    enum: announcementSeverities,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  }
});

export type AnnouncementType = InferSchemaType<typeof announcementSchema>;

export const announcementModelName = "Announcement";

const AnnouncementModel = mongoose.model<AnnouncementType>(
  announcementModelName,
  announcementSchema
);

export default AnnouncementModel;
