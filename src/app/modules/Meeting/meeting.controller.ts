import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { MeetingServices } from "./meeting.service";
import sendResponse from "../../../shared/sendResponse";
import { User } from "../../../../generated/prisma";

const createMeeting = catchAsync(async (req: Request, res: Response) => {
  const result = await MeetingServices.createMeetingIntoDB(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meeting created successfully !",
    data: result,
  });
});

const getMeetings = catchAsync(async (req: Request, res: Response) => {
  const result = await MeetingServices.getMeetingsFromDb(req.user as User);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meetings retrieved successfully!",
    data: result,
  });
});

export const MeetingControllers = {
  createMeeting,
  getMeetings,
};
