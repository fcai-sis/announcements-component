import { Request, Response } from "express";
import AnnouncementModel, {
  AnnouncementSeverity,
} from "../../data/models/announcement.model";

//TODO: Create middleware to check for if user authorized to update announcement
type UpdateHandlerRequest = Request<
  {
    announcementId: string;
  },
  {},
  {
    title?: string;
    content?: string;
    severity?: AnnouncementSeverity;
    academicLevel?: number;
    department?: string;
  }
>;

const updateAnnouncementHandler = async (
  req: UpdateHandlerRequest,
  res: Response
) => {
  const announcementId = req.params.announcementId;
  // Check if the announcement exists
  const announcement = await AnnouncementModel.findByIdAndUpdate(
    announcementId,
    { ...req.body, updatedAt: Date.now() },
    { new: true }
  );

  if (!announcement) {
    return res.status(404).json({
      error: {
        message: "Announcement not found",
      },
    });
  }

  const response = {
    announcement: {
      _id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      severity: announcement.severity,
      academicLevel: announcement.academicLevel,
      department: announcement.department,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      author: { username: "admin" },
    },
  };

  return res.status(200).json(response);
};

export default updateAnnouncementHandler;
