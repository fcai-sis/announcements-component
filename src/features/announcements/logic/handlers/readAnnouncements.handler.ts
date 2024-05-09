import { Request, Response } from "express";

import AnnouncementModel from "../../data/models/announcement.model";

type HandlerRequest = Request;

/*
 * Reads all announcements
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  // get the pagination parameters
  const page = req.context.page;
  const pageSize = req.context.pageSize;

  // read the announcements from the db
  const announcements = await AnnouncementModel.find()
    // TODO: remove sensitive data from the author object
    // .populate(userModelName) // essentially replaces the FK with the object it's referring to
    .sort({ createdAt: -1 }) // sorts so that latest announcements show up first
    .skip((page - 1) * pageSize) // pagination
    .limit(pageSize);

  return res.status(200).send({
    announcements: announcements.map(announcement => ({
      ...announcement.toObject(),
      __v: undefined,
      archived: undefined,
      authorId: undefined,
      author: { username: "username" },
    })),
  });
};

const readAnnouncementsHandler = handler;
export default readAnnouncementsHandler;
