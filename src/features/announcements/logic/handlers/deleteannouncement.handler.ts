import { Request, Response } from "express";
import AnnouncementModel from "../../data/models/announcement.model";

type HandlerRequest = Request<
  {},
  {},
  {
    id: string;
  }
>;

/*
 * Deletes an announcement.
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const announcement = req.body.id;

  const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(
    announcement
  );

  if (!deletedAnnouncement) {
    return res.status(404).send({
      error: "Announcement not found",
    });
  }

  return res.status(200).send({
    data: deletedAnnouncement,
    message: "Announcement deleted successfully",
  });
};

export default handler;
