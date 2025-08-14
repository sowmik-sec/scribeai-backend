import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { ILoginUser, ILoginUserResponse } from "./auth.interface";
import { AuthUtils } from "./auth.utils";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import { Request } from "express";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
  if (!isUserExist) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  if (
    !isUserExist.password &&
    !(await AuthUtils.comparePasswords(password, isUserExist.password))
  ) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }
  const { id: userId } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId },
    config.jwt.secret as Secret,
    config.jwt.expires_in as StringValue
  );

  const refreshToken = jwtHelpers.createToken(
    { userId },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as StringValue
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getUserData = async (req: Request) => {
  const userId = req.user?.userId;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      profilePhoto: true,
      meetings: true,
      usage: true,
    },
  });
  return user;
};

export const AuthServices = {
  loginUser,
  getUserData,
};
