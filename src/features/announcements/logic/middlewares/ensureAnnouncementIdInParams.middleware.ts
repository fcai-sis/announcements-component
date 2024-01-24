import { Request, Response, NextFunction } from 'express';
import * as validator from "express-validator";

const middlewares = [
  validator
    .param('announcementId')

    .exists()
    .withMessage(1)

    .isMongoId()
    .withMessage(2),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.params.announcementId = req.params.announcementId.trim();

    next();
  }

];

const ensureAnnouncementIdInParamsMiddleware = middlewares;
export default ensureAnnouncementIdInParamsMiddleware;
