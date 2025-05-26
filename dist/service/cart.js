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
const cart_1 = __importDefault(require("../model/cart"));
const product_1 = __importDefault(require("../model/product"));
const coupon_1 = __importDefault(require("../model/coupon"));
class CartService {
    handleAddToCart(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.default.findById({ _id: productId });
            if (!product)
                return { status: "fail", message: "Product not found" };
            let userCart = yield cart_1.default.findOne({ userId });
            console.log("userCart", userCart);
            if (userCart) {
                const existingProduct = userCart.products.find((p) => p.productId.toString() === productId);
                if (existingProduct) {
                    return { status: "fail", message: "Product already in cart" };
                }
                userCart.products.push({
                    productId,
                    quantity: 1,
                    price: Number(product.price),
                });
                yield userCart.save();
            }
            if (!userCart) {
                userCart = yield cart_1.default.create({
                    userId,
                    products: [
                        {
                            productId,
                            quantity: 1,
                            price: Number(product.price),
                        },
                    ],
                });
            }
            return { status: "success", message: "Product added to cart", cart: userCart };
        });
    }
    // Get user cart
    handleGetCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield cart_1.default.findOne({ userId }).populate({
                path: "products.productId",
                model: "product",
            });
            if (!cart) {
                return { status: "fail", message: "Cart is empty" };
            }
            return { status: "success", cart };
        });
    }
    // Remove product from cart
    handleRemoveProduct(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield cart_1.default.findOne({ userId });
            if (!cart)
                return { status: "fail", message: "Cart not found" };
            const initialLength = cart.products.length;
            cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
            if (cart.products.length === initialLength) {
                return { status: "fail", message: "Product not in cart" };
            }
            yield cart.save();
            return { status: "success", message: "Product removed", cart };
        });
    }
    // Update product quantity in cart
    handleUpdateQuantity(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity < 1) {
                return { status: "fail", message: "Quantity must be at least 1" };
            }
            const cart = yield cart_1.default.findOne({ userId });
            if (!cart)
                return { status: "fail", message: "Cart not found" };
            const productInCart = cart.products.find((p) => p.productId.toString() === productId);
            if (!productInCart) {
                return { status: "fail", message: "Product not found in cart" };
            }
            productInCart.quantity = quantity;
            yield cart.save();
            return { status: "success", message: "Quantity updated", cart };
        });
    }
    // Clear all products from cart
    handleClearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCart = yield cart_1.default.findOneAndDelete({ userId });
            if (!deletedCart) {
                return { status: "fail", message: "Cart not found" };
            }
            return { status: "success", message: "Cart deleted completely" };
        });
    }
    // Apply coupon to cart
    applyCoupon(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield coupon_1.default.findOne({ code });
                if (!coupon) {
                    return { status: "fail", message: "Invalid coupon code." };
                }
                if (coupon.expiresAt < new Date()) {
                    return { status: "fail", message: "Coupon has expired." };
                }
                const cart = yield cart_1.default.findOne({ userId }).populate('products.productId');
                if (!cart) {
                    return { status: "fail", message: "Cart not found." };
                }
                const discountAmount = cart.products.reduce((total, item) => {
                    const productPrice = item.productId.price;
                    return total + item.quantity * productPrice;
                }, 0) * 0.2;
                cart.discount = discountAmount;
                yield cart.save();
                return {
                    status: "success",
                    message: "Coupon applied successfully.",
                    data: {
                        discountAmount,
                        totalAfterDiscount: cart.products.reduce((total, item) => {
                            const productPrice = item.productId.price;
                            return total + item.quantity * productPrice;
                        }, 0) - discountAmount,
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: "fail", message: "Something went wrong." };
            }
        });
    }
}
exports.default = CartService;
