import { Request, Response } from "express";

import AnnouncementModel from "../../data/models/announcement.model";
import { employeeModelName } from "@fcai-sis/shared-models";

type HandlerRequest = Request;

/*
 * Reads all announcements
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  // get the pagination parameters
  const page = req.context.page;
  const pageSize = req.context.pageSize;

  const totalAnnouncements = await AnnouncementModel.countDocuments({
    archived: false,
  });

  // read the announcements from the db
  const announcements = await AnnouncementModel.find(
    {
      archived: false,
    },
    {
      // exclude the following fields
      __v: 0,
      archived: 0,
      // _id: 0,
    }
  )
    // remove sensitive data from the author object
    .populate({
      path: "authorId",
      select: "username -_id",
    })
    // essentially replaces the FK with the object it's referring to
    .sort({ createdAt: -1 }) // sorts so that latest announcements show up first
    .skip((page - 1) * pageSize) // pagination
    .limit(pageSize);

  return res.status(200).send({
    announcements: announcements,
    page: page,
    pageSize: pageSize,
    totalAnnouncements,
  });
};

const readAnnouncementsHandler = handler;
export default readAnnouncementsHandler;
