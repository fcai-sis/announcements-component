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

export default (router: Router) => {
  /*
   * Create announcement
   **/
  router.post(
    "/create",
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
    "/read",

    // Validate request query params for pagination
    paginationQueryParamsMiddleware,

    asyncHandler(readAnnouncementHandler)
  );

  /*
   * Delete announcement
   **/
  router.delete(
    "/delete/:announcementId",

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
    "/update/:announcementId",

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
