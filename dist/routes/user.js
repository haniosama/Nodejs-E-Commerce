"use strict";
// router/user.ts or similar
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../service/user"));
const user_2 = __importDefault(require("../control/user"));
const identifyUser_1 = __importDefault(require("../middleware/identifyUser"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const multer_1 = __importDefault(require("multer"));
const path = require("path");
const router = (0, express_1.Router)();
const userService = new user_1.default();
const userControl = new user_2.default(userService);
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
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0];
    if (imageType === "image") {
        cb(null, true);
    }
    else {
        cb(new Error("File must be an image"));
    }
};
const upload = (0, multer_1.default)({
    // storage: diskStorage,
    storage: multer_1.default.memoryStorage(),
    fileFilter,
});
router.post("/signup", upload.single("avatar"), (req, res) => userControl.signUpController(req, res));
router.post("/signin", userControl.loginController.bind(userControl));
router.post("/signout", userControl.logOutController.bind(userControl));
router.patch("/verification-code", userControl.sendVerificationCodeController.bind(userControl));
router.patch("/verification", userControl.acceptCodeController.bind(userControl));
router.patch("/change-password", identifyUser_1.default, userControl.changePasswordController.bind(userControl));
router.patch("/forget-password", userControl.forgetPasswordController.bind(userControl));
router.patch("/forget-password-verification", userControl.forgetPasswordVerificationController.bind(userControl));
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
router.patch("/changeUserInfo", upload.single("avatar"), verifyToken_1.default, (req, res, next) => {
    Promise.resolve(userControl.changeUserInfo(req, res)).catch(next);
});
exports.default = router;
