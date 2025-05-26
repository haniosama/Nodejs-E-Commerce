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
class CategoriesControl {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    getAllService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resSer = yield this.categoriesService.handleGetAllCategory();
            if (resSer.status == "fail") {
                res.status(404).send(resSer);
            }
            else {
                res.status(200).send(resSer);
            }
        });
    }
    getSpecificCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = req.params.name;
            let resSer = yield this.categoriesService.handleSpecificCategory(name);
            if (resSer.status == "fail") {
                res.status(404).send(resSer);
            }
            else {
                res.status(200).send(resSer);
            }
        });
    }
    addcategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.body;
            let resSer = yield this.categoriesService.handleAddCategory(body);
            console.log(resSer);
            if (resSer.status == "fail") {
                res.status(404).send(resSer);
            }
            else {
                res.status(201).send(resSer);
            }
        });
    }
}
exports.default = CategoriesControl;
