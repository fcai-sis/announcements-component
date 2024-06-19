import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { AnnouncementSeveritiesEnum } from "../../data/models/announcement.model";
import { DepartmentModel } from "@fcai-sis/shared-models";

/**
 * Validates the request of the create announcement endpoint.
 */
const validateCreateAnnouncementRequestMiddleware = [
  validator
    .body("announcement.title")

    .exists()
    .withMessage("Title is required")

    .isString()
    .withMessage("Title must be a string"),

  validator
    .body("announcement.content")

    .exists()
    .withMessage("Content is required")

    .isString()
    .withMessage("Content must be a string"),

  validator
    .body("announcement.departments")
    .optional()

    .isArray()
    .withMessage("Department must be an array of department codes"),

  validator
    .body("announcement.departments.*")

    .isMongoId()
    .withMessage("Department must be a valid Mongo ID")

    .custom(async (value) => !!(await DepartmentModel.findById(value)))
    .withMessage((value) => {
      return `Department with _id ${value} does not exist`;
    }),

  validator
    .body("announcement.severity")

    .exists()
    .withMessage("Severity is required")

    .isIn(AnnouncementSeveritiesEnum)
    .withMessage(
      `Severity must be one of the following: ${AnnouncementSeveritiesEnum.join(
        ", "
      )}`
    ),

  validator
    .body("announcement.levels")
    .optional()

    .isArray()
    .withMessage("Levels must be an array of levels"),

  validator
    .body("announcement.levels.*")

    .isInt()
    .withMessage("Levels must be integers"),

  validateRequestMiddleware,
];

export default validateCreateAnnouncementRequestMiddleware;
