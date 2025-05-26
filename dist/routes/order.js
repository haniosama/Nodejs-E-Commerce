"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_1 = __importDefault(require("../service/order"));
const order_2 = __importDefault(require("../control/order"));
const router = (0, express_1.Router)();
const orderService = new order_1.default();
const orderControler = new order_2.default(orderService);
router.post("/order", (req, res) => orderControler.createOrder(req, res));
router.get("/order/:userId", (req, res) => orderControler.getOrdersForUser(req, res));
router.get("/order/admin/:adminId", (req, res) => orderControler.getOrderForAdmin(req, res));
router.get("/ordercomplate/:orderId", (req, res) => orderControler.complateOreder(req, res));
router.delete("/orders/delete/:userId", (req, res) => orderControler.deleteAllOrders(req, res));
router.delete("/order/delete/:orderId", (req, res) => orderControler.deleteSpecificOrder(req, res));
exports.default = router;
