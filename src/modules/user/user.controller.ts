/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utits/catchAsync";
import { sendResponse } from "../../utits/sendResponse";
import { userServices } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Users created Successfully",
      data: user,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await userServices.updateUsers(userId, payload, verifiedToken);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Users Updated Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "All Users Retrievd Successfully",
      data: users.data,
      meta: users.meta,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
};
