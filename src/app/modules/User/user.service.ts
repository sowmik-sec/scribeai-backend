import { Request } from "express";
import { User } from "../../../generated/prisma";
import { IFile } from "../../../interfaces/file";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createUser = async (req: Request & { file?: IFile }): Promise<User> => {
  const file = req.file as IFile;
  if (file) {
    // Handle file upload
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.email,
    name: req.body.name,
    password: hashedPassword,
  };
  const result = await prisma.user.create({
    data: userData,
  });
  return result;
};

export const UserServices = {
  createUser,
};
