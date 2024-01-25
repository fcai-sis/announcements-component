import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("announcementId")

    .exists()
    .withMessage("Announcement ID is required")

    .isMongoId()
    .withMessage("Announcement ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.announcementId = req.params.announcementId.trim();

    next();
  },
];

const ensureAnnouncementIdInParamsMiddleware = middlewares;
export default ensureAnnouncementIdInParamsMiddleware;
