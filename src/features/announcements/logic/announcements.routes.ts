import { Router } from "express";
import asyncHandler from "core/asyncHandler";

import createAnnouncementHandler from "./handlers/createAnnouncement.handler";
import validateCreateAnnouncementRequestBodyMiddleware from "./middlewares/validateCreateAccouncementRequestBody.middleware";

export default (router: Router) => {
  router.post(
    "/create",

    // Validate request body 
    validateCreateAnnouncementRequestBodyMiddleware,

    asyncHandler(createAnnouncementHandler),
  );
};
