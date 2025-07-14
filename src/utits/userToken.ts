import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_SECRET_EXPIRES_IN as string
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET as string,
    envVars.JWT_REFRESH_SECRET_EXPIRES_IN as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET as string
  ) as JwtPayload;

  const isUserExists = await User.findOne({
    email: verifiedRefreshToken.email,
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist");
  }
  if (
    isUserExists.isActive === IsActive.BLOCKED ||
    isUserExists.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `User is ${isUserExists.isActive}`
    );
  }
  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_SECRET_EXPIRES_IN as string
  );

  return {
    accessToken,
  };
};
