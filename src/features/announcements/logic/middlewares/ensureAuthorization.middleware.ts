import { Request, Response, NextFunction } from "express";
import { Role, TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EmployeeModel,
  IEmployee,
  IAdmin,
  AdminModel,
} from "@fcai-sis/shared-models";

type MiddlewareRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    employee: IEmployee;
    admin: IAdmin;
  }
>;

const ensureAuthorizationMiddleware = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: userId, role } = req.body.user;

  if (role === Role.EMPLOYEE) {
    const employee = await EmployeeModel.findOne({ userId });
    if (!employee)
      return res.status(404).json({
        error: {
          message: "Employee not found",
        },
      });
    req.body.employee = employee;
  } else if (role === Role.ADMIN) {
    const admin = await AdminModel.findOne({ userId });
    if (!admin)
      return res.status(404).json({
        error: {
          message: "Admin not found",
        },
      });
    req.body.admin = admin;
  }

  next();
};

export default ensureAuthorizationMiddleware;
