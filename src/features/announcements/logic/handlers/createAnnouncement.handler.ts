import mongoose from "mongoose";
import { Request, Response } from "express";

import AnnouncementModel, { AnnouncementSeverity } from "../../data/models/announcement.model";

type HandlerRequest = Request<
  {},
  {},
  {
    title: string;
    content: string;
    severity: AnnouncementSeverity;
  }
>;

/*
 * Creates an announcement.
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const { title, content, severity } = req.body;
  const authorId = new mongoose.Types.ObjectId();

  const announcement = new AnnouncementModel({
    title,
    content,
    severity,
    authorId,
  });

  await announcement.save();

  return res.json({
    announcement,
  });
}

const createAnnouncementHandler = handler;
export default createAnnouncementHandler;
