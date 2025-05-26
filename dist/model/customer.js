"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    orders: {
        type: Array,
        require: true
    },
    userDetails: {
        type: Object,
        require: true
    },
    adminsId: {
        type: Array,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});
const CustomerModel = mongoose_1.default.model("custome", schema);
exports.default = CustomerModel;
