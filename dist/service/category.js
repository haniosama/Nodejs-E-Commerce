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
const category_1 = __importDefault(require("../model/category"));
const product_1 = __importDefault(require("../model/product"));
class CategoriesService {
    handleGetAllCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let categories = yield category_1.default.find();
                return {
                    status: "success",
                    data: categories,
                };
            }
            catch (err) {
                return {
                    status: "fail",
                    message: err,
                };
            }
        });
    }
    handleSpecificCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let category = yield product_1.default.find({ "category.name": name });
                return {
                    status: "success",
                    category,
                };
            }
            catch (err) {
                return {
                    status: "fail",
                    message: err,
                };
            }
        });
    }
    handleAddCategory(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCategory = new category_1.default(Object.assign({}, body));
                console.log(newCategory);
                yield newCategory.save();
                return {
                    status: "success",
                    data: newCategory,
                };
            }
            catch (err) {
                return {
                    status: "fail",
                    message: err,
                };
            }
        });
    }
}
exports.default = CategoriesService;
