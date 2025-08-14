import { Request } from "express";
import { IUploadFile } from "../../../interfaces/file";
import prisma from "../../../shared/prisma";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { hashedPassword } from "./user.utils";
import { User } from "../../../../generated/prisma";

const createUser = async (
  req: Request & { file?: IUploadFile }
): Promise<Partial<User>> => {
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
    select: {
      id: true,
      email: true,
      name: true,
      profilePhoto: true,
      createdAt: true,
    },
  });
  return result;
};

export const UserServices = {
  createUser,
};
