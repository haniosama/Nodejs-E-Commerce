"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const signUpSchema = joi_1.default.object({
    username: joi_1.default.string()
        .pattern(/^[a-zA-Z0-9_.\-\s]{3,30}$/)
        .required(),
    email: joi_1.default.string()
        .required()
        .min(6)
        .max(60)
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
    password: joi_1.default.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
        .required()
        .messages({
        "string.pattern.base": "Password contains invalid characters",
    }),
    phone: joi_1.default.string()
        .pattern(/^\+?[0-9]{7,15}$/)
        .required()
        .messages({
        "string.pattern.base": "Phone must be a valid number with 7 to 15 digits",
    }),
    role: joi_1.default.string().valid("user", "admin").required().messages({
        "any.only": "Role must be either 'user' or 'admin'",
    }),
    avatar: joi_1.default.string().uri().allow(null, "").optional(), // ممكن تكون فارغة أو null
});
const signInSchema = joi_1.default.object({
    email: joi_1.default.string()
        .required()
        .min(6)
        .max(60)
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
    password: joi_1.default.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
        .required()
        .messages({
        "string.pattern.base": "Password contains invalid characters",
    }),
});
const acceptCodeSchema = joi_1.default.object({
    email: joi_1.default.string()
        .required()
        .min(6)
        .max(60)
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
    providedCode: joi_1.default.number().required(),
});
const changePasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
        .required()
        .messages({
        "string.pattern.base": "Password contains invalid characters",
    }),
    oldPassword: joi_1.default.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
        .required()
        .messages({
        "string.pattern.base": "Password contains invalid characters",
    }),
});
const acceptForgetPasswordCodeSchema = joi_1.default.object({
    providedCode: joi_1.default.number().required(),
    newPassword: joi_1.default.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
        .required()
        .messages({
        "string.pattern.base": "Password contains invalid characters",
    }),
});
const schemas = {
    signUpSchema,
    signInSchema,
    acceptCodeSchema,
    changePasswordSchema,
    acceptForgetPasswordCodeSchema,
};
exports.default = schemas;
