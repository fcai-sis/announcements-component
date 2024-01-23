import { Router } from "express";

import asyncHandler from "../../../core/asyncHandler";
import createAnnouncementHandler from "./handlers/createAnnouncement.handler";
import validateCreateAnnouncementRequestBodyMiddleware from "./middlewares/validateCreateAccouncementRequestBody.middleware";
import readAnnouncementHandler from "./handlers/readannouncement.handler";
import deleteAnnouncementHandler from "./handlers/deleteannouncement.handler";
import archiveAnnouncementHandler from "./handlers/archiveannouncement.handler";
import updateAnnouncementHandler from "./handlers/updateAnnouncement.handler";

export default (router: Router) => {
  router.post(
    "/create",

    // Validate request body
    validateCreateAnnouncementRequestBodyMiddleware,

    asyncHandler(createAnnouncementHandler)
  );
  router.get(
    "/read",

    asyncHandler(readAnnouncementHandler)
  );
  router.delete(
    "/delete",

    asyncHandler(deleteAnnouncementHandler)
  );
  router.put(
    "/archive",

    asyncHandler(archiveAnnouncementHandler)
  );
  router.put(
    "/update/:announcementId",

    asyncHandler(updateAnnouncementHandler)
  );
};
