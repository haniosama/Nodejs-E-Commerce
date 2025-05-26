"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    order_details: {
        type: Object,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
    },
    products: {
        type: Array,
        required: true,
    },
    adminsId: {
        type: Array,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});
const OrderModel = mongoose_1.default.model("order", schema);
exports.default = OrderModel;
