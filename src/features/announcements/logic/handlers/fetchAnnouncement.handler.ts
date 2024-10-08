import { AnnouncementModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {
    announcementId: string;
  },
  {},
  {}
>;

const fetchAnnouncementHandler = async (req: HandlerRequest, res: Response) => {
  const announcement = await AnnouncementModel.findById(
    req.params.announcementId
  ).populate({
    path: "author",
    select: "fullName -_id",
  });

  if (!announcement) {
    return res.status(404).json({
      errors: [
        {
          message: "Announcement not found",
        },
      ],
    });
  }

  return res.status(200).send({
    announcement: {
      ...announcement.toJSON(),
      __v: undefined,
    },
  });
};

export default fetchAnnouncementHandler;
