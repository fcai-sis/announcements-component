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

  // TODO: Get the authorId from the request
  const authorId = new mongoose.Types.ObjectId();

  const announcement = new AnnouncementModel({
    title,
    content,
    severity,
    authorId,
  });

  await announcement.save();

  const response = {
    announcement: {
      _id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      severity: announcement.severity,
      createdAt: announcement.createdAt,
      author: {
        username: "username", // TODO: Get the author's username from the database
      },
    }
  }

  return res.status(201).json(response);
}

const createAnnouncementHandler = handler;
export default createAnnouncementHandler;
