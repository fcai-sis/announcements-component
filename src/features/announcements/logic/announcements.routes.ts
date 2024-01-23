import { Router } from "express";

import asyncHandler from "../../../core/asyncHandler";
import createAnnouncementHandler from "./handlers/createAnnouncement.handler";
import validateCreateAnnouncementRequestBodyMiddleware from "./middlewares/validateCreateAccouncementRequestBody.middleware";
import readAnnouncementHandler from "./handlers/readAnnouncement.handler";
import deleteAnnouncementHandler from "./handlers/deleteAnnouncement.handler";
import archiveAnnouncementHandler from "./handlers/archiveAnnouncement.handler";
import validatePaginationQueryParams from "./middlewares/validatePaginationQueryParams.middleware";
import validateDeleteArchiveAnnouncementRequestBodyMiddleware from "./middlewares/validateDeleteAnnouncement.middleware";

export default (router: Router) => {
  router.post(
    "/create",

    // Validate request body
    validateCreateAnnouncementRequestBodyMiddleware,

    asyncHandler(createAnnouncementHandler)
  );
  router.get(
    "/read",
    validatePaginationQueryParams,
    asyncHandler(readAnnouncementHandler)
  );
  router.delete(
    "/delete",
    validateDeleteArchiveAnnouncementRequestBodyMiddleware,
    asyncHandler(deleteAnnouncementHandler)
  );
  router.put(
    "/archive",
    validateDeleteArchiveAnnouncementRequestBodyMiddleware,
    asyncHandler(archiveAnnouncementHandler)
  );
};
