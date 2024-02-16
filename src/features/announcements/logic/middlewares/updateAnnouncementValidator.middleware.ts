import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import logger from "../../../../core/logger";
import {
  announcementAcademicLevels,
  announcementSeverities,
} from "../../data/models/announcement.model";

const updateAnnouncementValidator = [
  body("title").optional().isString().withMessage("Title must be a string"),
  body("content").optional().isString().withMessage("Content must be a string"),
  body("severity")
    .optional()
    .isIn(announcementSeverities)
    .withMessage(
      `Severity must be one of these values: ${announcementSeverities}`
    ),
  body("academicLevel")
    .optional()
    .isIn(announcementAcademicLevels)
    .withMessage(
      `Academic level must be one of these values: ${announcementAcademicLevels}`
    ),
  

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating update announcement req body: ${JSON.stringify(req.body)}`
    );

    // if the request body contains any field other than "title", "content", "severity", return an error
    const allowedFields = [
      "title",
      "content",
      "severity",
      "academicLevel",
      "department",
    ];
    const receivedFields = Object.keys(req.body);
    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      logger.debug(
        `Invalid req body provided ${JSON.stringify(invalidFields)}`
      );
      return res.status(400).json({
        error: {
          message: `Invalid fields provided: ${invalidFields}`,
        },
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.debug(
        `Invalid req body provided ${JSON.stringify(errors.array())}`
      );
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    if (req.body.title) req.body.title = req.body.title.trim();
    if (req.body.content) req.body.content = req.body.content.trim();
    if (req.body.severity) req.body.severity = req.body.severity;
    if (req.body.academicLevel) req.body.academicLevel = req.body.academicLevel;
    if (req.body.department) req.body.department = req.body.department;

    next();
  },
];

export default updateAnnouncementValidator;
