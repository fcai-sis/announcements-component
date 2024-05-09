import {
  departmentModelName,
  employeeModelName,
} from "@fcai-sis/shared-models";
import mongoose, { InferSchemaType, Schema } from "mongoose";

export const announcementSeverities = ["info", "warning", "danger"] as const;
export type AnnouncementSeverity = (typeof announcementSeverities)[number];
export const announcementAcademicLevels = [1, 2, 3, 4] as const;
export type AnnouncementAcademicLevel =
  (typeof announcementAcademicLevels)[number];

const announcementSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: employeeModelName,
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
  academicLevel: {
    type: Number,
    enum: announcementAcademicLevels,
    default: null,
  },
  department: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: departmentModelName,
      },
    ],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  severity: {
    type: String,
    enum: announcementSeverities,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

export type AnnouncementType = InferSchemaType<typeof announcementSchema>;
// Add TTL (Time To Live) index to 'archived' field
announcementSchema.index({ archived: 1 }, { expireAfterSeconds: 31536000 }); // Delete after a year

export const announcementModelName = "Announcement";

const AnnouncementModel = mongoose.model<AnnouncementType>(
  announcementModelName,
  announcementSchema
);

export default AnnouncementModel;
