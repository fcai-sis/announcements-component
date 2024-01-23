import { Router } from "express";

import announcementsRoutes from "./features/announcements/logic/announcements.routes";

const router: Router = Router();

export default (): Router => {
  announcementsRoutes(router);

  return router;
};
