import UserModel from "../model/user";
import UserService from "../service/user";
import { Response, Request, NextFunction } from "express";
import hashpass from "../utils/hash";
import cloudinary from "../service/cloudinary";
export default class UserControl {
  constructor(private userService: UserService) {}

  async signUpController(req: Request, res: Response) {
        try {
      const result = await this.userService.signUp(req.body , req.file );
      const statusCode = result.status === "fail" ? 400 : 200;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async loginController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.userService.signIn(req.body);

      if (result.status === "success" && result.token) {
        res.cookie("auth_token", result.token, {
          sameSite: "strict",
          maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
          status: "success",
          message: result.message,
          token: result.token,
        });
      } else {
        res.status(401).json({
          status: result.status,
          message: result.message,
        });
      }
    } catch (err) {
      console.error("Error during login:", err);
      next(err);
    }
  }
  async logOutController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies?.auth_token;

      if (!token) {
        res.status(400).json({
          status: "fail",
          message: "No active session found",
        });
        return;
      }

      res.clearCookie("auth_token", {
        sameSite: "strict",
        httpOnly: true,
      });

      res.status(200).json({
        status: "success",
        message: "Successfully signed out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      next(error);
    }
  }

  async sendVerificationCodeController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = req.body;

    try {
      const result = await this.userService.sendVerificationCode(user);
      const statusCode = result.status === "fail" ? 400 : 200;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
      next(error);
    }
  }
  async acceptCodeController(req: Request, res: Response, next: NextFunction) {
    const { email, providedCode } = req.body;

    try {
      const result = await this.userService.verfiycode(email, providedCode);
      if (!result) {
        res
          .status(500)
          .json({ status: "error", message: "No result returned" });
        return;
      }
      const statusCode = result.status === "fail" ? 400 : 200;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
      next(error);
    }
  }
  async changePasswordController(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { oldPassword, newPassword } = req.body;
    const _id = req.user?.userID;

    if (!_id) {
      res.status(401).json({ status: "fail", message: "Unauthorized" });
      return;
    }

    try {
      const result = await this.userService.changePassword({
        _id, // ✅ Now passing the user ID
        oldPassword,
        newPassword,
      });
      const statusCode = result.status === "fail" ? 400 : 200;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
      next(error);
    }
  }

  async forgetPasswordController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;

    try {
      const result = await this.userService.forgetPassword(email);
      if (!result) {
        res
          .status(500)
          .json({ status: "error", message: "No result returned" });
        return;
      }
      const statusCode = result.status === "fail" ? 400 : 200;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
      next(error);
    }
  }

  async forgetPasswordVerificationController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { providedCode, newPassword } = req.body;

    try {
      const result = await this.userService.verifyForgetPassword(
        providedCode,
        newPassword
      );
      if (!result) {
        res
          .status(500)
          .json({ status: "error", message: "No result returned" });
        return;
      }
      const statusCode = result.status === "fail" ? 400 : 200;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
      next(error);
    }
  }

  //#region old code for change user info but every thing sperated

  // async changeEmail(req: Request, res: Response) {
  //   const newEmail = req.body.email;
  //   const oldEmail = req.user.email;

  //   try {
  //     const user = await UserModel.findOne({ email: oldEmail });
  //     if (!user) {
  //       res.status(404).json({ status: "fail", message: "User not found" });
  //       return;
  //     }
  //     user.email = newEmail;
  //     await user.save();
  //     res.status(200).json({
  //       status: "success",
  //       message: "Email updated successfully",
  //       data: user,
  //     });
  //   } catch (error) {
  //     console.error("Error updating email:", error);
  //     res
  //       .status(500)
  //       .json({ status: "error", message: "Internal server error" });
  //   }
  // }

  // async changeUsername(req: Request, res: Response) {
  //   const newuserName = req.body.username;

  //   try {
  //     const user = await UserModel.findOne({ _id: req.user.userID });
  //     if (!user) {
  //       res.status(404).json({ status: "fail", message: "User not found" });
  //       return;
  //     }
  //     user.username = newuserName;
  //     await user.save();
  //     res.status(200).json({
  //       status: "success",
  //       message: "User Name updated successfully",
  //       data: user,
  //     });
  //   } catch (error) {
  //     console.error("Error updating User Name:", error);
  //     res
  //       .status(500)
  //       .json({ status: "error", message: "Internal server error" });
  //   }
  // }

  // async changePhone(req: Request, res: Response) {
  //   const newPhone = req.body.phone;

  //   try {
  //     const user = await UserModel.findOne({ _id: req.user.userID });
  //     if (!user) {
  //       res.status(404).json({ status: "fail", message: "User not found" });
  //       return;
  //     }
  //     user.phone = newPhone;
  //     await user.save();
  //     res.status(200).json({
  //       status: "success",
  //       message: "Phone updated successfully",
  //       data: user,
  //     });
  //   } catch (error) {
  //     console.error("Error updating Phone:", error);
  //     res
  //       .status(500)
  //       .json({ status: "error", message: "Internal server error" });
  //   }
  // }

  //#endregion

  // async changeUserInfo(req: Request, res: Response) {
  //   const newData = req.body;

  //   if (req.file) {
  //     newData.avatar = req.file?.filename;
  //   } else if (req.body.oldAvatar) {
  //     newData.avatar = req.body.oldAvatar;
  //   }

  //   try {
  //     const user = await UserModel.findOne({ _id: req.user.userID });
  //     if (!user) {
  //       res.status(404).json({ status: "fail", message: "User not found" });
  //       return;
  //     }

  //     if (newData.oldPassword) {
  //       const isValidPassword = await hashpass.hashValidation(
  //         newData.oldPassword,
  //         user.password
  //       );

  //       if (!isValidPassword) {
  //         res.status(404).json({
  //           status: "fail",
  //           message: "Old password is incorrect",
  //         });
  //         return;
  //       }
  //     }
  //     delete newData.email;
  //     Object.assign(user, newData);

  //     if (newData.oldPassword) {
  //       const hashedNewPassword = await hashpass.hashPassword(
  //         newData.newPassword,
  //         10
  //       );
  //       user.password = hashedNewPassword;
  //     }

  //     await user.save();
  //     res.status(200).json({
  //       status: "success",
  //       message: "Phone updated successfully",
  //       data: user,
  //     });
  //   } catch (error) {
  //     console.error("Error updating Phone:", error);
  //     res
  //       .status(500)
  //       .json({ status: "error", message: "Internal server error" });
  //   }
  // }


  async changeUserInfo(req: Request, res: Response) {
  const newData = req.body;


  console.log("avatar" , req.file);
  
  if (req.file) {
    try {
      const cloudinaryResult = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) return reject(error);
            if (result?.secure_url) resolve(result.secure_url);
            else reject("No URL returned from Cloudinary");
          }
        ).end(req.file?.buffer);
      });

      newData.avatar = cloudinaryResult; 

    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Failed to upload avatar image",
        error: err,
      });
    }

  } else if (req.body.oldAvatar) {
    newData.avatar = req.body.oldAvatar;
  }

  try {
    const user = await UserModel.findOne({ _id: req.user.userID });
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (newData.oldPassword) {
      const isValidPassword = await hashpass.hashValidation(
        newData.oldPassword,
        user.password
      );

      if (!isValidPassword) {
        return res.status(404).json({
          status: "fail",
          message: "Old password is incorrect",
        });
      }
    }

    delete newData.email;

    Object.assign(user, newData);

    if (newData.oldPassword) {
      const hashedNewPassword = await hashpass.hashPassword(
        newData.newPassword,
        10
      );
      user.password = hashedNewPassword;
    }

    await user.save();

    res.status(200).json({
      status: "success",
      message: "User info updated successfully",
      data: user,
    });

  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

}
