import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";
import {
  announcementAcademicLevels,
  announcementSeverities,
} from "../../data/models/announcement.model";

/**
 * Validates the request body of the create announcement endpoint.
 */
const middlewares = [
  validator
    .body("title")

    .exists()
    .withMessage("Title is required")

    .isString()
    .withMessage("Title must be a string"),

  validator
    .body("content")

    .exists()
    .withMessage("Content is required")

    .isString()
    .withMessage("Content must be a string"),

  validator
    .body("severity")

    .exists()
    .withMessage("Severity is required")

    .isIn(announcementSeverities)
    .withMessage(
      `Severity must be one of the following: ${announcementSeverities.join(
        ", "
      )}`
    ),
  validator
    .body("academicLevel")
    .optional()
    .isIn(announcementAcademicLevels)
    .withMessage(
      `Academic level must be one of the following: ${announcementAcademicLevels.join(
        ", "
      )}`
    ),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create announcement req body: ${JSON.stringify(req.body)}`
    );

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for create announcement req body: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    // Attach the validated data to the request body
    req.body.title = req.body.title.trim();
    req.body.content = req.body.content.trim();
    req.body.severity = req.body.severity;
    req.body.academicLevel = req.body.academicLevel;
    req.body.department = req.body.department;

    next();
  },
];

const validateCreateAnnouncementRequestBodyMiddleware = middlewares;
export default validateCreateAnnouncementRequestBodyMiddleware;
