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
exports.getUserData = exports.getAdminProducts = void 0;
const product_1 = __importDefault(require("../model/product"));
const user_1 = __importDefault(require("../model/user"));
const getAdminProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allProducts = yield product_1.default.find({});
    const adminProducts = allProducts.filter((product) => {
        if (product.adminId == req.user.userID) {
            return product;
        }
    });
    if (adminProducts.length === 0) {
        res.status(404).json({
            status: "fail",
            message: "No products found for this admin",
        });
        return;
    }
    try {
        res.status(200).json({
            status: "success",
            products: adminProducts,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});
exports.getAdminProducts = getAdminProducts;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userInfo = yield user_1.default.find({ _id: req.params.id });
    if (!userInfo) {
        res.status(404).json({
            status: "fail",
            message: "User Not found",
        });
        return;
    }
    else {
        res.status(200).json({
            status: "success",
            data: userInfo,
        });
    }
});
exports.getUserData = getUserData;
