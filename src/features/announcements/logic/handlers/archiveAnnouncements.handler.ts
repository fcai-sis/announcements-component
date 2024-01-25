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
      error: {
        message: "Announcement not found",
      }
    });
  }

  if (archivedAnnouncement.archived) {
    return res.status(400).send({
      error: {
        message: "Announcement is already archived",
      }
    });
  }

  archivedAnnouncement.archived = true;

  await archivedAnnouncement.save();

  return res.status(200).send({
    announcement: {
      _id: archivedAnnouncement._id,
      title: archivedAnnouncement.title,
      content: archivedAnnouncement.content,
      severity: archivedAnnouncement.severity,
      author: { username: "admin" },
      createdAt: archivedAnnouncement.createdAt,
      updatedAt: archivedAnnouncement.updatedAt,
      archived: archivedAnnouncement.archived,
    }
  });
};

export default handler;
