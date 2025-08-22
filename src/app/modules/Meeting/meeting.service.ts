import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { IUploadFile } from "../../../interfaces/file";
import { MeetingStatus } from "../../../../generated/prisma";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";

const createMeetingIntoDB = async (req: Request) => {
  const file = req.file as IUploadFile;
  console.log({ file }, req.body);
  if (file) {
    const cloudinaryResponse = await FileUploadHelper.uploadToCloudinary(file);
    if (cloudinaryResponse) {
      req.body.audioUrl = cloudinaryResponse?.secure_url;
    }
  } else {
    throw new ApiError(StatusCodes.NOT_FOUND, "File not found");
  }
  req.body.fileName = file.filename;
  req.body.status = MeetingStatus.PROCESSING;
  req.body.userId = req?.user?.userId;
  const result = await prisma.meeting.create({
    data: req.body,
  });
  return result;
};

export const MeetingServices = {
  createMeetingIntoDB,
};
