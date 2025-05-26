import { Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "admin";
  avatar: string;
  verified: boolean;
  verificationCode: string | undefined;
  verificationCodeValidation: number | undefined;
  forgetPasswordCode: string | undefined;
  forgetPasswordCodeValidation: number | undefined;
  wishlist: Types.ObjectId[];
}
