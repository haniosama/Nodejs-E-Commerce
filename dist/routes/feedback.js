"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_1 = __importDefault(require("../control/feedback"));
const feedback_2 = __importDefault(require("../service/feedback"));
let router = (0, express_1.Router)();
let feedBackService = new feedback_2.default();
let feedBackControls = new feedback_1.default(feedBackService);
router.post('/feedback', (req, res) => feedBackControls.createFeedBack(req, res));
exports.default = router;
