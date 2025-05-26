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
class CartControl {
    constructor(cartService) {
        this.cartService = cartService;
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.body.productId;
            const result = yield this.cartService.handleAddToCart(productId, req.user.userID);
            res.status(result.status === "success" ? 200 : 400).json(result);
        });
    }
    getUserCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartService.handleGetCart(req.user.userID);
            res.status(result.status === "success" ? 200 : 400).json(result);
        });
    }
    updateQuantity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, quantity } = req.body;
            const result = yield this.cartService.handleUpdateQuantity(req.user.userID, productId, quantity);
            res.status(result.status === "success" ? 200 : 400).json(result);
        });
    }
    removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.productId;
            const result = yield this.cartService.handleRemoveProduct(req.user.userID, productId);
            res.status(result.status === "success" ? 200 : 400).json(result);
        });
    }
    clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartService.handleClearCart(req.user.userID);
            res.status(result.status === "success" ? 200 : 400).json(result);
        });
    }
    applyCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            const result = yield this.cartService.applyCoupon(req.user.userID, code);
            res.status(result.status === "success" ? 200 : 400).json(result);
        });
    }
}
exports.default = CartControl;
