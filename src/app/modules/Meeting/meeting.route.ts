import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { MeetingValidationZodSchema } from "./meeting.validation";
import { MeetingControllers } from "./meeting.controller";
const router = express.Router();

router.post(
  "/create-meeting",
  auth(),
  FileUploadHelper.upload.single("audioFile"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = MeetingValidationZodSchema.createMeetingSchema.parse(
      JSON.parse(req.body.data)
    );
    return MeetingControllers.createMeeting(req, res, next);
  }
);

router.get("/", auth(), MeetingControllers.getMeetings);

export const MeetingRoutes = router;
