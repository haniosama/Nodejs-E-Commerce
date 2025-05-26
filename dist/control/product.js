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
const product_1 = __importDefault(require("../model/product"));
const cloudinary_1 = __importDefault(require("../service/cloudinary"));
// import cloudinary from "../config/cloudinary";
class ProductControl {
    constructor(productService) {
        this.productService = productService;
    }
    getAllProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resSer = yield this.productService.handleGetAllProducts();
            if (resSer.status === "fail") {
                res.status(500).json(resSer);
            }
            else {
                res.status(200).json(resSer);
            }
        });
    }
    getSpecificProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let resSer = yield this.productService.handleGetSpecificProduct(id);
            if (resSer.status === "fail") {
                res.status(404).json(resSer);
            }
            else if (resSer.status == "error") {
                res.status(500).json(resSer);
            }
            else {
                res.status(200).json(resSer);
            }
        });
    }
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.body;
            let token = req.headers["authorization"];
            let filenames = [];
            try {
                if (Array.isArray(req.files)) {
                    const uploadPromises = req.files.map((file) => {
                        return new Promise((resolve, reject) => {
                            cloudinary_1.default.uploader
                                .upload_stream({
                                folder: "products",
                            }, (error, result) => {
                                if (error)
                                    return reject(error);
                                if (result === null || result === void 0 ? void 0 : result.secure_url)
                                    resolve(result.secure_url);
                                else
                                    reject("No URL returned from Cloudinary");
                            })
                                .end(file.buffer);
                        });
                    });
                    filenames = yield Promise.all(uploadPromises);
                }
                let resSer = yield this.productService.handleAddProduct(body, token, filenames);
                if (resSer.status === "error") {
                    return res.status(500).send(resSer);
                }
                res.status(200).send(resSer);
            }
            catch (err) {
                console.error(err);
                res.status(500).send({ status: "error", message: "Image upload failed" });
            }
        });
    }
    // async addProduct(req: Request, res: Response) {
    //   let body = req.body;
    //   let token = req.headers["authorization"] as string;
    //   console.log(req.files);
    //   // Extract filenames from req.files
    //   let filenames: string[] = [];
    //   if (Array.isArray(req.files)) {
    //     filenames = req.files.map((file: any) => file.filename);
    //   } else if (req.files && typeof req.files === "object") {
    //     filenames = Object.values(req.files)
    //       .flat()
    //       .map((file: any) => file.filename);
    //   }
    //   let resSer = await this.productService.handleAddProduct(
    //     body,
    //     token,
    //     filenames
    //   );
    //   if (resSer.status == "error") {
    //     res.status(500).send(resSer);
    //   } else {
    //     res.status(200).send(resSer);
    //   }
    // }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let id = req.params.id;
            if (req.user.role !== "admin") {
                res.status(403).send({
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                });
                return;
            }
            const product = yield this.productService.handleGetSpecificProduct(id);
            const productList = product.product;
            if (!productList || productList.length === 0) {
                res.status(404).send({
                    status: "Error",
                    message: "Product not found",
                });
                return;
            }
            if (((_b = (_a = productList[0]) === null || _a === void 0 ? void 0 : _a.adminId) === null || _b === void 0 ? void 0 : _b.toString()) !== req.user.userID) {
                res.status(401).send({
                    status: "Error",
                    message: "You are not authorized to delete this product",
                });
                return;
            }
            const deleteRes = yield this.productService.handleDeleteProduct(id);
            if (deleteRes.status == "error") {
                res.status(500).send(deleteRes);
            }
            else {
                res.status(200).send(deleteRes);
            }
        });
    }
    // async updateProduct(req: Request, res: Response) {
    //   let id = req.params.id;
    //   let filenames: string[] = [];
    //   if (Array.isArray(req.files) && req.files.length > 0) {
    //     filenames = req.files.map((file: any) => file.filename);
    //   } else if (
    //     req.files &&
    //     typeof req.files === "object" &&
    //     Object.keys(req.files).length > 0
    //   ) {
    //     filenames = Object.values(req.files)
    //       .flat()
    //       .map((file: any) => file.filename);
    //   } else {
    //     const product = await this.productService.handleGetSpecificProduct(id);
    //     const productList = product.product as IProduct[];
    //     if (!productList || productList.length === 0) {
    //       res.status(404).send({
    //         status: "Error",
    //         message: "Product not found",
    //       });
    //       return;
    //     }
    //     filenames = productList[0].images || [];
    //   }
    //   if (req.user.role !== "admin") {
    //     res.status(403).send({
    //       status: "Error",
    //       message: "You are not authorized to access this resource!",
    //     });
    //     return;
    //   }
    //   const product = await this.productService.handleGetSpecificProduct(id);
    //   const productList = product.product as IProduct[];
    //   if (!productList || productList.length === 0) {
    //     res.status(404).send({
    //       status: "Error",
    //       message: "Product not found",
    //     });
    //     return;
    //   }
    //   if (productList[0]?.adminId?.toString() !== req.user.userID) {
    //     res.status(401).send({
    //       status: "Error",
    //       message: "You are not authorized to delete this product",
    //     });
    //     return;
    //   }
    //   const body = req.body;
    //   const updateRes = await this.productService.handleUpdateProduct(
    //     body,
    //     id,
    //     filenames
    //   );
    //   if (updateRes.status == "error") {
    //     res.status(500).send(updateRes);
    //   } else if (updateRes.status == "fail") {
    //     res.status(404).send(updateRes);
    //   } else {
    //     res.status(200).send(updateRes);
    //   }
    // }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const id = req.params.id;
            if (req.user.role !== "admin") {
                return res.status(403).send({
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                });
            }
            const product = yield this.productService.handleGetSpecificProduct(id);
            const productList = product.product;
            if (!productList || productList.length === 0) {
                return res.status(404).send({
                    status: "Error",
                    message: "Product not found",
                });
            }
            if (((_b = (_a = productList[0]) === null || _a === void 0 ? void 0 : _a.adminId) === null || _b === void 0 ? void 0 : _b.toString()) !== req.user.userID) {
                return res.status(401).send({
                    status: "Error",
                    message: "You are not authorized to update this product",
                });
            }
            let filenames = [];
            if (Array.isArray(req.files) && req.files.length > 0) {
                const uploadPromises = req.files.map((file) => {
                    return new Promise((resolve, reject) => {
                        cloudinary_1.default.uploader
                            .upload_stream({ folder: "products" }, (error, result) => {
                            if (error)
                                return reject(error);
                            if (result === null || result === void 0 ? void 0 : result.secure_url)
                                resolve(result.secure_url);
                            else
                                reject("No URL returned from Cloudinary");
                        })
                            .end(file.buffer);
                    });
                });
                try {
                    filenames = yield Promise.all(uploadPromises);
                }
                catch (err) {
                    return res.status(500).send({
                        status: "Error",
                        message: "Image upload failed",
                        error: err,
                    });
                }
            }
            else {
                filenames = productList[0].images || [];
            }
            const body = req.body;
            const updateRes = yield this.productService.handleUpdateProduct(body, id, filenames);
            if (updateRes.status === "error") {
                return res.status(500).send(updateRes);
            }
            else if (updateRes.status === "fail") {
                return res.status(404).send(updateRes);
            }
            else {
                return res.status(200).send(updateRes);
            }
        });
    }
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let productId = req.params.id;
            const Comment = {
                userId: req.user.userID,
                comment: req.body.comment,
                // userName: req.user.userName,
                createdAt: new Date(),
            };
            try {
                const updateRes = yield product_1.default.findByIdAndUpdate(productId, {
                    $push: { Comments: Comment },
                    $set: { updatedAt: new Date() },
                }, {
                    new: true,
                    runValidators: true,
                });
                if (updateRes) {
                    res.status(200).json({
                        status: "success",
                        message: "Comment added successfully",
                        data: updateRes,
                    });
                    return;
                }
                else {
                    res.status(404).json({
                        status: "fail",
                        message: "Product not found",
                    });
                    return;
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error adding comment" });
                return;
            }
        });
    }
    getAllComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let productId = req.params.id;
            try {
                const product = yield product_1.default.findById(productId).select("Comments");
                if (!product) {
                    res.status(404).json({
                        status: "fail",
                        message: "Product not found",
                    });
                    return;
                }
                else {
                    res.status(200).json({
                        status: "success",
                        data: product,
                    });
                    return;
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching comments" });
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentId = req.params.commentId;
            let productId = req.params.id;
            let comment = req.body.comment;
            try {
                const product = yield product_1.default.findById(productId);
                if (!product) {
                    res.status(404).json({
                        status: "fail",
                        message: "Product not found",
                    });
                    return;
                }
                const commentsArray = Array.isArray(product.Comments)
                    ? product.Comments
                    : [];
                const commentToUpdate = commentsArray.find((comment) => comment._id.toString() === commentId);
                if (!commentToUpdate) {
                    res.status(404).json({
                        status: "fail",
                        message: "Comment not found",
                    });
                    return;
                }
                if (commentToUpdate.userId.toString() !== req.user.userID) {
                    res.status(401).json({
                        status: "fail",
                        message: "You are not authorized to update this comment",
                    });
                    return;
                }
                commentToUpdate.comment = comment;
                commentToUpdate.updatedAt = new Date();
                yield product.save();
                res.status(200).json({
                    status: "success",
                    message: "Comment updated successfully",
                    data: product.Comments,
                });
            }
            catch (error) {
                res.status(500).json({ message: "Error updating comment" });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentId = req.params.commentId;
            let productId = req.params.id;
            try {
                const product = yield product_1.default.findById(productId);
                if (!product) {
                    res.status(404).json({
                        status: "fail",
                        message: "Product not found",
                    });
                    return;
                }
                const commentsArray = Array.isArray(product.Comments)
                    ? product.Comments
                    : [];
                const commentToDelete = commentsArray.find((comment) => comment._id.toString() === commentId);
                if (!commentToDelete) {
                    res.status(404).json({
                        status: "fail",
                        message: "Comment not found",
                    });
                    return;
                }
                if (commentToDelete.userId.toString() !== req.user.userID) {
                    res.status(401).json({
                        status: "fail",
                        message: "You are not authorized to update this comment",
                    });
                    return;
                }
                const updatedComments = commentsArray.filter((comment) => comment._id.toString() !== commentId);
                product.Comments = updatedComments;
                yield product.save();
                res.status(200).json({
                    status: "success",
                    message: "Comment deleted successfully",
                    data: product.Comments,
                });
            }
            catch (error) {
                res.status(500).json({ message: "Error deleting comment" });
            }
        });
    }
}
exports.default = ProductControl;
