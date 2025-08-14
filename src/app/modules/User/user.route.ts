import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { UserValidation } from "./user.validation";
const router = express.Router();

router.post(
  "/create-user",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUserValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createUser(req, res, next);
  }
);

export const UserRoutes = router;
