import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../../shared/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUser(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Created Successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
};
