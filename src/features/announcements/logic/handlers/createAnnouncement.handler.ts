import mongoose from "mongoose";
import { Request, Response } from "express";

import AnnouncementModel, {
  AnnouncementSeverity,
} from "../../data/models/announcement.model";
import { IAdmin, IEmployee } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    title: string;
    content: string;
    severity: AnnouncementSeverity;
    academicLevel?: number;
    department?: string;
    employee?: IEmployee;
    admin?: IAdmin;
  }
>;

/*
 * Creates an announcement.
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const {
    title,
    content,
    severity,
    academicLevel,
    department,
    employee,
    admin,
  } = req.body;
  let authorId;
  if (employee) {
    authorId = employee;
  } else if (admin) {
    authorId = admin;
  } else {
    return res.status(500).json({
      error: {
        message:
          "You're accessing this route without being an employee or an admin? How did you even get here?",
      },
    });
  }

  const announcement = new AnnouncementModel({
    title,
    content,
    academicLevel,
    department,
    severity,
    authorId,
  });

  await announcement.save();

  const response = {
    announcement: {
      _id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      academicLevel: announcement.academicLevel,
      department: announcement.department,
      severity: announcement.severity,
      createdAt: announcement.createdAt,
      author: {
        name: employee?.fullName ?? admin?.fullName,
        email: employee?.email ?? admin?.email,
      },
    },
  };

  return res.status(201).json(response);
};

const createAnnouncementHandler = handler;
export default createAnnouncementHandler;
