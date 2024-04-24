import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { EmployeeModel, EmployeeType } from "@fcai-sis/shared-models";

type MiddlewareRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    employee: EmployeeType;
  }
>;

const ensureAuthorizationMiddleware = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body.user;
  const employee = await EmployeeModel.findOne({ userId });

  if (!employee) return res.status(404).json({ message: "Employee not found" });
  req.body.employee = employee;
  next();
};

export default ensureAuthorizationMiddleware;
