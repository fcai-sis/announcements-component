import { AnnouncementModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ announcementId: string }>;

/**
 * Deletes an announcement.
 */
const deleteAnnouncementHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(
    req.params.announcementId
  ).populate({
    path: "author",
    select: "fullName -_id",
  });

  if (!deletedAnnouncement) {
    return res.status(404).send({
      error: {
        message: "Announcement not found",
      },
    });
  }

  return res.status(204).json({
    announcement: {
      ...deletedAnnouncement,
      __v: undefined,
    },
    message: "Announcement deleted successfully",
  });
};

export default deleteAnnouncementHandler;
