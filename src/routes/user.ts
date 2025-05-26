// router/user.ts or similar

import { Router, Request, Response } from "express";
import UserService from "../service/user";
import UserControl from "../control/user";
import authenticateJWT from "../middleware/identifyUser";
import verifyToken from "../middleware/verifyToken";
import multer, { FileFilterCallback } from "multer";
const path = require("path");

const router = Router();

const userService = new UserService();
const userControl = new UserControl(userService);

// const diskStorage = multer.diskStorage({
//   destination: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     const dest = path.join(__dirname, "../uploads");
//     console.log(dest);

//     cb(null, dest);
//   },
//   filename: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `user-${Date.now()}${Math.random() * 1000}.${ext}`;
//     cb(null, fileName);
//   },
// });

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    cb(null, true);
  } else {
    cb(new Error("File must be an image"));
  }
};

const upload = multer({
  // storage: diskStorage,
  storage: multer.memoryStorage(),
  fileFilter,
});

router.post("/signup",upload.single("avatar"), (req, res) => userControl.signUpController(req, res));
router.post("/signin", userControl.loginController.bind(userControl));
router.post("/signout", userControl.logOutController.bind(userControl));
router.patch(
  "/verification-code",
  userControl.sendVerificationCodeController.bind(userControl)
);
router.patch(
  "/verification",
  userControl.acceptCodeController.bind(userControl)
);
router.patch(
  "/change-password",
  authenticateJWT,
  userControl.changePasswordController.bind(userControl)
);
router.patch(
  "/forget-password",
  userControl.forgetPasswordController.bind(userControl)
);
router.patch(
  "/forget-password-verification",
  userControl.forgetPasswordVerificationController.bind(userControl)
);

// router.patch(
//   "/changeEmail",
//   verifyToken,
//   userControl.changeEmail.bind(userControl)
// );
// router.patch(
//   "/changePhone",
//   verifyToken,
//   userControl.changePhone.bind(userControl)
// );
// router.patch(
//   "/changeUserName",
//   verifyToken,
//   userControl.changeUsername.bind(userControl)
// );
router.patch(
  "/changeUserInfo",
  upload.single("avatar"),
  verifyToken,
  (req, res, next) => {
    Promise.resolve(userControl.changeUserInfo(req, res)).catch(next);
  }
);

export default router;
