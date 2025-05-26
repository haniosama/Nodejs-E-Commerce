"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"] || req.headers["Authorization"];
    if (!token) {
        res.status(401).send({
            status: "Error",
            message: "No token provided!",
        });
        return;
    }
    token = Array.isArray(token) ? token[0] : token;
    token = token.split(" ")[1];
    console.log(token);
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send({
            status: "Error",
            message: "Token secret is not defined!",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).send({
            status: "Error",
            message: "Token is not valid!",
        });
    }
};
exports.default = verifyToken;
