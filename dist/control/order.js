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
Object.defineProperty(exports, "__esModule", { value: true });
class OrderControler {
    constructor(orderService) {
        this.orderService = orderService;
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = req.body;
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            console.log(token, "token");
            const resSer = yield this.orderService.handleCreateOrder(body, token);
            if (resSer.status == "success") {
                res.status(200).send(resSer);
            }
            else {
                res.status(500).send(resSer);
            }
        });
    }
    getOrdersForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const userId = req.params.userId;
            const resSer = yield this.orderService.handlegetOrdersForUser(userId, token);
            console.log(resSer);
            if (resSer.status == "success") {
                res.status(200).send(resSer);
            }
            else {
                res.status(500).send(resSer);
            }
        });
    }
    deleteSpecificOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const orderId = req.params.orderId;
            console.log(token, "lllllllllllllllllll");
            const resSer = yield this.orderService.handledeleteSpecificOrder(orderId, token);
            console.log(resSer);
            if (resSer.status == "success") {
                res.status(200).send(resSer);
            }
            else if (resSer.status == "fail") {
                res.status(404).send(resSer);
            }
            else {
                res.status(500).send(resSer);
            }
        });
    }
    deleteAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const userId = req.params.userId;
            const resSer = yield this.orderService.handleDeletetAllOrder(userId, token);
            if (resSer.status == "success") {
                res.status(200).send(resSer);
            }
            else if (resSer.status == "fail") {
                res.status(404).send(resSer);
            }
            else {
                res.status(500).send(resSer);
            }
        });
    }
    complateOreder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const orderId = req.params.orderId;
            const resSer = yield this.orderService.handleComplateOrder(orderId, token);
            if (resSer.status == "success") {
                res.status(200).send(resSer);
            }
            else if (resSer.status == "fail") {
                res.status(404).send(resSer);
            }
            else {
                res.status(500).send(resSer);
            }
        });
    }
    getOrderForAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const adminId = req.params.adminId;
            const resSer = yield this.orderService.handleGetOrderForAdmin(adminId, token);
            if (resSer.status == "success") {
                res.status(200).send(resSer);
            }
            else if (resSer.status == "fail") {
                res.status(404).send(resSer);
            }
            else {
                res.status(500).send(resSer);
            }
        });
    }
}
exports.default = OrderControler;
