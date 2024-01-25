import { Request, Response } from "express";

import AnnouncementModel from "../../data/models/announcement.model";

type HandlerRequest = Request<{ announcementId: string }>;

/*
 * Deletes an announcement.
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const announcement = req.params.announcementId;

  const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(
    announcement
  );

  if (!deletedAnnouncement) {
    return res.status(404).send({
      error: {
        message: "Announcement not found",
      },
    });
  }

  return res.status(202).send({
    data: deletedAnnouncement,
    message: "Announcement deleted successfully",
  });
};

const deleteAnnouncementHandler = handler;
export default deleteAnnouncementHandler;
