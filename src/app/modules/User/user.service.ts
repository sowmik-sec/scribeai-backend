import { Request } from "express";
import { User } from "../../../generated/prisma";
import { IUploadFile } from "../../../interfaces/file";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { hashedPassword } from "./user.utils";

const createUser = async (
  req: Request & { file?: IUploadFile }
): Promise<User> => {
  const file = req.file as IUploadFile;
  if (file) {
    req.body.profilePhoto = (
      await FileUploadHelper.uploadToCloudinary(file)
    )?.secure_url;
  }
  const hashPassword: string = await hashedPassword(req.body.password);
  const result = await prisma.user.create({
    data: {
      ...req.body,
      password: hashPassword,
    },
  });
  return result;
};

export const UserServices = {
  createUser,
};
