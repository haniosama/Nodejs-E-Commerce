"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_1 = __importDefault(require("../service/customer"));
const customer_2 = __importDefault(require("../control/customer"));
const router = (0, express_1.Router)();
const customerService = new customer_1.default();
const customeControler = new customer_2.default(customerService);
router.get("/customer/:adminId", (req, res) => customeControler.getAllCustomer(req, res));
exports.default = router;
