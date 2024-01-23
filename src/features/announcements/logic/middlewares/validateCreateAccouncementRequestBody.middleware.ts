import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";
import { announcementSeverities } from "../../data/models/announcement.model";

/**
 * Validates the request body of the create announcement endpoint.
 */
const middlewares = [
  validator
    .body("title")

    .exists()
    .withMessage(1)

    .isString()
    .withMessage(2),

  validator
    .body("content")

    .exists()
    .withMessage(3)

    .isString()
    .withMessage(4),

  validator
    .body("severity")

    .exists()
    .withMessage(5)

    .isIn(announcementSeverities)
    .withMessage(6),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create announcement req body: ${JSON.stringify(req.body)}`
    );

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Invalid req body provided ${JSON.stringify(
          errors.mapped()
        )}`
      );
      res.status(400).json(
        {
          error:
            errors.array()[0].msg === 1
              ? {
                message: "Title is required",
              }
              : errors.array()[0].msg === 2
                ? {
                  message: "Title must be a string",
                }
                : errors.array()[0].msg === 3
                  ? {
                    message: "Content is required",
                  }
                  : errors.array()[0].msg === 4
                    ? {
                      message: "Content must be a string",
                    }
                    : errors.array()[0].msg === 5
                      ? {
                        message: "Severity is required",
                      }
                      : errors.array()[0].msg === 6
                        ? {
                          message: `Severity must be one of these values: ${announcementSeverities}`
                        } : {
                          message: "Invalid request body",
                        }
        }
      );
      return;
    }

    logger.debug(
      `Valid req body provided: ${JSON.stringify(req.query)}`
    );

    // Attach the validated data to the request body
    req.body.title = req.body.title.trim();
    req.body.content = req.body.content.trim();
    req.body.severity = req.body.severity;

    next();
  },
];

const validateCreateAnnouncementRequestBodyMiddleware = middlewares;
export default validateCreateAnnouncementRequestBodyMiddleware;
