import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utits/jwt";
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
  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    "1d"
  );

  return {
    accessToken,
  };
};

export const authServices = {
  credentialsLogin,
};
