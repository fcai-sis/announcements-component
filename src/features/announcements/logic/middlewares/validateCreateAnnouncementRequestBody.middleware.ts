import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";
import {
  announcementAcademicLevels,
  announcementSeverities,
} from "../../data/models/announcement.model";
import { DepartmentModel } from "@fcai-sis/shared-models";

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
    .body("department")

    .optional()
    .isArray()
    .withMessage("Department must be an array of department IDs")
    .custom(async (value) => {
      if (!(value.length === 0)) {
        // Check if all departments exist in the database
        const departments = await DepartmentModel.find({
          _id: { $in: value },
        });

        if (departments.length !== value.length) {
          throw new Error("One or more departments do not exist");
        }

        return true;
      }
      return true;
    }),

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
