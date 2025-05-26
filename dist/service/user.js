"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../model/user"));
const validator_1 = __importDefault(require("../middleware/validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash_1 = __importDefault(require("../utils/hash"));
const hash_2 = __importDefault(require("../utils/hash"));
const sendemail_1 = __importDefault(require("../middleware/sendemail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = __importDefault(require("./cloudinary"));
class UserService {
    constructor() { }
    signUp(user, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, phone, role, avatar } = user;
            console.log("user", user);
            try {
                let avatarUrl = null;
                if (file) {
                    avatarUrl = yield new Promise((resolve, reject) => {
                        cloudinary_1.default.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
                            if (error)
                                return reject(error);
                            if (result === null || result === void 0 ? void 0 : result.secure_url)
                                resolve(result.secure_url);
                            else
                                reject("No URL returned from Cloudinary");
                        }).end(file === null || file === void 0 ? void 0 : file.buffer);
                    });
                }
                else if (avatar) {
                    avatarUrl = avatar;
                }
                console.log("avatarUrl", avatarUrl);
                const { error } = validator_1.default.signUpSchema.validate({
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
                const existUser = yield user_1.default.findOne({ email });
                if (existUser) {
                    return {
                        status: "fail",
                        message: "User already exists",
                    };
                }
                const hashedPassword = yield hash_2.default.hashPassword(password, 10);
                // بيانات المستخدم الجديدة بدون Avatar افتراضي
                const newUserData = {
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
                const newUser = new user_1.default(newUserData);
                const result = yield newUser.save();
                const _a = result.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
                return {
                    status: "your account has been created",
                    data: userWithoutPassword,
                };
            }
            catch (err) {
                console.error("Signup error:", err);
                return {
                    status: "error",
                    message: "Internal server error",
                };
            }
        });
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
    signIn(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = user;
            try {
                const { error, value } = validator_1.default.signInSchema.validate({
                    email,
                    password,
                });
                const existUser = yield user_1.default.findOne({ email });
                if (!existUser) {
                    return {
                        status: "fail",
                        message: "user is not Exist",
                    };
                }
                console.log(existUser);
                const result = yield hash_2.default.hashValidation(password, existUser.password);
                if (!result) {
                    return {
                        status: "fail",
                        message: "ivalid credential",
                    };
                }
                const token = jsonwebtoken_1.default.sign({
                    userName: existUser.username,
                    userID: existUser._id,
                    email: existUser.email,
                    verified: existUser.verified,
                    avatar: existUser.avatar,
                    role: existUser.role,
                }, process.env.TOKEN_SECRET);
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
            }
            catch (err) {
                return {
                    status: "error",
                    message: "internal server error",
                };
            }
        });
    }
    signout() {
        return __awaiter(this, void 0, void 0, function* () {
            return { message: "Successfully signed out" };
        });
    }
    sendVerificationCode(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = user;
            try {
                const existUser = yield user_1.default.findOne({ email });
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
                const verificationCodevalue = Math.floor(100000 + Math.random() * 900000).toString();
                const info = yield sendemail_1.default.sendMail({
                    from: process.env.SEND_EMAIL_ADDRESS,
                    to: existUser.email,
                    subject: "Verification Code",
                    html: `<h1>${verificationCodevalue}</h1>`,
                });
                const secret = process.env.VERIFICATION_CODE_SECRET;
                if (info.accepted[0] === existUser.email) {
                    const hashedCodevalue = yield hash_1.default.hmacProcess(verificationCodevalue, secret);
                    existUser.verificationCode = hashedCodevalue;
                    existUser.verificationCodeValidation = Date.now() + 10 * 60 * 1000;
                    yield existUser.save();
                    return {
                        status: "success",
                        message: "Verification code sent",
                    };
                }
                return {
                    status: "fail",
                    message: "Verification code not sent",
                };
            }
            catch (error) {
                console.error("Verification error:", error);
                return {
                    status: "error",
                    message: "Internal server error",
                };
            }
        });
    }
    verfiycode(email, providedCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = validator_1.default.acceptCodeSchema.validate({
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
                const existUser = yield user_1.default.findOne({ email }).select("+verificationCodeValidation +verificationCode");
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
                if (!existUser.verificationCode ||
                    !existUser.verificationCodeValidation) {
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
                const hashedCodevalue = yield hash_1.default.hmacProcess(codeValue, process.env.VERIFICATION_CODE_SECRET);
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
                    yield existUser.save();
                    return {
                        status: "success",
                        message: "Verification successful",
                    };
                }
                return {
                    status: "fail",
                    message: "Invalid verification code",
                };
            }
            catch (error) {
                console.log("verification error: ", error);
            }
        });
    }
    changePassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { oldPassword, newPassword } = user;
            try {
                const { error } = validator_1.default.changePasswordSchema.validate({
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
                const existUser = yield user_1.default.findById(user._id).select("password");
                if (!existUser) {
                    return {
                        status: "fail",
                        message: "User does not exist",
                    };
                }
                const isValidPassword = yield hash_2.default.hashValidation(oldPassword, existUser.password);
                if (!isValidPassword) {
                    return {
                        status: "fail",
                        message: "Current password is incorrect",
                    };
                }
                const hashedNewPassword = yield hash_2.default.hashPassword(newPassword, 10);
                existUser.password = hashedNewPassword;
                yield existUser.save();
                return {
                    status: "success",
                    message: "Password changed successfully",
                };
            }
            catch (err) {
                return {
                    status: "error",
                    message: "Internal server error",
                };
            }
        });
    }
    forgetPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user);
            try {
                const existUser = yield user_1.default.findOne({ email: user });
                console.log("Found user:", existUser);
                if (!existUser) {
                    return {
                        status: "fail",
                        message: "User does not exist",
                    };
                }
                const verificationCodevalue = Math.floor(100000 + Math.random() * 900000).toString();
                const info = yield sendemail_1.default.sendMail({
                    from: process.env.SEND_EMAIL_ADDRESS,
                    to: existUser.email,
                    subject: "forget password Code ",
                    html: `<h1>${verificationCodevalue}</h1>`,
                });
                const secret = process.env.VERIFICATION_CODE_SECRET;
                if (info.accepted[0] === existUser.email) {
                    const hashedCodevalue = yield hash_1.default.hmacProcess(verificationCodevalue, secret);
                    existUser.forgetPasswordCode = hashedCodevalue;
                    existUser.forgetPasswordCodeValidation = Date.now() + 10 * 60 * 1000;
                    yield existUser.save();
                    return {
                        status: "success",
                        message: "Verification code sent",
                    };
                }
                return {
                    status: "fail",
                    message: "Verification code not sent",
                };
            }
            catch (error) {
                console.error("Verification error:", error);
                return {
                    status: "error",
                    message: "Internal server error",
                };
            }
        });
    }
    verifyForgetPassword(providedCode, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate input
                const { error } = validator_1.default.acceptForgetPasswordCodeSchema.validate({
                    providedCode,
                    newPassword,
                });
                if (error) {
                    return { status: "fail", message: error.details[0].message };
                }
                // Hash the provided code
                const codeValue = providedCode.toString();
                const hashedCodevalue = yield hash_1.default.hmacProcess(codeValue, process.env.VERIFICATION_CODE_SECRET);
                // Find the user by the hashed code
                const existUser = yield user_1.default.findOne({
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
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
                // Update user fields
                existUser.password = hashedPassword;
                existUser.verified = true;
                existUser.forgetPasswordCode = undefined;
                existUser.forgetPasswordCodeValidation = undefined;
                yield existUser.save();
                return { status: "success", message: "Verification successful" };
            }
            catch (error) {
                console.log("verification error: ", error);
                return { status: "error", message: "Internal error during verification" };
            }
        });
    }
}
exports.default = UserService;
