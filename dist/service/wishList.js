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
exports.getWishlist = exports.removeFromWishlist = exports.addToWishlist = void 0;
const user_1 = __importDefault(require("../model/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const addToWishlist = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(userId);
    if (!user)
        throw new Error("User not found");
    if (!user.wishlist)
        user.wishlist = [];
    const productObjectId = new mongoose_1.default.Types.ObjectId(productId);
    if (user.wishlist.some((id) => id.equals(productObjectId))) {
        throw new Error("Product already in wishlist");
    }
    user.wishlist.push(productObjectId);
    yield user.save();
    return user;
});
exports.addToWishlist = addToWishlist;
const removeFromWishlist = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(userId);
    if (!user)
        throw new Error("User not found");
    if (!user.wishlist)
        return user;
    const productObjectId = new mongoose_1.default.Types.ObjectId(productId);
    user.wishlist = user.wishlist.filter((id) => !id.equals(productObjectId));
    yield user.save();
    return user;
});
exports.removeFromWishlist = removeFromWishlist;
const getWishlist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(userId).populate("wishlist");
    if (!user)
        throw new Error("User not found");
    return user.wishlist;
});
exports.getWishlist = getWishlist;
