import Joi from "joi";

const signUpSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_.\-\s]{3,30}$/)
    .required(),
  email: Joi.string()
    .required()
    .min(6)
    .max(60)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
    .required()
    .messages({
      "string.pattern.base": "Password contains invalid characters",
    }),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be a valid number with 7 to 15 digits",
    }),
  role: Joi.string().valid("user", "admin").required().messages({
    "any.only": "Role must be either 'user' or 'admin'",
  }),
  avatar: Joi.string().uri().allow(null, "").optional(), // ممكن تكون فارغة أو null
});

const signInSchema = Joi.object({
  email: Joi.string()
    .required()
    .min(6)
    .max(60)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
    .required()
    .messages({
      "string.pattern.base": "Password contains invalid characters",
    }),
});
const acceptCodeSchema = Joi.object({
  email: Joi.string()
    .required()
    .min(6)
    .max(60)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  providedCode: Joi.number().required(),
});

const changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
    .required()
    .messages({
      "string.pattern.base": "Password contains invalid characters",
    }),
  oldPassword: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]*$"))
    .required()
    .messages({
      "string.pattern.base": "Password contains invalid characters",
    }),
});
const acceptForgetPasswordCodeSchema = Joi.object({
  providedCode: Joi.number().required(),
  newPassword: Joi.string()
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

export default schemas;
