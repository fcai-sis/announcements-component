import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

/**
 * Validates the request body of the delete/archive announcement endpoints.
 */
const middlewares = [
  //TODO: change it so that it validates the params not the body
  validator
    .body("id")

    .exists()
    .withMessage(1)

    .isMongoId()
    .withMessage(2),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating delete/archive announcement req body: ${JSON.stringify(req.body)}`
    );

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      logger.debug(
        `Invalid req body provided ${JSON.stringify(errors.mapped())}`
      );
      res.status(400).json({
        error:
          errors.array()[0].msg === 1
            ? {
                message: "ID of the announcement is required!",
              }
            : errors.array()[0].msg === 2
            ? {
                message: "ID must be a valid Mongo ID",
              }
            : {
                message: "Invalid request body",
              },
      });
      return;
    }

    logger.debug(`Valid req body provided: ${JSON.stringify(req.query)}`);

    next();
  },
];

const validateDeleteArchiveAnnouncementRequestBodyMiddleware = middlewares;
export default validateDeleteArchiveAnnouncementRequestBodyMiddleware;
