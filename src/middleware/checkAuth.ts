import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config";
import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utits/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token Recieved");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({
        email: verifiedToken.email,
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
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
