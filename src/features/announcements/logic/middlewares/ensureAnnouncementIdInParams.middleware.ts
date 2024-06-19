import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const ensureAnnouncementIdInParamsMiddleware = [
  validator
    .param("announcementId")

    .exists()
    .withMessage("Announcement ID is required")

    .isMongoId()
    .withMessage("Announcement ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

export default ensureAnnouncementIdInParamsMiddleware;
