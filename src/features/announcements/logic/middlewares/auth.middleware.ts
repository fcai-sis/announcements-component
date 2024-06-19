import { Request, Response, NextFunction } from "express";

import { Role, TokenPayload, checkRole } from "@fcai-sis/shared-middlewares";
import {
  EmployeeModel,
  IEmployee,
  IAdmin,
  AdminModel,
} from "@fcai-sis/shared-models";
import { asyncHandler } from "@fcai-sis/shared-utilities";

type MiddlewareRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    author: IEmployee | IAdmin;
  }
>;

const authMiddleware = [
  checkRole([Role.EMPLOYEE, Role.ADMIN]),
  asyncHandler(
    async (req: MiddlewareRequest, res: Response, next: NextFunction) => {
      const { userId, role } = req.body.user;

      console.log("userId", userId);
      console.log("role", role);

      const author = await (role === Role.EMPLOYEE
        ? EmployeeModel
        : role === Role.ADMIN
        ? AdminModel
        : null
      )?.findOne({ user: userId });

      console.log("author", author);

      if (!author) {
        return res.status(404).json({
          error: {
            message: "Author not found",
          },
        });
      }

      req.body.author = author;

      next();
    }
  ),
];

export default authMiddleware;
