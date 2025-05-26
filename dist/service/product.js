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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const product_1 = __importDefault(require("../model/product"));
class ProductService {
    constructor() { }
    handleGetAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let products = yield product_1.default.find({});
                return {
                    status: "succes",
                    products,
                };
            }
            catch (errors) {
                return {
                    status: "fail",
                    errors,
                };
            }
        });
    }
    handleGetSpecificProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let product = yield product_1.default.find({ _id: id });
                if (product.length > 0) {
                    return {
                        status: "succes",
                        product,
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "product not found",
                    };
                }
            }
            catch (errors) {
                return {
                    status: "error",
                    errors,
                };
            }
        });
    }
    handleAddProduct(body, token, filenames) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tokenPart = token.split(" ")[1];
                let decodedToken = jsonwebtoken_1.default.verify(tokenPart, process.env.TOKEN_SECRET);
                if (decodedToken.role !== "admin") {
                    return {
                        status: "Error",
                        message: "You are not authorized to access this resource!",
                    };
                }
                body.images = [...filenames];
                let newProduct = new product_1.default(Object.assign(Object.assign({}, body), { imageCover: filenames[0], adminId: decodedToken.userID, category: { name: body.category }, createdAt: new Date() }));
                yield newProduct.save();
                return {
                    status: "success",
                    message: "product Added",
                    data: newProduct,
                };
            }
            catch (err) {
                return {
                    status: "error",
                    message: err,
                };
            }
        });
    }
    handleDeleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield product_1.default.deleteOne({ _id: id });
                return {
                    status: "succes",
                    message: "prodect Deleted Successfully",
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    message: errors,
                };
            }
        });
    }
    // async handleUpdateProduct(body: IProduct, id: string) {
    //   console.log(body);
    //   try {
    //     let product = await ProductModel.findByIdAndUpdate(
    //       id,
    //       { ...body, category: { name: body.category }, updatedAt: new Date() },
    //       {
    //         new: true,
    //         runValidators: true,
    //       }
    //     );
    //     if (product) {
    //       return {
    //         status: "success",
    //         product,
    //       };
    //     } else {
    //       return {
    //         status: "fail",
    //         message: "Product Not Found",
    //       };
    //     }
    //   } catch (errors) {
    //     return {
    //       status: "error",
    //       errors,
    //     };
    //   }
    // }
    handleUpdateProduct(body, id, filenames) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("filenames", filenames);
                body.images = filenames;
                body.imageCover = filenames[0];
                let product = yield product_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, body), { category: { name: body.category }, updatedAt: new Date() }), {
                    new: true,
                    runValidators: true,
                });
                if (product) {
                    return {
                        status: "success",
                        product,
                    };
                }
                else {
                    return {
                        status: "fail",
                        message: "Product Not Found",
                    };
                }
            }
            catch (err) {
                return {
                    status: "error",
                    message: err,
                };
            }
        });
    }
}
exports.default = ProductService;
