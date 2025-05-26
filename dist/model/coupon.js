"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 1000,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
const CouponModel = mongoose_1.default.model("Coupon", couponSchema);
exports.default = CouponModel;
