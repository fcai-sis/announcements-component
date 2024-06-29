import * as validator from "express-validator";

import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

const filterAnnouncementsMiddleware = [
  validator
    .query("department")

    .optional({ values: "falsy" })

    .isString()
    .withMessage("Department must be a string"),

  validator
    .query("severity")

    .optional({ values: "falsy" })

    .isString()
    .withMessage("Severity must be a string"),

  validator
    .query("level")

    .optional({ values: "falsy" })

    .isString()
    .withMessage("Level must be a string"),

  validateRequestMiddleware,
];

export default filterAnnouncementsMiddleware;
