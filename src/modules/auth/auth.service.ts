/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utits/userToken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Email does not exist");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExists.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }
  // const jwtPayload = {
  //   userId: isUserExists._id,
  //   email: isUserExists.email,
  //   role: isUserExists.role,
  // };

  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_ACCESS_SECRET as string,
  //   envVars.JWT_ACCESS_SECRET_EXPIRES_IN as string
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_REFRESH_SECRET as string,
  //   envVars.JWT_REFRESH_SECRET_EXPIRES_IN as string
  // );

  const userToken = createUserToken(isUserExists);

  const { password: pass, ...rest } = isUserExists.toObject();

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};
const getNewAcessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};
// const resetPassword = async (
//   oldPassword: string,
//   newPassword: string,
//   decorderToken: JwtPayload
// ) => {
//   const user = await User.findById(decorderToken.userId);

//   const isOldPasswordMatch = await bcrypt.compare(
//     oldPassword,
//     user?.password as string
//   );
//   if (!isOldPasswordMatch) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
//   }
//   user!.password = await bcrypt.hash(newPassword, 10);
//   user!.save();
// };

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user!.save();
};
export const authServices = {
  credentialsLogin,
  getNewAcessToken,
  resetPassword,
};
