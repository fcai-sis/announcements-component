import { Request, Response } from "express";

import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { EmployeeModel, IEmployee } from "@fcai-sis/shared-models";

import AnnouncementModel, {
  IAnnouncement,
} from "../../data/models/announcement.model";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    announcement: Partial<IAnnouncement>;
  }
>;

const createAnnouncementHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const {
    announcement,
    user: { userId },
  } = req.body;

  const author = await EmployeeModel.findOne({ user: userId });

  if (!author) {
    return res.status(404).json({
      error: {
        message: "Author not found",
      },
    });
  }

  const createdAnnouncement = new AnnouncementModel({
    title: announcement.title,
    content: announcement.content,
    author,
    severity: announcement.severity,
  });

  await createdAnnouncement.save();

  return res.status(201).send({
    announcement: {
      ...announcement,
      author: { fullName: author.fullName },
      __v: undefined,
    },
  });
};

export default createAnnouncementHandler;
