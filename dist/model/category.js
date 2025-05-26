"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: "https://placehold.co/300?text=Category",
    },
});
let CategoryModel = mongoose_1.default.model("category", schema);
exports.default = CategoryModel;
