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
const customer_1 = __importDefault(require("../model/customer"));
const order_1 = __importDefault(require("../model/order"));
const product_1 = __importDefault(require("../model/product"));
const user_1 = __importDefault(require("../model/user"));
const cart_1 = __importDefault(require("../model/cart"));
class OrderService {
    constructor() { }
    handleCreateOrder(body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            if (decodedToken.role == "user") {
                console.log(body, "jjjjjjjjjjjjj");
                let adminsId = [];
                let total = 0;
                let products = [];
                try {
                    for (let i = 0; i < body.products.length; i++) {
                        yield product_1.default.updateOne({ _id: body.products[i].productId._id }, { $inc: { sold: body.products[i].quantity, quantity: -body.products[i].quantity } });
                        const adminId = body.products[i].productId.adminId;
                        if (typeof adminId === 'string' && !adminsId.includes(adminId)) {
                            adminsId.push(adminId);
                        }
                        total += Number(body.products[i].productId.price) * Number(body.products[i].quantity);
                        products.push(Object.assign(Object.assign({}, body.products[i].productId), { quantity: body.products[i].quantity }));
                    }
                    let body2 = { order_details: body.order_details, userId: decodedToken.userID, products };
                    const newOrder = new order_1.default(Object.assign(Object.assign({}, body2), { adminsId, total }));
                    yield newOrder.save();
                    const cart = yield cart_1.default.findOne({ userId: decodedToken.userID });
                    if (!cart)
                        return { status: "fail", message: "Cart not found" };
                    yield cart.deleteOne({ userId: decodedToken.userID });
                    // cart.products = [];
                    // await cart.save();
                    return {
                        status: "success",
                        message: "Order Created"
                    };
                }
                catch (errors) {
                    console.log(errors);
                    return {
                        status: "error",
                        errors
                    };
                }
            }
            else {
                return {
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                };
            }
        });
    }
    handlegetOrdersForUser(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            console.log(userId);
            if (decodedToken.role == "user") {
                try {
                    console.log(userId);
                    let orders = yield order_1.default.find({ userId: userId });
                    return {
                        status: "success",
                        orders
                    };
                }
                catch (errors) {
                    return {
                        status: "error",
                        errors
                    };
                }
            }
            else {
                return {
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                };
            }
        });
    }
    handledeleteSpecificOrder(orderId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            if (decodedToken.role == "user") {
                try {
                    // console.log(decodedToken.userID)
                    const order = yield order_1.default.findOneAndDelete({ _id: orderId });
                    if (!order) {
                        return {
                            status: "fail",
                            message: "order not found"
                        };
                    }
                    for (let i = 0; i < order.products.length; i++) {
                        yield product_1.default.updateOne({ _id: order.products[i]._id }, { $inc: { sold: -order.products[i].quantity, quantity: order.products[i].quantity } });
                    }
                    const remainingOrders = yield order_1.default.find({ userId: decodedToken.userID });
                    return {
                        status: "success",
                        message: "order deleted",
                        remainingOrders
                    };
                }
                catch (errors) {
                    return {
                        status: "error",
                        errors
                    };
                }
            }
            else {
                return {
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                };
            }
        });
    }
    handleDeletetAllOrder(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            if (decodedToken.role == "user") {
                try {
                    const orders = yield order_1.default.find({ userId: userId });
                    for (let order of orders) {
                        for (let product of order.products) {
                            yield product_1.default.updateOne({ _id: product._id }, { $inc: { quantity: product.quantity, sold: -product.quantity } });
                        }
                    }
                    const result = yield order_1.default.deleteMany({ userId: userId });
                    // console.log(order);
                    if (result.deletedCount > 0) {
                        return {
                            status: "success",
                            message: "order deleted"
                        };
                    }
                    else {
                        return {
                            status: "fail",
                            message: "order not found"
                        };
                    }
                }
                catch (errors) {
                    return {
                        status: "error",
                        errors
                    };
                }
            }
            else {
                return {
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                };
            }
        });
    }
    handleComplateOrder(orderId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            if (decodedToken.role == "admin") {
                try {
                    const order = yield order_1.default.findOneAndDelete({ _id: orderId });
                    const allOrder = yield order_1.default.find({});
                    console.log(order);
                    console.log("sssssssssssssssss", allOrder);
                    if (order === null || order === void 0 ? void 0 : order.id) {
                        const custometFound = yield customer_1.default.findOne({ userId: order.userId });
                        const userDetails = yield user_1.default.findOne({ _id: order.userId });
                        if (custometFound === null || custometFound === void 0 ? void 0 : custometFound._id) {
                            yield customer_1.default.updateOne({ userId: order.userId }, { $push: { orders: order } });
                        }
                        else {
                            const newCustomer = new customer_1.default({ orders: order, adminsId: order.adminsId, userDetails });
                            yield newCustomer.save();
                        }
                        return {
                            status: "success",
                            orders: allOrder,
                        };
                    }
                    else {
                        return {
                            status: "fail",
                            message: "order not found"
                        };
                    }
                }
                catch (errors) {
                    return {
                        status: "error",
                        errors
                    };
                }
            }
            else {
                return {
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                };
            }
        });
    }
    handleGetOrderForAdmin(adminId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            if (decodedToken.role == "admin") {
                try {
                    console.log(adminId);
                    let orders = yield order_1.default.find({ adminsId: adminId });
                    return {
                        status: "success",
                        orders
                    };
                }
                catch (errors) {
                    return {
                        status: "error",
                        errors
                    };
                }
            }
            else {
                return {
                    status: "Error",
                    message: "You are not authorized to access this resource!",
                };
            }
        });
    }
}
exports.default = OrderService;
