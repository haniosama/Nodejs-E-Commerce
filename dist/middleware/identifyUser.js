"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log(token);
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || "fallback_secret", (err, user) => {
            console.log(process.env.TOKEN_SECRET);
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
}
exports.default = authenticateJWT;
