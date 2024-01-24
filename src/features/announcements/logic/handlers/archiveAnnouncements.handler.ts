import { Request, Response } from "express";

import AnnouncementModel from "../../data/models/announcement.model";

type HandlerRequest = Request<{ announcementId: string; }
>;
/*
 * Archives an announcement, gets deleted automatically after a year
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const announcement = req.params.announcementId;

  // archive the announcement by setting archived to true
  const archivedAnnouncement = await AnnouncementModel.findById(announcement);

  if (!archivedAnnouncement) {
    return res.status(404).send({
      error: "Announcement not found",
    });
  }

  archivedAnnouncement.archived = true;
  await archivedAnnouncement.save();

  return res.status(202).send({
    data: archivedAnnouncement,
    message: "Announcement has been archived successfully",
  });
};

export default handler;
