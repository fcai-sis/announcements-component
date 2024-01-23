import { Request, Response } from "express";
import AnnouncementModel from "../../data/models/announcement.model";

const handler = async (req: Request, res: Response) => {
  const announcement = req.params.id;
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
