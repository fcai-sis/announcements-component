import { Request, Response } from "express";
import AnnouncementModel, {
  AnnouncementSeverityEnumType,
} from "../../data/models/announcement.model";
import { IDepartment, IEmployee } from "@fcai-sis/shared-models";

type UpdateHandlerRequest = Request<
  {
    announcementId: string;
  },
  {},
  {
    title?: string;
    content?: string;
    severity?: AnnouncementSeverityEnumType;
    academicLevel?: number;
    department?: IDepartment[];
    employee: IEmployee;
  }
>;

const updateAnnouncementHandler = async (
  req: UpdateHandlerRequest,
  res: Response
) => {
  const announcementId = req.params.announcementId;
  const { employee, title, content, severity, academicLevel, department } =
    req.body;
  // Check if the announcement exists
  const announcement = await AnnouncementModel.findByIdAndUpdate(
    // FIXME: Use findById and save instead of findByIdAndUpdate
    announcementId,
    {
      ...(title && { title }),
      ...(content && { content }),
      ...(severity && { severity }),
      ...(academicLevel && { level: academicLevel }),
      ...(department && { department }),
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!announcement) {
    return res.status(404).json({
      error: {
        message: "Announcement not found",
      },
    });
  }

  const response = {
    announcement: {
      _id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      severity: announcement.severity,
      academicLevel: announcement.level,
      department: announcement.department,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      author: employee.username,
    },
  };

  return res.status(200).json(response);
};

export default updateAnnouncementHandler;
