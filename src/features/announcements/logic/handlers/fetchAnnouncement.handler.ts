import { Request, Response } from "express";
import AnnouncementModel from "../../../announcements/data/models/announcement.model";

type HandlerRequest = Request<
  {
    announcementId: string;
  },
  {},
  {}
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const announcementId = req.params.announcementId;

  // find the announcement
  const announcement = await AnnouncementModel.findById(announcementId);

  if (!announcement) {
    return res.status(404).json({
      error: {
        message: "Announcement not found",
      },
    });
  }

  return res.status(200).send({
    announcement: {
      ...announcement.toObject(),
    },
  });
};

const fetchAnnouncementHandler = handler;
export default fetchAnnouncementHandler;
