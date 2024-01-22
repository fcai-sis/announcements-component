import { Router } from "express";

import asyncHandler from "../../core/asyncHandler";
import exampleHandler from "./logic/handlers/example.handler";

export default (router: Router) => {
  router.get(
    "/example",

    // Handle example request
    asyncHandler(exampleHandler)
  );
};
