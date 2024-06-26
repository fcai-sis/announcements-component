import { Request, Response } from "express";

import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  AnnouncementModel,
  AnnouncementType,
  EmployeeModel,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    announcement: Partial<AnnouncementType>;
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

  const createdAnnouncement = await AnnouncementModel.create({
    title: announcement.title!,
    content: announcement.content!,
    author,
    severity: announcement.severity!,
  });

  return res.status(201).send({
    announcement: {
      ...createdAnnouncement,
      author: { fullName: author.fullName },
      __v: undefined,
    },
  });
};

export default createAnnouncementHandler;
