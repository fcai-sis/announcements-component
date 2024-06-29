import { Request, Response } from "express";

import paginate from "express-paginate";
import { asyncHandler } from "@fcai-sis/shared-utilities";
import { AnnouncementModel, DepartmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request;

/**
 * Reads all announcements from the database.
 */
const readAnnouncementsHandler = [
  paginate.middleware(),
  asyncHandler(async (req: HandlerRequest, res: Response) => {
    const { department, severity, level } = req.query;

    console.log(req.query);

    const allDepartments = await DepartmentModel.find();
    const d = allDepartments.find((d) => d.code === department);

    const filter = {
      ...(department && { departments: d._id }),
      ...(severity && { severity }),
      ...(level && !isNaN(level as unknown as number) && { levels: level }),
    };

    const total = await AnnouncementModel.countDocuments(filter);
    const announcements = await AnnouncementModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(req.skip ?? 0)
      .limit(req.query.limit as unknown as number);

    return res.status(200).json({
      announcements: announcements.map((announcement) => ({
        ...announcement.toJSON(),
        departments: announcement.departments.map((department: any) => ({
          ...allDepartments.find((d) => d._id.equals(department)).toJSON(),
          _id: undefined,
          __v: undefined,
        })),
        total,
      })),
    });
  }),
];

export default readAnnouncementsHandler;
