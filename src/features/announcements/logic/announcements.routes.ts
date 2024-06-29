import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import fetchPaginatedAnnouncements from "./handlers/fetchPaginatedAnnouncements.handler";
import createAnnouncementHandler from "./handlers/createAnnouncement.handler";
import deleteAnnouncementHandler from "./handlers/deleteAnnouncement.handler";
import archiveAnnouncementHandler from "./handlers/archiveAnnouncements.handler";
import fetchAnnouncementHandler from "./handlers/fetchAnnouncement.handler";
import ensureAnnouncementIdInParamsMiddleware from "./middlewares/ensureAnnouncementIdInParams.middleware";
import validateCreateAnnouncementRequestMiddleware from "./middlewares/validateCreateAnnouncementRequest.middleware";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import filterAnnouncementsMiddleware from "./middlewares/filterAnnouncements.middleware";

export default (router: Router) => {
  // Create announcement
  router.post(
    "/",
    checkRole([Role.EMPLOYEE]),
    validateCreateAnnouncementRequestMiddleware,
    asyncHandler(createAnnouncementHandler)
  );

  // Fetch paginated announcements
  router.get("/", filterAnnouncementsMiddleware, fetchPaginatedAnnouncements);

  // Fetch announcement by ID
  router.get(
    "/:announcementId",
    ensureAnnouncementIdInParamsMiddleware,
    asyncHandler(fetchAnnouncementHandler)
  );

  // Delete announcement
  router.delete(
    "/:announcementId",
    checkRole([Role.EMPLOYEE]),
    ensureAnnouncementIdInParamsMiddleware,
    asyncHandler(deleteAnnouncementHandler)
  );

  // Archive announcement
  router.put(
    "/archive/:announcementId",
    checkRole([Role.EMPLOYEE]),
    ensureAnnouncementIdInParamsMiddleware,
    asyncHandler(archiveAnnouncementHandler)
  );
};
