import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";
import { AnnouncementSeveritiesEnum } from "@fcai-sis/shared-models";

/**
 * Validates the request body of the update announcement endpoint.
 */
const updateAnnouncementValidatorMiddleware = [
  validator
    .body("title")

    .optional()

    .isString()
    .withMessage("Title must be a string"),

  validator
    .body("content")

    .optional()

    .isString()
    .withMessage("Content must be a string"),

  validator
    .body("departments")
    .optional()

    .isArray()
    .withMessage("Department must be an array of department codes"),

  validator
    .body("departments.*")

    .isString()
    .withMessage("Department must be a string"),

  validator
    .body("severity")

    .optional()

    .isIn(AnnouncementSeveritiesEnum)
    .withMessage(
      `Severity must be one of the following: ${AnnouncementSeveritiesEnum.join(
        ", "
      )}`
    ),

  validator
    .body("levels")

    .optional()

    .isArray()
    .withMessage("Levels must be an array of numbers"),

  validator
    .body("levels.*")

    .isNumeric()
    .withMessage("Level must be a number"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((e) => ({
          message: e.msg,
        })),
      });
    }
    next();
  },
];

export default updateAnnouncementValidatorMiddleware;
