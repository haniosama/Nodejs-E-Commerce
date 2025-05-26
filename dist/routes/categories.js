"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = __importDefault(require("../service/category"));
const category_2 = __importDefault(require("../control/category"));
let router = (0, express_1.Router)();
let categoriesService = new category_1.default();
let categoriesControl = new category_2.default(categoriesService);
router.get("/categories", (req, res) => categoriesControl.getAllService(req, res));
router.get("/categories/:name", (req, res) => categoriesControl.getSpecificCategory(req, res));
router.post("/categories", (req, res) => categoriesControl.addcategory(req, res));
exports.default = router;
