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

  if (!announcement) {
    return res
      .status(400)
      .json({ error: "Announcement ID is required in the request body" });
  }

  const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(
    announcement
  );

  return res.status(200).send({
    data: deletedAnnouncement,
    message: "Announcement deleted successfully",
  });
};

export default handler;
