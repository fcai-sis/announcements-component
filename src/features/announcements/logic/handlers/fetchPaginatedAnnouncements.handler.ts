import { Request, Response } from "express";

import AnnouncementModel from "../../data/models/announcement.model";
import paginate from "express-paginate";
import { asyncHandler } from "@fcai-sis/shared-utilities";

type HandlerRequest = Request;

/**
 * Reads all announcements from the database.
 */
const readAnnouncementsHandler = [
  paginate.middleware(),
  asyncHandler(async (req: HandlerRequest, res: Response) => {
    const totalAnnouncements = await AnnouncementModel.countDocuments({
      archived: false,
    });

    const announcements = await AnnouncementModel.find({ archived: false })
      .populate({
        path: "author",
        select: "fullName -_id",
      })
      .sort({ createdAt: -1 })
      .skip(req.skip ?? 0)
      .limit(parseInt(req.query.limit as string) ?? totalAnnouncements);

    return res.status(200).json({
      announcements: announcements.map((announcement) => ({
        ...announcement.toJSON(),
        __v: undefined,
      })),
    });
  }),
];

export default readAnnouncementsHandler;
