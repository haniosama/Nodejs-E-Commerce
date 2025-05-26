"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const dashboard_1 = require("../control/dashboard");
const router = (0, express_1.Router)();
router.route("/dashboard").get(verifyToken_1.default, dashboard_1.getAdminProducts);
router.route("/user/:id").get(verifyToken_1.default, dashboard_1.getUserData);
exports.default = router;
