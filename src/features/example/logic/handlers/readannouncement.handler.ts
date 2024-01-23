import { Request, Response } from "express";
import AnnouncementModel from "features/announcements/data/models/announcement.model";
import { userModelName } from "@fcai-sis/shared-models";

const handler = async (req: Request, res: Response) => {
  // get the pagination parameters
  const page = req.body.page;
  const pageSize = req.body.pageSize;

  // read the announcements from the db
  const announcements = await AnnouncementModel.find()
    // TODO: remove sensitive data from the FK object
    .populate(userModelName) // essentially replaces the FK with the object it's referring to
    .sort({ createdAt: -1 }) // sorts so that latest announcements show up first
    .skip((page - 1) * pageSize) // pagination
    .limit(pageSize);

  return res.status(200).send({
    data: announcements,
  });
};

export default handler;
