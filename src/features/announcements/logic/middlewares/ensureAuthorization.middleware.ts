import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { EmployeeModel, EmployeeType } from "@fcai-sis/shared-models";

type MiddlewareRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    employee: EmployeeType;
    // TODO: add admin type here
  }
>;

const ensureAuthorizationMiddleware = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body.user;
  const employee = await EmployeeModel.findOne({ userId });
  // TODO: add admin check here
  // i guess we have to await both models since we can't tell whether the user is an admin or an employee just yet

  if (!employee) return res.status(404).json({ message: "Employee not found" });
  req.body.employee = employee;
  next();
};

export default ensureAuthorizationMiddleware;
