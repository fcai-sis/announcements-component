import { Router } from "express";
import asyncHandler from "core/asyncHandler";

import createAnnouncementHandler from "./handlers/createAnnouncement.handler";

export default (router: Router) => {
  router.post(
    "/create",
    asyncHandler(createAnnouncementHandler),
  );
};
