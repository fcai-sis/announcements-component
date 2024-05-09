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

import validateCreateAnnouncementRequestBodyMiddleware from "./middlewares/validateCreateAnnouncementRequestBody.middleware";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import ensureAuthorizationMiddleware from "./middlewares/ensureAuthorization.middleware";
import fetchAnnouncementHandler from "./handlers/fetchAnnouncement.handler";

export default (router: Router) => {
  /*
   * Create announcement
   **/
  router.post(
    "/",
    // Ensure user is an admin or employee
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Ensure user is authorized
    ensureAuthorizationMiddleware,

    // Validate request body
    validateCreateAnnouncementRequestBodyMiddleware,

    asyncHandler(createAnnouncementHandler)
  );

  /*
   * Read paginated announcements
   **/
  router.get(
    "/",

    // Validate request query params for pagination
    paginationQueryParamsMiddleware,

    asyncHandler(readAnnouncementHandler)
  );

  /**
   * Read announcement by id
   */

  router.get(
    "/:announcementId",

    // Ensure announcement id in params
    ensureAnnouncementIdInParamsMiddleware,

    asyncHandler(fetchAnnouncementHandler)
  );

  /*
   * Delete announcement
   **/
  router.delete(
    "/:announcementId",

    // Ensure user is an admin or employee
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Ensure user is authorized
    ensureAuthorizationMiddleware,
    // Ensure announcement id in params
    ensureAnnouncementIdInParamsMiddleware,

    asyncHandler(deleteAnnouncementHandler)
  );

  /*
   * Archive announcement
   **/
  router.put(
    "/archive/:announcementId",

    // Ensure user is an admin or employee
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Ensure user is authorized
    ensureAuthorizationMiddleware,
    // Ensure announcement id in params
    ensureAnnouncementIdInParamsMiddleware,

    asyncHandler(archiveAnnouncementHandler)
  );

  /*
   * Update announcement
   **/
  router.patch(
    "/:announcementId",

    // Ensure user is an admin or employee
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Ensure user is authorized
    ensureAuthorizationMiddleware,
    // Ensure announcement id in params
    ensureAnnouncementIdInParamsMiddleware,

    // Validate request body
    updateAnnouncementValidator,

    asyncHandler(updateAnnouncementHandler)
  );
};
