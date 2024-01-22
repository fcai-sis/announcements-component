import { userModelName } from "@fcai-sis/shared-models";
import mongoose, { InferSchemaType, Schema } from "mongoose";

const announcementSchema: Schema = new Schema<AnnouncementType>({
  author: {
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
  updatedAt:{
    type: Date,
    default: Date.now(),
  },
  severity: {
    type: String,
    enum: ["info", "warning", "danger"],
    default: "info",
  },
});

const announcementModelName = "Announcements";

const AnnouncementModel = mongoose.model<AnnouncementType>(
  announcementModelName,
  announcementSchema
);
export default AnnouncementModel;

type AnnouncementType = InferSchemaType<typeof announcementSchema>;
