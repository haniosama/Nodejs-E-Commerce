"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenValidation = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
        next();
    }
    else {
        res.status(400).json({
            status: "error",
            message: "token Not Found",
        });
    }
};
const checkRole = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
        try {
            let user = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            if (user.role == "admin") {
                next();
            }
            else {
                res.status(500).json({
                    status: "fail",
                    message: "This operation  available for admin",
                });
            }
        }
        catch (errors) {
            res.status(500).json({
                status: "fail",
                errors,
            });
        }
    }
    else {
        res.status(400).json({
            status: "error",
            message: "token Not Found",
        });
    }
};
module.exports = { checkRole, tokenValidation };
