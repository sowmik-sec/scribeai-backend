import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
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
      meetings: true,
      usage: true,
    },
  });
  return user;
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Invalid Refresh Token");
  }

  const { userId } = verifiedToken;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as StringValue
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  loginUser,
  getUserData,
  refreshToken,
};
