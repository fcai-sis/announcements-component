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
 * Archives an announcement, gets deleted automatically after a year
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const announcement = req.body.id;
  if (!announcement) {
    return res
      .status(400)
      .json({ error: "Announcement ID is required in the request body" });
  }
  // archive the announcement by setting archived to true
  const archivedAnnouncement = await AnnouncementModel.findById(announcement);
  if (!archivedAnnouncement) {
    return res.status(404).send({
      error: "Announcement not found",
    });
  }
  archivedAnnouncement.archived = true;
  await archivedAnnouncement.save();
  return res.status(200).send({
    data: archivedAnnouncement,
    message: "Announcement has been archived successfully",
  });
};

export default handler;
