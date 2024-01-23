import { Request, Response } from "express";
import AnnouncementModel from "features/announcements/data/models/announcement.model";

const handler = async (req: Request, res: Response) => {
  const announcement = req.params.id;

  const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(
    announcement
  );
  return res.status(200).send({
    data: deletedAnnouncement,
    message: "Announcement deleted successfully",
  });
};

export default handler;
