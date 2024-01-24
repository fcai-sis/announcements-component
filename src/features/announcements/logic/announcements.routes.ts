import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";

import readAnnouncementHandler from "./handlers/readAnnouncements.handler";
import createAnnouncementHandler from "./handlers/createAnnouncement.handler";
import updateAnnouncementHandler from "./handlers/updateAnnouncement.handler";
import deleteAnnouncementHandler from "./handlers/deleteAnnouncement.handler";
import archiveAnnouncementHandler from "./handlers/archiveAnnouncements.handler";
import updateAnnouncementValidator from "./middlewares/updateAnnouncementValidator.middleware";
import ensureAnnouncementIdInParamsMiddleware from "./middlewares/ensureAnnouncementIdInParams.middleware";
import validateCreateAnnouncementRequestBodyMiddleware from "./middlewares/validateCreateAccouncementRequestBody.middleware";

export default (router: Router) => {
  router.post(
    "/create",

    // Validate request body
    validateCreateAnnouncementRequestBodyMiddleware,

    asyncHandler(createAnnouncementHandler)
  );
  router.get(
    "/read",
    paginationQueryParamsMiddleware,
    asyncHandler(readAnnouncementHandler)
  );
  router.delete(
    "/delete",
    ensureAnnouncementIdInParamsMiddleware,
    asyncHandler(deleteAnnouncementHandler)
  );
  router.put(
    "/archive",
    ensureAnnouncementIdInParamsMiddleware,
    asyncHandler(archiveAnnouncementHandler)
  );
  router.put(
    "/update/:announcementId",

    ensureAnnouncementIdInParamsMiddleware,
    updateAnnouncementValidator,

    asyncHandler(updateAnnouncementHandler)
  );
};
