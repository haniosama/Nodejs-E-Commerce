import { IUser } from "../interface/user";
import User from "../model/user";
import schemas from "../middleware/validator";
import jwt from "jsonwebtoken";
import myHash from "../utils/hash";
import hashpass from "../utils/hash";
import transport from "../middleware/sendemail";
import bcrypt from "bcrypt";
import cloudinary from "./cloudinary";

export default class UserService {
  constructor() {}


async signUp(user: IUser , file:any) {
  const { username, email, password, phone, role, avatar } = user;
    console.log("user"  , user);

  try {
    let avatarUrl: string | null = null;

    if (file) {
      avatarUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) return reject(error);
            if (result?.secure_url) resolve(result.secure_url);
            else reject("No URL returned from Cloudinary");
          }
        ).end(file?.buffer);
      });
    } else if (avatar) {
      avatarUrl = avatar;
    }

    console.log("avatarUrl"  , avatarUrl);
    

    const { error } = schemas.signUpSchema.validate({
      username,
      email,
      password,
      phone,
      role,
      avatar: avatarUrl,
    });

    if (error) {
      return {
        status: "fail",
        message: error.details[0].message,
      };
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return {
        status: "fail",
        message: "User already exists",
      };
    }

    const hashedPassword = await hashpass.hashPassword(password, 10);

    // بيانات المستخدم الجديدة بدون Avatar افتراضي
    const newUserData: any = {
      username,
      email,
      password: hashedPassword,
      phone,
      role,
    };

    // لو فعلاً في رابط صورة (مرفوعة أو مرسلة) ضيفها للبيانات
    if (avatarUrl && avatarUrl.trim() !== "") {
      newUserData.avatar = avatarUrl;
    }
    // لو مفيش صورة هياخد القيمة الافتراضية من موديل mongoose

    const newUser = new User(newUserData);
    const result = await newUser.save();

    const { password: _, ...userWithoutPassword } = result.toObject();

    return {
      status: "your account has been created",
      data: userWithoutPassword,
    };
  } catch (err) {
    console.error("Signup error:", err);

    return {
      status: "error",
      message: "Internal server error",
    };
  }
}




  // async signUp(user: IUser) {
  //   const { username, email, password, phone, role } = user;

  //   try {
  //     const { error, value } = schemas.signUpSchema.validate({
  //       username,
  //       email,
  //       password,
  //       phone,
  //       role,
  //     });

  //     if (error) {
  //       return {
  //         status: "fail",
  //         message: error.details[0].message,
  //       };
  //     }
  //     const existUser = await User.findOne({ email });

  //     if (existUser) {
  //       return {
  //         status: "fail",
  //         message: "user is already exist",
  //       };
  //     }

  //     const hashedPAssword = await hashpass.hashPassword(password, 10);

  //     const newUser = new User({
  //       username,
  //       email,
  //       password: hashedPAssword,
  //       phone,
  //       role,
  //     });
  //     const result = await newUser.save();
  //     const { password: _, ...userWithoutPassword } = result.toObject();

  //     return {
  //       status: "your account has been created",
  //       data: userWithoutPassword,
  //     };
  //   } catch (err) {}

  //   return {
  //     status: "success",
  //     message: "User data received",
  //   };
  // }
  async signIn(user: IUser) {
    const { email, password } = user;
    try {
      const { error, value } = schemas.signInSchema.validate({
        email,
        password,
      });

      const existUser = await User.findOne({ email });

      if (!existUser) {
        return {
          status: "fail",
          message: "user is not Exist",
        };
      }

      console.log(existUser);

      const result = await hashpass.hashValidation(
        password,
        existUser.password
      );
      if (!result) {
        return {
          status: "fail",
          message: "ivalid credential",
        };
      }

      const token = jwt.sign(
        {
          userName: existUser.username,
          userID: existUser._id,
          email: existUser.email,
          verified: existUser.verified,
          avatar: existUser.avatar,
          role: existUser.role,
        },
        process.env.TOKEN_SECRET as string
      );

      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }
      return {
        status: "success",
        message: "Login successful",
        token: token,
      };
    } catch (err) {
      return {
        status: "error",
        message: "internal server error",
      };
    }
  }
  async signout(): Promise<{ message: string }> {
    return { message: "Successfully signed out" };
  }

  async sendVerificationCode(user: IUser) {
    const { email } = user;
    try {
      const existUser = await User.findOne({ email });
      if (!existUser) {
        return {
          status: "fail",
          message: "User does not exist",
        };
      }

      if (existUser.verified) {
        return {
          status: "fail",
          message: "You are already verified!",
        };
      }

      const verificationCodevalue = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const info = await transport.sendMail({
        from: process.env.SEND_EMAIL_ADDRESS,
        to: existUser.email,
        subject: "Verification Code",
        html: `<h1>${verificationCodevalue}</h1>`,
      });
      const secret = process.env.VERIFICATION_CODE_SECRET;
      if (info.accepted[0] === existUser.email) {
        const hashedCodevalue = await myHash.hmacProcess(
          verificationCodevalue,
          secret as string
        );

        existUser.verificationCode = hashedCodevalue;
        existUser.verificationCodeValidation = Date.now() + 10 * 60 * 1000;
        await existUser.save();

        return {
          status: "success",
          message: "Verification code sent",
        };
      }

      return {
        status: "fail",
        message: "Verification code not sent",
      };
    } catch (error) {
      console.error("Verification error:", error);
      return {
        status: "error",
        message: "Internal server error",
      };
    }
  }
  async verfiycode(email: string, providedCode: string) {
    try {
      const { error, value } = schemas.acceptCodeSchema.validate({
        email,
        providedCode,
      });
      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }
      const codeValue = providedCode.toString();
      const existUser = await User.findOne({ email }).select(
        "+verificationCodeValidation +verificationCode"
      );
      if (!existUser) {
        return {
          status: "fail",
          message: "user does not exist!",
        };
      }
      if (existUser.verified) {
        return {
          status: "fail",
          message: "You are already verified!",
        };
      }
      if (
        !existUser.verificationCode ||
        !existUser.verificationCodeValidation
      ) {
        return {
          status: "fail",
          message: "something is wrong with code!",
        };
      }
      if (Date.now() - existUser.verificationCodeValidation > 5 * 60 * 1000) {
        return {
          status: "fail",
          message: "Code has expired!",
        };
      }
      const hashedCodevalue = await myHash.hmacProcess(
        codeValue,
        process.env.VERIFICATION_CODE_SECRET as string
      );
      if (hashedCodevalue !== existUser.verificationCode) {
        return {
          status: "fail",
          message: "Invalid verification code",
        };
      }
      if (hashedCodevalue === existUser.verificationCode) {
        existUser.verified = true;
        existUser.verificationCode = undefined;
        existUser.verificationCodeValidation = undefined;
        await existUser.save();
        return {
          status: "success",
          message: "Verification successful",
        };
      }
      return {
        status: "fail",
        message: "Invalid verification code",
      };
    } catch (error) {
      console.log("verification error: ", error);
    }
  }
  async changePassword(user: {
    oldPassword: string;
    newPassword: string;
    _id: string;
  }) {
    const { oldPassword, newPassword } = user;

    try {
      const { error } = schemas.changePasswordSchema.validate({
        oldPassword,
        newPassword,
      });

      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }

      // Using the JWT token to identify the user would be needed here
      // This assumes you have the user ID from the JWT token in the request
      const existUser = await User.findById(user._id).select("password");
      if (!existUser) {
        return {
          status: "fail",
          message: "User does not exist",
        };
      }

      const isValidPassword = await hashpass.hashValidation(
        oldPassword,
        existUser.password
      );
      if (!isValidPassword) {
        return {
          status: "fail",
          message: "Current password is incorrect",
        };
      }

      const hashedNewPassword = await hashpass.hashPassword(newPassword, 10);
      existUser.password = hashedNewPassword;
      await existUser.save();

      return {
        status: "success",
        message: "Password changed successfully",
      };
    } catch (err) {
      return {
        status: "error",
        message: "Internal server error",
      };
    }
  }
  async forgetPassword(user: IUser) {
    console.log(user);

    try {
      const existUser = await User.findOne({ email: user });
      console.log("Found user:", existUser);

      if (!existUser) {
        return {
          status: "fail",
          message: "User does not exist",
        };
      }
      const verificationCodevalue = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const info = await transport.sendMail({
        from: process.env.SEND_EMAIL_ADDRESS,
        to: existUser.email,
        subject: "forget password Code ",
        html: `<h1>${verificationCodevalue}</h1>`,
      });
      const secret = process.env.VERIFICATION_CODE_SECRET;
      if (info.accepted[0] === existUser.email) {
        const hashedCodevalue = await myHash.hmacProcess(
          verificationCodevalue,
          secret as string
        );

        existUser.forgetPasswordCode = hashedCodevalue;
        existUser.forgetPasswordCodeValidation = Date.now() + 10 * 60 * 1000;
        await existUser.save();

        return {
          status: "success",
          message: "Verification code sent",
        };
      }

      return {
        status: "fail",
        message: "Verification code not sent",
      };
    } catch (error) {
      console.error("Verification error:", error);
      return {
        status: "error",
        message: "Internal server error",
      };
    }
  }

  async verifyForgetPassword(providedCode: string, newPassword: string) {
    try {
      // Validate input
      const { error } = schemas.acceptForgetPasswordCodeSchema.validate({
        providedCode,
        newPassword,
      });
      if (error) {
        return { status: "fail", message: error.details[0].message };
      }

      // Hash the provided code
      const codeValue = providedCode.toString();
      const hashedCodevalue = await myHash.hmacProcess(
        codeValue,
        process.env.VERIFICATION_CODE_SECRET as string
      );

      // Find the user by the hashed code
      const existUser = await User.findOne({
        forgetPasswordCode: hashedCodevalue,
      }).select("+forgetPasswordCodeValidation +forgetPasswordCode");

      // Validate user and code existence
      if (!existUser) {
        return { status: "fail", message: "user does not exist!" };
      }

      if (!existUser.forgetPasswordCodeValidation) {
        return { status: "fail", message: "something is wrong with code!" };
      }

      // Check code expiration (5 minutes)
      if (Date.now() - existUser.forgetPasswordCodeValidation > 5 * 60 * 1000) {
        return { status: "fail", message: "Code has expired!" };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user fields
      existUser.password = hashedPassword;
      existUser.verified = true;
      existUser.forgetPasswordCode = undefined;
      existUser.forgetPasswordCodeValidation = undefined;

      await existUser.save();

      return { status: "success", message: "Verification successful" };
    } catch (error) {
      console.log("verification error: ", error);
      return { status: "error", message: "Internal error during verification" };
    }
  }
}
