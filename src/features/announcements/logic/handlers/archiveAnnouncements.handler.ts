import { AnnouncementModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ announcementId: string }>;

/**
 * Archives an announcement for deletion.
 */
const archiveAnnouncementHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const archivedAnnouncement = await AnnouncementModel.findById(
    req.params.announcementId
  ).populate({
    path: "author",
    select: "fullName -_id",
  });

  if (!archivedAnnouncement) {
    return res.status(404).send({
      errors: [
        {
          message: "Announcement not found",
        },
      ],
    });
  }

  if (archivedAnnouncement.archived) {
    return res.status(400).send({
      errors: [
        {
          message: "Announcement is already archived",
        },
      ],
    });
  }

  archivedAnnouncement.archived = true;
  await archivedAnnouncement.save();

  return res.status(200).json({
    announcement: {
      ...archivedAnnouncement.toJSON(),
      __v: undefined,
    },
  });
};

export default archiveAnnouncementHandler;
