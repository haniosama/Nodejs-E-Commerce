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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const wishList_1 = require("../service/wishList");
const router = express_1.default.Router();
router.post("/wishlist/:productId", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, wishList_1.addToWishlist)(req.user.userID, req.params.productId);
        res.json({ message: "Added to wishlist", wishlist: updatedUser.wishlist });
    }
    catch (err) {
        res.status(400).json({
            message: err instanceof Error ? err.message : "Unknown error occurred",
        });
    }
}));
router.delete("/wishlist/:productId", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, wishList_1.removeFromWishlist)(req.user.userID, req.params.productId);
        res.json({
            message: "Removed from wishlist",
            wishlist: updatedUser.wishlist,
        });
    }
    catch (err) {
        res.status(400).json({
            message: err instanceof Error ? err.message : "Unknown error occurred",
        });
    }
}));
router.get("/wishlist", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlist = yield (0, wishList_1.getWishlist)(req.user.userID);
        res.json({ wishlist });
    }
    catch (err) {
        res.status(400).json({
            message: err instanceof Error ? err.message : "Unknown error occurred",
        });
    }
}));
exports.default = router;
