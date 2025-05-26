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
const path = require("path");
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../service/product"));
const product_2 = __importDefault(require("../control/product"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const multer_1 = __importDefault(require("multer"));
let router = (0, express_1.default)();
// const diskStorage = multer.diskStorage({
//   destination: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     const dest = path.join(__dirname, "../uploads");
//     console.log(dest);
//     cb(null, dest);
//   },
//   filename: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `user-${Date.now()}${Math.random()*1000}.${ext}`;
//     cb(null, fileName);
//   },
// });
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0];
    if (imageType === "image") {
        cb(null, true);
    }
    else {
        cb(new Error("File must be an image"));
    }
};
const upload = (0, multer_1.default)({
    // storage: diskStorage,
    storage: multer_1.default.memoryStorage(),
    fileFilter,
});
let productService = new product_1.default();
let productControl = new product_2.default(productService);
router.get("/products", (req, res) => productControl.getAllProduct(req, res));
router.get("/product/:id", (req, res) => productControl.getSpecificProduct(req, res));
router.post("/product", upload.array("images", 5), verifyToken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productControl.addProduct(req, res);
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/product/:id", upload.array("images", 5), verifyToken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productControl.updateProduct(req, res);
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/product/:id", verifyToken_1.default, (req, res) => productControl.deleteProduct(req, res));
// Comments
router
    .route("/product/comment/:id")
    .post(verifyToken_1.default, productControl.addComment)
    .get(verifyToken_1.default, productControl.getAllComments);
router
    .route("/product/comment/:id/:commentId")
    .patch(verifyToken_1.default, productControl.updateComment)
    .delete(verifyToken_1.default, productControl.deleteComment);
exports.default = router;
