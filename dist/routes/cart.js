"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = __importDefault(require("../control/cart"));
const cart_2 = __importDefault(require("../service/cart"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = express_1.default.Router();
const cartControl = new cart_1.default(new cart_2.default());
router.post("/cart/add", verifyToken_1.default, (req, res) => cartControl.addToCart(req, res));
router.get("/cart", verifyToken_1.default, (req, res) => cartControl.getUserCart(req, res));
router.put("/cart/update", verifyToken_1.default, (req, res) => cartControl.updateQuantity(req, res));
router.delete("/cart/remove/:productId", verifyToken_1.default, (req, res) => cartControl.removeFromCart(req, res));
router.delete("/cart/clear", verifyToken_1.default, (req, res) => cartControl.clearCart(req, res));
router.post("/cart/apply-coupon", verifyToken_1.default, (req, res) => cartControl.applyCoupon(req, res));
exports.default = router;
